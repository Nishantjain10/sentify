'use client';

import TwitterAnalyzer from '@/app/components/TwitterAnalyzer';
import Navbar from '@/app/components/Navbar';

export default function TwitterAnalysisPage() {
    const examples = [
        {
            title: "NASA Space Discovery",
            text: "Exciting news! Our James Webb telescope has captured stunning new images of Jupiter's atmosphere, revealing fascinating cloud patterns. This marks another milestone in space exploration.",
            type: "positive"
        },
        {
            title: "Weather Update",
            text: "Current conditions: Partly cloudy skies over Houston with visibility at 10 miles. Temperature holding steady at 72°F with light winds from the southeast.",
            type: "neutral"
        },
        {
            title: "Product Launch",
            text: "The latest model shows good improvements in efficiency. Testing continues as we prepare for the upcoming release next month.",
            type: "mixed"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                            Twitter Sentiment Analysis
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-gray-500 dark:text-gray-400 sm:text-lg">
                            Analyze the sentiment of tweets mentioning any Twitter handle. Get insights into brand perception and customer sentiment.
                        </p>
                    </div>
                </div>
            </div>
            <div id="twitter-analyzer" className="mb-20">
                <TwitterAnalyzer />
            </div>
        </div>
    );
} 