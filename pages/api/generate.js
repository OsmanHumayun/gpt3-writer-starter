import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Define the base system message for GPT-4 chat
const baseSystemMessage = `You are an assistant that generates Islamic Khutbahs. Provide a khutbah with an opening, body, and closing. Include at least one ayah from the Quran, one hadith from the Prophet Muhammad, and practical actions to implement the khutbah in daily life.`;

// API Handler Function
const generateAction = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.userInput) {
      return res.status(400).json({ error: "userInput is required in the request body." });
    }

    console.log(`User Input: ${req.body.userInput}`);

    // Call the chat completion endpoint
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: baseSystemMessage },
        { role: "user", content: req.body.userInput },
      ],
      temperature: 0.7, // Adjust creativity
      max_tokens: 1500, // Set the token limit
    });

    // Extract and send the response
    const generatedResponse = chatCompletion.data.choices[0]?.message?.content?.trim();
    if (!generatedResponse) {
      return res.status(500).json({ error: "No output returned from OpenAI API." });
    }

    res.status(200).json({ output: generatedResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message || error);
    res.status(500).json({
      error: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default generateAction;
