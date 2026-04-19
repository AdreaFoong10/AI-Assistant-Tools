# Gemini AI Express Project

A simple project using **Node.js + Express + TypeScript** integrated with **AI Models**, with simple frontend interface.

---

## Prerequisites

1. Install dependencies:
   `npm install`
2. Create a .env.local file in the root directory
3. Add your Gemini API key:
4. GEMINI_API_KEY=your_gemini_api_key
5. OPENROUTER_API_KEY=your_openRouter_api_key
6. Create dist and uploads folder in root directory

## How It Works

1. User enters a prompt in the browser
2. Frontend sends request to Express API
3. Backend calls AI API
4. AI response is returned to frontend
5. Result is displayed in the browser

## How to Change AI Model

1. Open gemini-pro.ts
2. Find:
    genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
3. Replace with supported models:
 - gemini-1.5-flash (fast, recommended)
 - gemini-1.5-pro (higher quality, slower)

## How to Run the Project

1. Run `npm run dev` in terminal
2. Open http://localhost:3000
