import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { title, includeInstallation, includeUsage, includeFeatures } =
      await request.json();

    let prompt = `Generate a professional, concise, and friendly project description for a project titled "${title}". max 500 characters 1 paragraph. dont use * or _ in the description. or markdown features. `;

    console.log("Generated prompt:", prompt);

    // gemini description prompt
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    console.log("Full API response:", result);

    // result.response
    const response = result?.response;
    if (!response) {
      throw new Error("Gemini API response is undefined.");
    }

    // extracting text 👍🏻
    const text = response.text ? response.text() : "No text available.";

    return NextResponse.json({ description: text.trim() });
  } catch (error: any) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: error.message || "Failed to generate description" }, { status: 500 });
  }
}
