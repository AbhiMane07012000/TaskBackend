const { GoogleGenAI } = require('@google/genai');


const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function generateContent(content) {
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: content,
        config: {
            temperature: 1.3,
        },
    });
    return response.text;
}

module.exports = {
    generateContent,
};