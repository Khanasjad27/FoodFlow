import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper function for intelligent fallback responses when Gemini API is unavailable or quota is depleted
function getRuleBasedResponse(message: string, userContext?: any): string {
  const lower = message.toLowerCase();

  const userName = userContext?.userName || 'Partner';
  const userRole = userContext?.userRole || 'User';
  const userLocation = userContext?.userLocation || 'Your Area';
  const totalMeals = userContext?.impactStats?.totalMeals ?? 0;
  const activeCount = userContext?.activeListingsCount ?? 0;

  if (lower.includes("my location") || lower.includes("where am i") || lower.includes("current location") || lower.includes("city")) {
    return `Your detected location is currently **${userLocation}**. All distance estimates, pickup radar map pins, and nearby listings are calculated relative to this location!`;
  }
  if (lower.includes("closest") || lower.includes("nearest") || lower.includes("near me") || lower.includes("nearby")) {
    if (userContext?.closestListing && userContext.closestListing !== 'No active listings currently available') {
      return `The closest listing to you in **${userLocation}** is ${userContext.closestListing}.`;
    }
    return `There are currently no active food listings near **${userLocation}**. Check back soon or post a new surplus item from your dashboard!`;
  }
  if (lower.includes("my impact") || lower.includes("my stats") || lower.includes("how many meals") || lower.includes("donated") || lower.includes("rescued")) {
    return `Hello ${userName}! As a ${userRole}, you have achieved **${totalMeals} meals** saved/rescued on FoodFlow AI! You currently have **${activeCount} active items**. Keep up the fantastic community impact!`;
  }
  if (lower.includes("match") || lower.includes("score") || lower.includes("rating") || lower.includes("algorithm")) {
    return "The FoodFlow AI Match Score (0–100%) prioritizes food distribution based on 3 key factors: Urgency (up to 40 pts based on time to expiry), Capacity (30 pts for NGO capacity), and NGO Reliability Score (up to 30 pts based on pickup history).";
  }
  if (lower.includes("claim") || lower.includes("reserve")) {
    return "NGOs can browse available surplus listings on their dashboard sorted by highest Match Score. Clicking 'Claim Food Donation' reserves the item instantly and reveals the restaurant's location and QR pickup verification code.";
  }
  if (lower.includes("pickup") || lower.includes("qr") || lower.includes("confirm") || lower.includes("code")) {
    return "When collecting food, the NGO volunteer confirms the pickup or presents their verification code. Once confirmed, the listing status updates to 'picked_up' and both partners receive updated ESG impact stats!";
  }
  if (lower.includes("safety") || lower.includes("temp") || lower.includes("storing") || lower.includes("guideline")) {
    return "Food safety guidelines: Keep hot foods above 140°F (60°C) and cold foods below 40°F (4°C). Ensure all items are packaged in clean, food-grade containers and labeled with prep and expiration dates.";
  }
  if (lower.includes("type") || lower.includes("post") || lower.includes("accept") || lower.includes("surplus") || lower.includes("item")) {
    return "You can post unexpired or near-expiry surplus food including prepared meals, bakery items, fresh produce, packaged goods, sandwiches, and soups. Ensure items are wholesome and stored safely.";
  }
  if (lower.includes("tier") || lower.includes("milestone") || lower.includes("badge") || lower.includes("gold") || lower.includes("silver") || lower.includes("bronze")) {
    return "Partner Tiers recognize your community contribution! Bronze is entry level, Silver unlocks at 100+ meals rescued, and Gold Champion unlocks at 500+ meals. Unlocking tiers awards custom badges and celebratory overlays.";
  }

  return `Hello ${userName}! I am FoodFlow Assistant. I can answer questions about your current location (${userLocation}), impact stats (${totalMeals} meals), AI match scores, surplus postings, NGO claiming, QR pickups, and food safety standards. How can I assist you today?`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Route: FoodFlow Assistant Gemini AI Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userContext } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const userDetailStr = userContext
        ? `CURRENT USER CONTEXT & PROXIMITY RADAR:
Name: ${userContext.userName || 'Anonymous'}
Role: ${userContext.userRole || 'Guest'}
Location Address: ${userContext.userLocation || 'Unknown'}
Location Coordinates: ${userContext.userCoordinates || '37.7749, -122.4194'}
Meals Saved/Rescued: ${userContext.impactStats?.totalMeals ?? 0}
Kg Saved: ${userContext.impactStats?.kgSaved ?? 0} kg
CO2 Avoided: ${userContext.impactStats?.co2Avoided ?? 0} kg
Active Listings Count: ${userContext.activeListingsCount ?? 0}
CLOSEST LISTING TO USER: ${userContext.closestListing || 'None'}
NEARBY ACTIVE LISTINGS:
${Array.isArray(userContext.activeListingsNearby) ? userContext.activeListingsNearby.join('\n') : 'None'}`
        : '';

      const systemInstruction = `You are FoodFlow Assistant, an AI helper for FoodFlow AI — a platform connecting restaurants with surplus food to NGOs for redistribution.

${userDetailStr}

YOUR SCOPE & KNOWLEDGE BASE:
1. Matching Score:
   - Ranges from 0% to 100%.
   - Formula = Urgency Score (up to 40 pts based on time to expiry) + Capacity Score (30 pts fixed) + NGO Reliability Score (up to 30 pts based on NGO's history/score out of 100).
   - Higher matching scores highlight listings that need immediate redistribution to dependable NGOs.

2. Food Types & Quantity Guidelines:
   - Accepted items: Prepared meals, bakery & bread, fresh produce & fruits, packaged/dairy items, sandwiches, salads, and soups.
   - Food must be wholesome, unexpired or near-expiry, stored safely in clean containers.

3. Claiming Process:
   - NGOs view live listings on their dashboard, sorted by highest Match Score.
   - Clicking "Claim" reserves the listing, creates a claim record, and reveals the restaurant's contact details and QR pickup verification code.

4. Pickup Confirmation:
   - When the NGO collects the food from the restaurant, the NGO clicks "Confirm Pickup".
   - The status updates to 'picked_up', revealing impact stats for both the restaurant and NGO.

5. Impact Stats:
   - Meals Saved = Food quantity x 10
   - Food Weight Saved = Food quantity x 0.4 kg
   - CO2 Avoided = Food Weight x 2.5 kg CO2

6. Food Safety Basics:
   - Keep hot foods hot (above 140°F / 60°C) and cold foods cold (below 40°F / 4°C).
   - Label items with preparation and expiry date/time.
   - Transport food in clean, insulated food containers.

7. Proximity & Location Guidance:
   - Always use the user's current location context and proximity details provided above when answering questions about nearby food, closest pickup, distance, or address recommendations.
   - When asked "What is the closest listing to me?" or "Where can I pick up food near me?", explicitly answer with: "The closest listing to you is at [Address] ([Distance] away)..." giving exact title, address, restaurant name, and meal count directly from the context.

STRICT DIRECTION ON UNRELATED QUESTIONS:
If a user asks anything unrelated to FoodFlow AI, food donation, food safety, matching score, or platform features, politely refuse and answer about FoodFlow AI.

Keep your answers concise, friendly, clear, and helpful.`;

      let replyText = "";

      if (apiKey) {
        try {
          // Build context from history if provided
          let promptText = message;
          if (Array.isArray(history) && history.length > 0) {
            const historyContext = history
              .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
              .join('\n');
            promptText = `Conversation history:\n${historyContext}\n\nCurrent User Question: ${message}`;
          }

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: promptText,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          replyText = response.text || "";
        } catch (geminiErr: any) {
          console.warn("Gemini API call encountered an error (e.g., quota or network), switching to local knowledge engine:", geminiErr?.message || geminiErr);
          replyText = getRuleBasedResponse(message, userContext);
        }
      }

      if (!replyText) {
        replyText = getRuleBasedResponse(message, userContext);
      }

      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chat endpoint error:", error);
      return res.json({
        reply: getRuleBasedResponse(req.body?.message || "", req.body?.userContext),
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "FoodFlow AI" });
  });

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FoodFlow AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
