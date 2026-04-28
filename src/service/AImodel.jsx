import axios from "axios";

// Your OpenRouter API Key
const apiKey = import.meta.env.VITE_META_LLAMA_FREE_API_KEY;

// Actually available free model
const MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 8192,
};

export const chatSession = {
  sendMessage: async (prompt) => {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a travel planner AI. Return ONLY strict valid JSON. No markdown. No explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: generationConfig.temperature,
          top_p: generationConfig.topP,
          max_tokens: generationConfig.maxOutputTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Trip Planner",
          },
        },
      );

      return {
        response: {
          text: () => response.data.choices[0].message.content,
        },
      };
    } catch (error) {
      console.error(
        "OpenRouter API Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
