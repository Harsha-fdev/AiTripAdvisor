import { GoogleGenerativeAI } from "@google/generative-ai";

  
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",//very imp bcs we need data in the form of json
  };
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
            role:"user",
            parts:[
                {text:"Generate Travel plan for location: Las Vegas,for 3days for couple with cheap budget , give me a hotels options list with hotelname , hotel address , price , hotel image url,geo coordinates , rating , description and suggest itinerary with placename , place details , place image url , geo coordinates , ticket , pricing , rating , time travel each for location for 3 days with each day plan with best time to visit in json format"

                },
            ],
        },
      ],
    });
  
  
