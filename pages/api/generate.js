import { Configuration, OpenAIApi } from "openai";

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is set in your environment
});

const openai = new OpenAIApi(configuration);

// Define the base system message for the chat model
const basePromptPrefix = `Write me an Islamic Khutbah with an opening, body, and closing. Please make sure the khutbah references at least one ayah from the Quran and one authentic hadith from the Prophet Mohammed and includes some actions we can take to implement the khutbah in our lives. 
Title:
`;

const generateAction = async (req, res) => {
  try {
    // Validate the request body
    if (!req.body.userInput) {
      return res.status(400).json({ error: "userInput is required in the request body." });
    }

    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

    // Call the chat completion endpoint for GPT-4
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-4", // Switch to "gpt-3.5-turbo" for lower cost
      messages: [
        { role: "system", content: basePromptPrefix },
        { role: "user", content: req.body.userInput },
      ],
      temperature: 0.7, // Adjust creativity
      max_tokens: 1250, // Adjust based on the desired output length
    });

    // Extract the response content
    const generatedResponse = chatCompletion.data.choices[0]?.message?.content?.trim();

    if (!generatedResponse) {
      return res.status(500).json({ error: "No response from OpenAI API." });
    }

    // Respond with the generated khutbah
    res.status(200).json({ output: generatedResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "An error occurred while processing your request. Please try again later.",
    });
  }
};

export default generateAction;
