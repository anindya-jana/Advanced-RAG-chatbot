import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("REACT_APP_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
});

export function createChatSession() {
  const chat = model.startChat({
    history: [],
  });
  return chat;
}
