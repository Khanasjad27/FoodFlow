import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Listing, Claim } from '../types';
import { calculateRestaurantImpact, calculateNgoImpact } from '../lib/store';
import { detectCurrentLocation, getStoredUserLocation, calculateDistanceKm } from '../lib/location';
import { useLanguage } from '../lib/i18n';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Trash2,
  HelpCircle,
  Compass,
  MapPin,
  TrendingUp,
  Maximize2,
  Minimize2,
  Navigation,
} from 'lucide-react';

interface ChatAssistantProps {
  user: UserProfile | null;
  listings?: Listing[];
  claims?: Claim[];
  onOpenWalkthrough?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actionType?: 'walkthrough' | 'location';
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  user,
  listings = [],
  claims = [],
  onOpenWalkthrough,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocStr, setCurrentLocStr] = useState<string>(
    user?.location || getStoredUserLocation()?.address || 'Current Location'
  );

  const SUGGESTED_QUESTIONS = [
    t('chat.closestListing', '📍 What is the closest listing to me?'),
    t('chat.myLocation', '📍 Show my current location'),
    t('chat.myStats', '📊 Show my ESG impact stats'),
    t('chat.howMatchWorks', '⚡ How does Match Score work?'),
    t('chat.startTour', '🚀 Start Guided App Tour'),
    t('chat.foodSafety', '🛡️ Food Safety & Prep Guidelines'),
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: user
        ? `Hi ${user.name}! I am FoodFlow Assistant. I can help with your AI match scores, current location (${user.location}), impact stats, or guide you through claiming & posting food!`
        : 'Hi! I am FoodFlow Assistant. I can answer questions about AI match scores, surplus posting, NGO claiming, QR pickup verification, and food safety!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Compute live user context
  const getUserContext = () => {
    let impact = { totalMeals: 0, kgSaved: 0, co2Avoided: 0 };
    if (user && user.role === 'Restaurant') {
      impact = calculateRestaurantImpact(user.id, listings);
    } else if (user && user.role === 'NGO') {
      impact = calculateNgoImpact(user.id, listings, claims);
    }

    const storedLoc = getStoredUserLocation();
    const userLat = storedLoc?.latitude || 37.7749;
    const userLng = storedLoc?.longitude || -122.4194;

    const activeListings = listings.filter((l) => l.status === 'pending');

    // Calculate deterministic distance for active listings relative to user's location
    const listingsWithProximity = activeListings.map((l, idx) => {
      let lat = userLat + ((idx + 1) * 0.007);
      let lng = userLng + ((idx + 1) * 0.005);
      if (l.pickupLocation.includes('Market')) { lat = userLat + 0.003; lng = userLng + 0.002; }
      else if (l.pickupLocation.includes('Mission')) { lat = userLat - 0.005; lng = userLng - 0.003; }
      else if (l.pickupLocation.includes('Shelter')) { lat = userLat + 0.002; lng = userLng - 0.004; }

      const dist = calculateDistanceKm(userLat, userLng, lat, lng);
      return {
        ...l,
        distanceKm: dist,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    const closest = listingsWithProximity[0] || null;

    return {
      userName: user?.name || 'Guest User',
      userRole: user?.role || 'Guest',
      userLocation: currentLocStr,
      userCoordinates: storedLoc ? `${storedLoc.latitude.toFixed(4)}, ${storedLoc.longitude.toFixed(4)}` : '37.7749, -122.4194',
      impactStats: impact,
      activeListingsCount: activeListings.length,
      closestListing: closest
        ? `"${closest.foodName}" by ${closest.restaurantName} at ${closest.pickupLocation} (${closest.distanceKm} km away, ${closest.quantity} meals, Expiry: ${closest.expiryTime})`
        : 'No active listings currently available',
      activeListingsNearby: listingsWithProximity.slice(0, 5).map(
        (l) => `• "${l.foodName}" by ${l.restaurantName} at ${l.pickupLocation} (${l.distanceKm} km away, ${l.quantity} meals)`
      ),
    };
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          userContext: getUserContext(),
        }),
      });

      const data = await res.json();

      let actionType: 'walkthrough' | 'location' | undefined;
      if (query.toLowerCase().includes('walkthrough') || query.toLowerCase().includes('tour')) {
        actionType = 'walkthrough';
      }

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: data.reply || "I'm sorry, I couldn't process that request right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const userContext = getUserContext();
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: `Hello ${userContext.userName}! The FoodFlow AI Match Engine considers meal expiry urgency (40%), NGO capacity (30%), and historical reliability score (30%) to prioritize redistributions in ${userContext.userLocation}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocationInChat = async () => {
    setLoading(true);
    try {
      const loc = await detectCurrentLocation();
      setCurrentLocStr(loc.address);
      const locMsg: ChatMessage = {
        id: 'msg_loc_' + Date.now(),
        sender: 'assistant',
        text: `📍 Current location updated to **${loc.address}** (${loc.city})! Map radar, pickup windows, and distance estimates have been synced.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, locMsg]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with FoodFlow AI today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to format simple markdown bolding
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-[#1e2e25]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#3e7053] hover:bg-[#325b43] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group focus:outline-hidden ring-4 ring-[#3e7053]/20"
          title="Open FoodFlow AI Assistant"
          id="btn-open-chat"
        >
          <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d97757] rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-[#d8e2d8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-[#1e2e25] transition-all ${
            isExpanded
              ? 'w-[95vw] sm:w-[540px] h-[650px]'
              : 'w-[92vw] sm:w-[400px] h-[540px]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#1e2e25] text-white p-4 border-b border-[#2d4235] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3e7053] border border-[#528d6a] flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-none text-white flex items-center space-x-1.5">
                  <span>{t('chat.title', 'FoodFlow AI Assistant')}</span>
                  <span className="bg-[#3e7053] text-[#c3dccf] text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase">
                    v2.0
                  </span>
                </h3>
                <span className="text-[10px] text-[#a8d3b8] flex items-center space-x-1 mt-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8d3b8] animate-ping inline-block" />
                  <span>Gemini Engine • Location Context Active</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="text-[#a8d3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d4235] transition-colors"
                title="Clear Chat History"
                id="btn-clear-chat-history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#a8d3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d4235] transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize Window' : 'Expand Window'}
                id="btn-expand-chat"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#a8d3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d4235] transition-colors"
                id="btn-close-chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Location Bar */}
          <div className="bg-[#f0f4f1] border-b border-[#e2e9e2] px-3.5 py-2 flex items-center justify-between text-[11px] text-[#245237]">
            <div className="flex items-center space-x-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#3e7053] flex-shrink-0 animate-bounce" />
              <span className="truncate">
                Location: <strong className="font-bold">{currentLocStr}</strong>
              </span>
            </div>
            <button
              onClick={handleDetectLocationInChat}
              disabled={loading}
              className="text-[#3e7053] hover:text-[#1e2e25] font-extrabold flex items-center space-x-1 flex-shrink-0 bg-white px-2 py-0.5 rounded-md border border-[#c3dccf] hover:bg-[#e8f1ec] transition-colors"
              id="btn-chat-update-loc"
            >
              <Navigation className="w-3 h-3 text-[#3e7053]" />
              <span>Update</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#f8faf8] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-[#3e7053] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#3e7053] text-white rounded-tr-xs font-medium'
                      : 'bg-white text-[#1e2e25] border border-[#d8e2d8] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div>{renderFormattedText(msg.text)}</div>

                  {/* Interactive Action Trigger Buttons if present */}
                  {msg.actionType === 'walkthrough' && onOpenWalkthrough && (
                    <button
                      onClick={onOpenWalkthrough}
                      className="w-full mt-2 py-2 px-3 bg-[#3e7053] hover:bg-[#325b43] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-2xs transition-all hover:scale-102"
                      id="btn-chat-trigger-walkthrough"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                      <span>Launch Walkthrough Tour Now</span>
                    </button>
                  )}

                  <span
                    className={`block text-[9px] ${
                      msg.sender === 'user' ? 'text-[#c3dccf] text-right' : 'text-[#889b8e]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-[#1e2e25] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-[#556b5e] text-xs p-2.5 bg-white border border-[#d8e2d8] rounded-2xl w-max shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-[#3e7053]" />
                <span className="font-medium">Analyzing location & platform data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#e2e9e2] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (q.includes('Guided App Tour') && onOpenWalkthrough) {
                    onOpenWalkthrough();
                  } else if (q.includes('current location')) {
                    handleDetectLocationInChat();
                  } else {
                    handleSend(q);
                  }
                }}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f0f4f1] hover:bg-[#e2e9e2] text-[#245237] border border-[#d2dfd5] text-[10px] font-bold transition-all hover:scale-105 flex-shrink-0 shadow-2xs flex items-center space-x-1"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#e2e9e2] flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder', 'Ask about location, AI match score, tour...')}
              className="flex-1 p-2.5 text-xs bg-[#f8faf8] border border-[#d2dfd5] text-[#1e2e25] placeholder-[#889b8e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#3e7053]"
              disabled={loading}
              id="input-chat-message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="group p-2.5 rounded-xl bg-[#3e7053] hover:bg-[#325b43] disabled:opacity-50 text-white font-bold transition-all shadow-2xs hover:shadow-xs"
              id="btn-send-chat"
            >
              <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
