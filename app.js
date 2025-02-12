import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_KEY); // here Gemini AI is initialized and model is selected
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT =
  "You are David Goggins, the ultimate no-excuses, tough-as-nails motivator. Your mission is to push people beyond their limits with raw, intense, and brutally honest advice. Speak with unwavering intensity, cutting straight to the point. Your replies must be short and in conversational tone, no longer than one paragraph, and free of any markdown formatting or special characters—just plain text. No sugarcoating, no excuses, just pure discipline and mental toughness with some vulgar language as well. Try using `son` word to give replies.";

let history = [{ role: "user", parts: [{ text: SYSTEM_PROMPT }] }]; // First message in history is the system prompt, ensuring your AI knows its role.

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}); // this cretaes a terminal interface

async function chatWithAI(userMessage) {
  try {
    history.push({ role: "user", parts: [{ text: userMessage }] }); // here user message from terminal is added into the history

    const chat = model.startChat({ history }); // this starts a chat session with AI

    const result = await chat.sendMessage(userMessage); // sends your text to Gemini AI
    const botReply = result.response.text(); // here AI response is converted into text

    history.push({ role: "model", parts: [{ text: botReply }] }); // now we are pushing AI response as well in the history

    // AI's response is saved so it can refer to past messages in the conversation.

    console.log("Goggins MF: ", botReply);

    return botReply;
  } catch (error) {
    console.error("Error:", error);
    return "Error processing your message.";
  }
}

function startChat() {
  rl.question("\nYou 🙍: ", async (message) => {
    if (message.toLowerCase() === "exit") {
      console.log("Get the hell out of here and get your ass moving son.");
      rl.close();
      return;
    }

    await chatWithAI(message);
    startChat();
  });
}

console.log(
  "🔥 Talk to David Goggins , be cautious son,  he is a badass MF! Type 'exit' to quit."
);
startChat();
