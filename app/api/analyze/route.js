import { NextResponse } from 'next/server';
import { analyzeSentiment } from '@/lib/gemini';
import { createSentimentEntry } from '@/lib/appwrite';

export async function POST(request) {
    try {
        // Check if environment variables are set
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            throw new Error('GOOGLE_GEMINI_API_KEY is not set');
        }
        if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 
            !process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 
            !process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
            throw new Error('Required Appwrite environment variables are not set');
        }

        const { text } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Analyze sentiment using Gemini
        const analysis = await analyzeSentiment(text);

        if (!analysis || !analysis.sentiment || !analysis.confidence) {
            throw new Error('Invalid response from sentiment analysis');
        }

        // Store the result in Appwrite
        await createSentimentEntry(
            text,
            analysis.sentiment,
            analysis.confidence
        );

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error in sentiment analysis:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze sentiment' },
            { status: 500 }
        );
    }
} 