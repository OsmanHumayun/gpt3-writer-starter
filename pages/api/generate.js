import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const basePromptPrefix = `Write me an Islamic Khutbah with an opening, body and closing. Please make sure the khutbah references at least one ayah from the Quran and one authentic hadith from the Prophet Mohammed and includes some actions we can take to implement the khutbah in our lives. 
Title:`;

const generateAction = async (req, res) => {
  try {
    // Ensure we have user input
    if (!req.body.userInput) {
      return res.status(400).json({
        status: "error",
        error: "User input is required",
      });
    }

    // Log the prompt for debugging
    const prompt = `${basePromptPrefix}${req.body.userInput}`;
    console.log("Sending prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1250,
    });

    // Extract and log the generated content
    const generatedContent = completion.choices[0].message.content;
    console.log("Generated Content:", generatedContent);

    // Return the generated content
    return res.status(200).json({
      status: "success",
      output: generatedContent,
    });
  } catch (error) {
    console.error("Error in generateAction:", error);
    return res.status(500).json({
      status: "error",
      error: "Failed to generate content",
      details: error.message,
    });
  }
};

export default generateAction;
