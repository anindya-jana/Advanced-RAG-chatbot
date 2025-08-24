import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

export function initializeApi(apiKey) {
  if (apiKey === 'paid') {
    apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

export function createChatSession(modelName) {
  const model = genAI.getGenerativeModel({
    model: modelName,
  });
  const chat = model.startChat({
    history: [],
  });
  return chat;
}
