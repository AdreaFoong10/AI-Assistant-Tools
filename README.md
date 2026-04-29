# AI Assistant Tool (RAG + Gemini / OpenRouter Integration)

A full-stack AI Assistant project built using:

- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite
- AI Integration: Gemini API + OpenRouter API
- Features: Prompt handling, file upload, RAG (Retrieval-Augmented Generation), session history

---

## Features

- AI provider support (Gemini / OpenRouter)
- RAG-based document question answering
- File upload + text extraction (Multer)
- Embedding + cosine similarity retrieval
- Session-based chat history
- Simple full-stack architecture (React ↔ Express API)

---

## Prerequisites

### 1. Install dependencies
- Go to root directory
- run `npm install-all`

This will:

- Run `npm install` in the `server/` folder
- Run `npm install` in the `client/` folder

---

### 3. Build the project

- In root directory
- run `npm run build`

---

### 4. Create required folder **[Currently redundent as files not used]**

Create an `uploads/` folder in the root directory :

- uploads/

(This is required for temporary file storage during uploads)

---

## Local Development

When running locally, two servers will be active:

- Frontend (React + Vite): http://localhost:5173
- Backend (Express API): http://localhost:3000

The frontend communicates with the backend using REST API requests.

---

## How It Works

1. User enters a prompt in the UI
2. Frontend sends request to backend (`/generate`)
3. Backend processes request:
   - Optional file upload handling
   - RAG processing (if enabled)
   - AI model selection (Gemini / OpenRouter)
4. AI generates a response
5. Backend returns result to frontend
6. UI displays response and stores chat history

---

## RAG System (How It Works Internally)

When a file is uploaded:

1. File is read and text is extracted
2. Text is split into chunks
3. Each chunk is converted into embeddings
4. Cosine similarity is used to find relevant chunks
5. Top results are passed into the AI prompt
6. AI generates a context-aware response

---

## How to Change AI Model

### Gemini

Open:

- src/services/gemini-pro.ts

Find:

- model: "gemini-1.5-flash"

Replace with a supported Gemini model.

---

### OpenRouter

Open:

- src/services/openrouter.ts

Find:

- model: "nvidia/nemotron-3-super-120b-a12b:free"

Replace with a supported OpenRouter model.

---

## Run the Project

Start development server:

- npm run dev

Then open:

- http://localhost:5173/

---

## Notes

- Uploaded files are stored temporarily in `uploads/`
- Session history is stored in-memory (not persistent)

---

## Tech Stack

- Node.js
- Express
- TypeScript
- React
- Vite
- Multer
- Embeddings + Cosine Similarity
- Gemini API / OpenRouter API
