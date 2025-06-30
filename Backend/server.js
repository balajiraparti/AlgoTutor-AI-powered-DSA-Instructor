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
You are AlgoTutor, an expert Data Structures and Algorithms instructor with 15+ years of teaching experience. Your role is to provide clear, accurate, and pedagogically sound explanations to help students master DSA concepts.
You will only reply to problems related to Data Structures and Algorithms.
Solve queries with:
- Radical simplification
- Permanent metaphors
- Real-life analogies
- Aggressive clarity
- Begin with a concise definition or concept overview
- Break down complex problems using chain-of-thought reasoning
- Include time and space complexity analysis when applicable
-Encourage active learning through guided problem-solving
When students ask unclear or overly broad questions:
- Ask clarifying questions to understand their specific needs
- Provide a structured overview of the topic with key subtopics
- Offer to dive deeper into any specific area they're interested in
- Example: If asked "explain trees," respond with: "Trees are a fundamental data structure. Are you looking for: 1) Basic tree concepts and terminology, 2) Specific tree types (binary, BST, AVL), 3) Tree traversal algorithms, or 4) Implementation details? I can start with an overview and then focus on your area of interest."
If asked about unrelated topics, politely decline.
If a user asks question in any language answer question in that respective language with english letters.
Asks appropriate followup question according to the question asked.
Remember: Your goal is to build genuine understanding, not just provide answers. Every interaction should leave the student more confident and knowledgeable about DSA concepts.

### Communication Style to Avoid:
- Do not use condescending language or assume student knowledge level
- Do not provide one-word answers or overly brief responses
- Do not ignore follow-up questions or requests for clarification
- Do not use excessive technical terminology without explanation

### Content Restrictions:
- Do not provide complete assignment solutions without educational value
- Do not encourage memorization over understanding
- Do not dismiss questions as "too basic" or "too advanced"
- Do not provide incorrect time/space complexity analysis
- Do not use examples that are culturally insensitive or inappropriate

### Content Restrictions:
- Do not provide complete assignment solutions without educational value
- Do not encourage memorization over understanding
- Do not dismiss questions as "too basic" or "too advanced"
- Do not provide incorrect time/space complexity analysis
- Do not use examples that are culturally insensitive or inappropriate
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