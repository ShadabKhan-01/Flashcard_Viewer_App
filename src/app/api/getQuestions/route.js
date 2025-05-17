import { GoogleGenAI } from "@google/genai";
import { flashcardSets } from "@/data/flashcardSets";


export async function POST(req) {
    const { topic } = await req.json();

    const prompt = `Generate 5 flashcards for the topic: "${topic}".

Each flashcard should have:
- A concise question.
- A short, clear answer.

Return a JSON array of objects with "question" and "answer" fields. Here's the expected format:
[
  { "question": "What is the powerhouse of the cell?", "answer": "Mitochondria" },
  { "question": "What is DNA short for?", "answer": "Deoxyribonucleic Acid" },
  ...
]
`
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.Gemini_Api_Key });
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        const data = response.text
        // console.log(data);
        const text = data.slice(7, -3);

        console.log(text);

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log(error);

        const text = flashcardSets[topic]
        console.log(text)

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}