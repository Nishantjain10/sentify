'use client';

import { useState } from 'react';
import { analyzeSentiment } from '@/app/utils/sentimentAnalysis';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function TwitterAnalyzer() {
    const [handle, setHandle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [customResult, setCustomResult] = useState(null);
    const [showExamples, setShowExamples] = useState(false);
    const [chartData, setChartData] = useState({
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                label: 'Gemini Analysis',
                data: [0, 0, 0],
                backgroundColor: 'rgba(147, 51, 234, 0.5)',  // purple
                borderColor: 'rgb(147, 51, 234)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Custom Analysis',
                data: [0, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',  // blue
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            }
        ],
    });

    const examples = [
        {
            handle: "@NASA",
            description: "Space exploration and scientific discoveries",
            category: "Science",
            tweets: [
                {
                    text: "🚀 Our James Webb Space Telescope has captured stunning new images of Jupiter's atmosphere, revealing previously unseen details of the gas giant's storms.",
                    sentiment: "positive",
                    confidence: 0.92,
                    explanation: "The tweet expresses excitement about scientific discovery and uses positive language to describe the achievement."
                },
                {
                    text: "Today marks 50 years since humanity first stepped on the Moon. The Apollo missions continue to inspire generations of explorers. #MoonLanding",
                    sentiment: "positive",
                    confidence: 0.88,
                    explanation: "The tweet celebrates a historic achievement and emphasizes its lasting positive impact."
                }
            ]
        },
        {
            handle: "@NatGeo",
            description: "Nature, wildlife, and environmental stories",
            category: "Nature",
            tweets: [
                {
                    text: "WATCH: Rare footage of snow leopards in their natural habitat, captured by our photographers in the Himalayas. A glimpse into their mysterious world.",
                    sentiment: "neutral",
                    confidence: 0.85,
                    explanation: "The tweet is informative and descriptive without expressing strong positive or negative emotions."
                },
                {
                    text: "The Great Barrier Reef shows signs of recovery in some areas, but climate change remains a significant threat to coral ecosystems worldwide.",
                    sentiment: "mixed",
                    confidence: 0.78,
                    explanation: "The tweet contains both positive (recovery) and negative (climate threat) elements."
                }
            ]
        },
        {
            handle: "@Tesla",
            description: "Electric vehicles and sustainable energy",
            category: "Technology",
            tweets: [
                {
                    text: "Introducing the next generation of Tesla Superchargers: 50% faster charging speeds and solar integration at all new stations.",
                    sentiment: "positive",
                    confidence: 0.95,
                    explanation: "The tweet announces technological improvements and environmental benefits with enthusiasm."
                },
                {
                    text: "Model Y sets new safety record in NHTSA testing, achieving highest score ever recorded for any SUV. Safety remains our top priority.",
                    sentiment: "positive",
                    confidence: 0.90,
                    explanation: "The tweet highlights a significant achievement in safety, expressing pride and commitment to customer well-being."
                }
            ]
        }
    ];

    const getSentimentColor = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'bg-green-500';
            case 'negative':
                return 'bg-red-500';
            case 'mixed':
                return 'bg-yellow-500';
            default:
                return 'bg-blue-500';
        }
    };

    const analyzeTweets = async (e) => {
        e.preventDefault();
        if (!handle) {
            setError('Please enter a Twitter handle');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setCustomResult(null);

        try {
            // Scroll to results area
            const resultsArea = document.getElementById('twitter-analysis-results');
            if (resultsArea) {
                resultsArea.scrollIntoView({ behavior: 'smooth' });
            }

            const response = await fetch('/api/analyze-tweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    brandHandle: handle.replace('@', '')
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze tweets');
            }

            const data = await response.json();
            setResult(data);
            
            // Perform custom sentiment analysis on the tweets
            if (data.tweets && data.tweets.length > 0) {
                const customAnalysis = data.tweets.map(tweet => ({
                    ...tweet,
                    customAnalysis: analyzeSentiment(tweet.text)
                }));

                // Calculate sentiment counts for both analyses
                const newGeminiData = [0, 0, 0];  // [positive, neutral, negative]
                const newCustomData = [0, 0, 0];

                // Count Gemini results
                data.tweets.forEach(tweet => {
                    switch (tweet.sentiment.toLowerCase()) {
                        case 'positive':
                            newGeminiData[0]++;
                            break;
                        case 'neutral':
                            newGeminiData[1]++;
                            break;
                        case 'negative':
                            newGeminiData[2]++;
                            break;
                    }
                });

                // Count Custom results
                customAnalysis.forEach(tweet => {
                    switch (tweet.customAnalysis.sentiment.toLowerCase()) {
                        case 'positive':
                            newCustomData[0]++;
                            break;
                        case 'neutral':
                            newCustomData[1]++;
                            break;
                        case 'negative':
                            newCustomData[2]++;
                            break;
                    }
                });

                setChartData(prev => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: newGeminiData,
                        },
                        {
                            ...prev.datasets[1],
                            data: newCustomData,
                        }
                    ],
                }));

                setCustomResult({
                    score: customAnalysis.reduce((acc, tweet) => acc + tweet.customAnalysis.score, 0) / customAnalysis.length,
                    sentiment: calculateOverallSentiment(customAnalysis),
                    confidence: customAnalysis.reduce((acc, tweet) => acc + tweet.customAnalysis.confidence, 0) / customAnalysis.length,
                    explanation: `Custom analysis based on AFINN sentiment lexicon and emoji scoring.`,
                    tweets: customAnalysis
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to calculate overall sentiment
    const calculateOverallSentiment = (tweets) => {
        const avgScore = tweets.reduce((acc, tweet) => acc + tweet.customAnalysis.score, 0) / tweets.length;
        if (avgScore > 0.2) return 'positive';
        if (avgScore < -0.2) return 'negative';
        return 'neutral';
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12
                    },
                    usePointStyle: true,
                    pointStyle: 'rect'
                }
            },
            title: {
                display: true,
                text: 'Tweet Sentiment Comparison',
                color: 'rgb(107, 114, 128)',
                font: {
                    size: 14,
                    weight: 'normal'
                },
                padding: {
                    bottom: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgb(107, 114, 128)',
                }
            },
        },
        animation: {
            duration: 500,
        },
        barPercentage: 0.8,
        categoryPercentage: 0.7
    };

    const handleExampleClick = (tweet) => {
        // Don't pre-populate counts for examples
        // Only update after actual analysis
        const customAnalysisResult = analyzeSentiment(tweet.text);
        
        setResult({
            sentiment: tweet.sentiment,
            confidence: tweet.confidence,
            explanation: tweet.explanation,
            indicators: {
                emotional_tone: 0,
                intensity: tweet.confidence,
                objectivity: 0.5,
                key_sentiment_words: []
            },
            tweets: [{ text: tweet.text, sentiment: tweet.sentiment }]
        });
        
        setCustomResult({
            ...customAnalysisResult,
            tweets: [{
                text: tweet.text,
                customAnalysis: customAnalysisResult
            }]
        });

        // Scroll to results area with smooth animation
        const resultsArea = document.getElementById('twitter-analysis-results');
        if (resultsArea) {
            resultsArea.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Add new section for displaying indicators
    const renderIndicators = (tweet) => {
        if (!tweet.indicators) return null;

        return (
            <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Emotional Tone</div>
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div 
                                    className="h-2.5 rounded-full"
                                    style={{ 
                                        width: `${((tweet.indicators.emotional_tone + 1) / 2) * 100}%`,
                                        backgroundColor: tweet.indicators.emotional_tone > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                                    }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {tweet.indicators.emotional_tone.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Intensity</div>
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div 
                                    className="h-2.5 rounded-full bg-purple-600"
                                    style={{ width: `${tweet.indicators.intensity * 100}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {(tweet.indicators.intensity * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Objectivity</div>
                        <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                <div 
                                    className="h-2.5 rounded-full bg-blue-600"
                                    style={{ width: `${tweet.indicators.objectivity * 100}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {(tweet.indicators.objectivity * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {tweet.indicators.key_sentiment_words && tweet.indicators.key_sentiment_words.length > 0 && (
                    <div className="mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Sentiment Words</div>
                        <div className="flex flex-wrap gap-2">
                            {tweet.indicators.key_sentiment_words.map((word, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <form onSubmit={analyzeTweets} className="space-y-4">
                <div>
                    <label htmlFor="handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Twitter Handle
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                            @
                        </span>
                        <input
                            type="text"
                            id="handle"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="username"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Tweets'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowExamples(!showExamples)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        {showExamples ? 'Hide Examples' : 'Show Examples'}
                    </button>
                </div>
            </form>

            {showExamples && (
                <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Example Tweets</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {examples.map((example, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">{example.handle}</span>
                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                        {example.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{example.description}</p>
                                <div className="space-y-3">
                                    {example.tweets.map((tweet, tweetIndex) => (
                                        <div
                                            key={tweetIndex}
                                            onClick={() => handleExampleClick(tweet)}
                                            className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:shadow-md transition-all group relative border border-transparent hover:border-blue-300 dark:hover:border-blue-500"
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => e.key === 'Enter' && handleExampleClick(tweet)}
                                        >
                                            <p className="text-gray-700 dark:text-gray-300 mb-3">{tweet.text}</p>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    tweet.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    tweet.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                    tweet.sentiment === 'mixed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                }`}>
                                                    {tweet.sentiment}
                                                </span>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
                                                    <span>Click to analyze</span>
                                                    <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {(loading || result || customResult) && (
                <div id="twitter-analysis-results" className="space-y-8">
                    {loading && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center justify-center space-x-2 animate-pulse">
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">Analyzing tweets...</span>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gemini Analysis</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">AI-powered analysis</span>
                            </div>
                            
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Overall Sentiment: {result.sentiment}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {Math.round(result.confidence * 100)}% confidence
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${getSentimentColor(result.sentiment)}`}
                                        style={{ width: `${result.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{result.explanation}</p>
                            </div>

                            {result.tweets && result.tweets.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Analyzed Tweets</h4>
                                    <div className="space-y-4">
                                        {result.tweets.map((tweet, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{tweet.text}</p>
                                                {renderIndicators(tweet)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Powered by Google Gemini AI
                            </div>
                        </div>
                    )}

                    {customResult && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Custom Analysis</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">AFINN-based analysis</span>
                            </div>
                            
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Overall Sentiment: {customResult.sentiment}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {Math.round(customResult.confidence * 100)}% confidence
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${getSentimentColor(customResult.sentiment)}`}
                                        style={{ width: `${customResult.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{customResult.explanation}</p>
                            </div>

                            {customResult.tweets && customResult.tweets.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Analyzed Tweets</h4>
                                    <div className="space-y-4">
                                        {customResult.tweets.map((tweet, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{tweet.text}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        getSentimentColor(tweet.customAnalysis.sentiment)
                                                    } bg-opacity-10 text-${
                                                        tweet.customAnalysis.sentiment === 'positive' ? 'green' :
                                                        tweet.customAnalysis.sentiment === 'negative' ? 'red' :
                                                        'blue'
                                                    }-800 dark:text-${
                                                        tweet.customAnalysis.sentiment === 'positive' ? 'green' :
                                                        tweet.customAnalysis.sentiment === 'negative' ? 'red' :
                                                        'blue'
                                                    }-200`}>
                                                        {tweet.customAnalysis.sentiment}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Score: {tweet.customAnalysis.score.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Powered by AFINN sentiment lexicon
                            </div>
                        </div>
                    )}

                    {(result || customResult) && (
                        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-xl">
                            <div className="h-64">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                                Distribution of analyzed tweets by sentiment
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}