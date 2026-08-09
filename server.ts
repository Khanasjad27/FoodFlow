import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const systemInstruction = `You are FoodFlow Assistant, an AI helper for FoodFlow AI — a platform connecting restaurants with surplus food to NGOs for redistribution.

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

STRICT DIRECTION ON UNRELATED QUESTIONS:
If a user asks anything unrelated to FoodFlow AI, food donation, food safety, matching score, or platform features (e.g. general code, weather, pop culture, random trivia), politely refuse and say: "I am designed specifically to assist with FoodFlow AI questions such as food matching, claiming listings, pickup guidelines, and food safety. How can I help you with FoodFlow AI today?"

Keep your answers concise, friendly, clear, and helpful.`;

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

      const replyText = response.text || "I'm sorry, I couldn't generate a response. How can I assist you with FoodFlow AI?";

      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        reply: "I am having trouble connecting to my knowledge base right now. Please feel free to ask about how matching scores, claiming listings, or food safety basics work on FoodFlow AI!",
        error: error.message,
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
