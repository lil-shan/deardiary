import axios from "axios";
import { GROQ_API_KEY, GROQ_API_URL } from "./config";

interface AnalysisResult {
  mood: string;
  emotional_state: string;
  insights: string[];
  suggestions: string[];
  concerns: string[];
  positiveAspects: string[];
  timestamp: string;
}

export const analyzeJournal = async (
  journalContent: string,
  date: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `
      As a therapeutic journaling assistant, analyze this journal entry with empathy and insight:

      Journal Entry Date: ${date}
      Content: "${journalContent}"

      Provide a detailed analysis in JSON format with the following structure:
      {
        "mood": "Brief description of overall mood",
        "emotional_state": "Detailed analysis of emotional state",
        "insights": ["Key insights about mental state", "Personal growth observations"],
        "suggestions": ["Specific, actionable suggestions for improvement"],
        "concerns": ["Any potential issues that need attention"],
        "positiveAspects": ["Positive elements to reinforce"],
        "timestamp": "Analysis timestamp"
      }

      Focus on personal growth, emotional well-being, and constructive feedback.
    `;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "mixtral-8x7b-32768", // Groq's large context model
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate and insightful therapeutic journaling assistant, trained to provide constructive analysis while maintaining focus on mental well-being and personal growth.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const analysis = JSON.parse(response.data.choices[0].message.content);
    return {
      ...analysis,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Journal analysis error:", error);
    throw new Error("Failed to analyze journal entry");
  }
};
