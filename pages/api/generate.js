import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Write me an Islamic Khutbah with an opening, body and closing. Please make sure the khutbah references at least one ayah from the Quran and one hadith from the Prophet Mohammed and includes some actions we can take to implement the khutbah in our lives. 
Title:
`;

const generateAction = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests are allowed.' });
    }

    if (!req.body.userInput) {
      return res.status(400).json({ error: 'userInput is required in the request body.' });
    }

    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${basePromptPrefix}${req.body.userInput}\n`,
      temperature: 0.7,
      max_tokens: 1250,
    });

    const basePromptOutput = baseCompletion.data.choices[0]?.text;

    if (!basePromptOutput) {
      return res.status(500).json({ error: 'No output returned from OpenAI API.' });
    }

    res.status(200).json({ output: basePromptOutput.trim() });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message || error);
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again later.',
    });
  }
};

export default generateAction;
