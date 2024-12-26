import { Configuration, OpenAIApi } from 'openai';

// Set up OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Define the base prompt for generating the khutbah
const basePromptPrefix = `Write me an Islamic Khutbah with an opening, body, and closing. Please make sure the khutbah references at least one ayah from the Quran and one hadith from the Prophet Mohammed and includes some actions we can take to implement the khutbah in our lives. 
Title:
`;

const generateAction = async (req, res) => {
  try {
    // Validate the request body
    if (!req.body.userInput) {
      return res.status(400).json({ error: 'userInput is required in the request body.' });
    }

    console.log(`API Request: ${basePromptPrefix}${req.body.userInput}`);

    // Use GPT-4 for the completion request
    const baseCompletion = await openai.createCompletion({
      model: 'gpt-4',
      prompt: `${basePromptPrefix}${req.body.userInput}\n`,
      temperature: 0.7, // Adjust for creativity
      max_tokens: 1500, // Increase tokens for longer responses
    });

    // Extract and format the output
    const basePromptOutput = baseCompletion.data.choices[0]?.text?.trim();

    if (!basePromptOutput) {
      return res.status(500).json({ error: 'No output returned from OpenAI API.' });
    }

    // Return the generated khutbah
    res.status(200).json({ output: basePromptOutput });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message || error);
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again later.',
    });
  }
};

export default generateAction;
