import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { message } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `أنت ذكاء اصطناعي اسمك سَنَد. جاوب بالعامية أو الفصحى أو الإنجليزي بذكاء وحرية:\n\n${message}`;
    const result = await model.generateContent(prompt);
    return NextResponse.json({ reply: result.response.text() });
  } catch (e) {
    return NextResponse.json({ reply: "صار خطأ بالاتصال" }, { status: 500 });
  }
}
