import { fetchTweetsAboutBrand } from '@/lib/twitter';
import { analyzeSentiment } from '@/lib/gemini';
import { NextResponse } from 'next/server';

// Helper function to handle CORS
function corsResponse(data, status = 200) {
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return corsResponse({});
}

export async function POST(request) {
    try {
        const { brandHandle, maxTweets = 10 } = await request.json();

        if (!brandHandle) {
            return corsResponse(
                { error: 'Brand handle is required' },
                400
            );
        }

        // Fetch tweets about the brand
        const tweets = await fetchTweetsAboutBrand(brandHandle, maxTweets);

        // Analyze sentiment for each tweet
        const analyzedTweets = await Promise.all(
            tweets.map(async (tweet) => {
                try {
                    const sentiment = await analyzeSentiment(tweet.text);
                    return {
                        ...tweet,
                        analysis: sentiment
                    };
                } catch (error) {
                    console.error(`Error analyzing tweet ${tweet.id}:`, error);
                    return {
                        ...tweet,
                        analysis: {
                            error: 'Failed to analyze sentiment',
                            details: error.message
                        }
                    };
                }
            })
        );

        // Calculate overall sentiment metrics
        const sentimentCounts = analyzedTweets.reduce((acc, tweet) => {
            if (tweet.analysis.sentiment) {
                acc[tweet.analysis.sentiment] = (acc[tweet.analysis.sentiment] || 0) + 1;
            }
            return acc;
        }, {});

        const totalAnalyzed = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
        
        const summary = {
            total_tweets: tweets.length,
            analyzed_tweets: totalAnalyzed,
            sentiment_distribution: {
                positive: (sentimentCounts.positive || 0) / totalAnalyzed,
                negative: (sentimentCounts.negative || 0) / totalAnalyzed,
                neutral: (sentimentCounts.neutral || 0) / totalAnalyzed
            },
            tweets: analyzedTweets
        };

        return corsResponse(summary);
    } catch (error) {
        console.error('Error in tweet analysis:', error);
        return corsResponse(
            { error: 'Failed to analyze tweets', details: error.message },
            500
        );
    }
} 