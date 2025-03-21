import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function analyzeSentiment(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are a social media sentiment analysis expert. Analyze the following social media post about a brand and respond with ONLY a JSON object in this exact format:

{
    "sentiment": "positive" | "negative" | "neutral",
    "confidence": <a number between 0 and 1>,
    "explanation": "<brief explanation focusing on brand perception and customer sentiment>"
}

Consider these aspects in your analysis:
- Customer satisfaction/dissatisfaction
- Service quality mentions
- Product feedback
- Brand reputation impact
- Emotional tone

Social media post to analyze: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log('Raw Gemini response:', responseText); // Debug log
        
        let jsonResponse;
        try {
            // Try to extract JSON if it's wrapped in other text
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
            jsonResponse = JSON.parse(jsonStr);
        } catch (e) {
            console.error('JSON parsing error:', e);
            throw new Error('Failed to parse Gemini API response as JSON');
        }

        // Validate response format
        if (!jsonResponse || typeof jsonResponse !== 'object') {
            throw new Error('Invalid response format: not a JSON object');
        }

        // Validate required fields
        if (!jsonResponse.sentiment || !jsonResponse.confidence || !jsonResponse.explanation) {
            throw new Error('Invalid response format: missing required fields');
        }

        // Validate sentiment value
        if (!['positive', 'negative', 'neutral'].includes(jsonResponse.sentiment)) {
            throw new Error('Invalid sentiment value');
        }

        // Validate confidence value
        if (typeof jsonResponse.confidence !== 'number' || 
            jsonResponse.confidence < 0 || 
            jsonResponse.confidence > 1) {
            throw new Error('Invalid confidence value');
        }

        return {
            sentiment: jsonResponse.sentiment,
            confidence: jsonResponse.confidence,
            explanation: jsonResponse.explanation
        };
    } catch (error) {
        console.error('Error in analyzeSentiment:', error);
        throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
} 