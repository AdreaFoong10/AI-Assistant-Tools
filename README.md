# Gemini AI Express Project

A simple project using **Node.js + Express + TypeScript** Backend Logic, **React + Vite** Frontend logic integrated with **AI Models**

---

## Prerequisites

1. Install dependencies:
   `npm install-all`
   - command actions :
     - This will run `npm install` in root directory and in client folder
2. Create a .env.local file in the root directory
3. Add your Gemini API key:
4. GEMINI_API_KEY=your_gemini_api_key
5. OPENROUTER_API_KEY=your_openRouter_api_key
6. Run `npm run build` in root directory
7. Create uploads folder in root directory

## Local Development URLs

When running the project locally, two servers will be running:

- Frontend (React + Vite): http://localhost:5173
- Backend (Express API): http://localhost:3000

The frontend communicates with the backend through API requests (fetch), even though both are running on your local machine.

## How It Works

1. User enters a prompt in the browser
2. Frontend sends request to Express API
3. Backend calls AI API
4. AI response is returned to frontend
5. Result is displayed in the browser

## How to Change AI Model

1. Open gemini-pro.ts or openrouter.ts in src/services
2. Find:
   genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) or model: 'nvidia/nemotron-3-super-120b-a12b:free'
3. Replace **gemini-1.5-flash** or **nemotron-3-super-120b-a12b:free** with supported models based on your API key.

## How to Run the Project

1. Run `npm run dev` in terminal
2. Open http://localhost:5173/
