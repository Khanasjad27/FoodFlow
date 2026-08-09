# 🍽️ FoodFlow AI

**Turning surplus into support — before it's too late.**

FoodFlow AI is a smart food-redistribution platform that connects restaurants with surplus food directly to nearby NGOs, using an intelligent match-scoring engine so the most suitable, fastest-responding NGO gets notified first — before the food spoils.

🔗 **Live Demo:** [food-flow-phi.vercel.app](https://food-flow-phi.vercel.app/)
📦 **Repository:** [github.com/Khanasjad27/FoodFlow](https://github.com/Khanasjad27/FoodFlow)

Built for **Hack Devengers 1.0** (Open Innovation Track).

---

## 🚨 The Problem

Every day, restaurants prepare more food than they sell — leftover buffet items, unsold bakery stock, over-prepared catering batches. Most of this edible surplus is thrown away, not because it's spoiled, but because there's **no fast, reliable way to connect restaurants with an NGO that can collect and distribute it before it goes to waste.**

Meanwhile, NGOs and shelters struggle with inconsistent supply — relying on phone calls and word of mouth to find out which restaurant has surplus food, often too late.

Good food and hungry people exist in the same city, often minutes apart. FoodFlow AI closes that gap in real time.

---

## ✨ Key Features

- 🔐 **Simple Auth** — Email/password signup with role selection (Restaurant / NGO), no OTP or email verification friction
- 🏪 **Restaurant Dashboard** — Post surplus food listings in seconds (food type, quantity, expiry window, pickup location)
- 🤝 **NGO Dashboard** — Live, ranked feed of nearby food listings, sorted by a smart match score
- 🎯 **Smart Match-Scoring Engine** — Ranks NGOs for each listing based on:
  - **Urgency** — less time to expiry = higher priority
  - **Capacity fit** — matches listing size to NGO intake capacity
  - **Reliability** — NGO's past pickup completion history
- 📱 **QR Code Pickup Confirmation** — Each claimed listing generates a QR code for quick, verifiable handoff
- 📊 **Impact Dashboard** — Real-time stats on meals saved, kilograms of food redirected, and estimated CO₂ emissions avoided
- 🤖 **FoodFlow Assistant (AI Chatbot)** — In-app chatbot powered by the Gemini API that answers questions about how matching, claiming, and pickups work
- 📱 **Fully Responsive** — Clean, modern UI that works seamlessly on both desktop and mobile

---

## 🔄 How It Works

1. **Restaurant** posts a surplus food listing — food type, quantity, expiry window, and pickup location
2. **Matching engine** scores and ranks nearby NGOs based on urgency, capacity, and reliability
3. **NGO** sees the listing in their live feed, ranked by match score, and claims it
4. **Restaurant** confirms the claim and generates a QR code for pickup
5. **NGO** scans/confirms pickup — food reaches people instead of a landfill
6. Both sides track their impact on a live dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | `server.ts` (Node/Bun server) |
| Database & Auth | Supabase (Postgres + Auth) |
| AI Assistant | Gemini API |
| QR Code Generation | qrcode.react |
| Package Manager | Bun |
| Hosting | Vercel |
| Scaffold | Built with [Google AI Studio](https://aistudio.google.com) ([aistudio-repository-template](https://github.com/google-gemini/aistudio-repository-template)) |

---

## 👥 Who It's For

- **Restaurants, cafés, caterers, and cloud kitchens** with recurring surplus food
- **NGOs, shelters, and community kitchens** distributing food to people in need

---

## 🚀 Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/Khanasjad27/FoodFlow.git
cd FoodFlow

# Install dependencies
bun install
# (or: npm install)

# Set up environment variables
cp .env.example .env
```

Then open `.env` and fill in your real values:

```bash
GEMINI_API_KEY="your_actual_gemini_api_key"
APP_URL="http://localhost:5173"
```

Set up your Supabase database by running the schema file:

```bash
# In the Supabase SQL editor, run the contents of:
supabase-schema.sql
```

Then start the dev server:

```bash
bun run dev
# (or: npm run dev)
```

> ⚠️ `.env` is included in `.gitignore` and should **never** be committed. Only `.env.example` (with placeholder values) belongs in the repository.

---

## 📁 Project Structure

```
FoodFlow/
├── src/                   # Frontend source code
├── server.ts              # Backend server
├── supabase-schema.sql    # Database schema
├── metadata.json          # AI Studio app metadata
├── vite.config.ts         # Vite configuration
├── .env.example           # Environment variable template
└── package.json
```

---

## 📈 Stretch Goals

- Ratings after each handoff (feeds back into NGO reliability scoring)
- Real-time notifications for high-match listings
- Map view of nearby listings
- Leaderboard of top-donating restaurants and top-distributing NGOs

---

## 🏆 Built For

**Hack Devengers 1.0** — Open Innovation Track
Team Devengers | 9 August 2026

---

## 📄 License

This project was built for hackathon purposes as part of Hack Devengers 1.0.
