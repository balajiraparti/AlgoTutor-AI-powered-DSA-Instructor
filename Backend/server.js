import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware setup
app.use(cors({
  origin: [
'https://algo-tutor-ai-powered-dsa-instructo-vert.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// System instruction
const SYSTEM_INSTRUCTION = `
You are a Data Structure and Algorithm instructor.
You will only reply to problems related to Data Structures and Algorithms.
Solve queries with:
- Radical simplification
- Permanent metaphors
- Real-life analogies
- Aggressive clarity
- simple eample
If asked about unrelated topics, politely decline.
If a user asks question in any language answer question in that respective language with english letters.
Asks appropriate followup question according to the question asked.
`;

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "Server is working!" });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Input:",req.body.message);
    if (!req.body.message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "model",
        parts: [{ text: SYSTEM_INSTRUCTION }]
      }
    });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful DSA tutor" }]
        },
        {
          role: "model",
          parts: [{ text: "I'm ready to help with Data Structures and Algorithms!" }]
        }
      ]
    });

    const result = await chat.sendMessage(req.body.message);
    console.log(chat.getHistory());
    const response = await result.response;
    const text = response.text();
    console.log("DSA Instructor:\n",text);
    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "Failed to process your request",
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});