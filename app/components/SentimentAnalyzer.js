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

export default function SentimentAnalyzer() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [customResult, setCustomResult] = useState(null);
    const [error, setError] = useState(null);
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

    const [indicatorData, setIndicatorData] = useState({
        emotional_tone: 0,
        intensity: 0,
        objectivity: 0,
        key_words: []
    });

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
                text: 'Sentiment Analysis Comparison',
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

    const analyzeSentiments = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);
        setCustomResult(null);

        try {
            // Perform custom analysis first
            const customAnalysisResult = analyzeSentiment(text);
            setCustomResult(customAnalysisResult);

            // Perform Gemini analysis
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze sentiment');
            }

            setResult(data);

            // Update indicators
            if (data.indicators) {
                setIndicatorData({
                    emotional_tone: data.indicators.emotional_tone,
                    intensity: data.indicators.intensity,
                    objectivity: data.indicators.objectivity,
                    key_words: data.indicators.key_sentiment_words
                });
            }

            // Update chart data
            const newGeminiData = [...chartData.datasets[0].data];
            const newCustomData = [...chartData.datasets[1].data];

            // Update Gemini counts
            switch (data.sentiment.toLowerCase()) {
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

            // Update Custom counts separately
            switch (customAnalysisResult.sentiment.toLowerCase()) {
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

            // Scroll to results
            const resultsArea = document.getElementById('analysis-results');
            if (resultsArea) {
                resultsArea.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExampleClick = (exampleText) => {
        setText(exampleText);
        
        // Only update the chart data after actual analysis
        // Don't pre-populate counts for examples
        // This fixes the duplicate counting issue
    };

    // Make handleExampleClick available globally
    if (typeof window !== 'undefined') {
        window.handleSentimentExample = handleExampleClick;
    }

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

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={analyzeSentiments} className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="mb-4">
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Text to Analyze
                    </label>
                    <textarea
                        id="text"
                        rows="4"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Type or paste your text here..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                </button>
            </form>

            {error && (
                <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Error: {error}</span>
                    </div>
                </div>
            )}

            {(loading || result || customResult) && (
                <div id="analysis-results" className="space-y-8">
                    {loading && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-center space-x-2 animate-pulse">
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">Analyzing sentiment...</span>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
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

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="font-medium mb-2 text-gray-900 dark:text-white">Analysis Explanation</p>
                                <p className="text-gray-600 dark:text-gray-400">{result.explanation}</p>
                            </div>

                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Powered by Google Gemini AI
                            </div>
                        </div>
                    )}

                    {customResult && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
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

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <p className="font-medium mb-2 text-gray-900 dark:text-white">Analysis Explanation</p>
                                <p className="text-gray-600 dark:text-gray-400">{customResult.explanation}</p>
                            </div>

                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Powered by AFINN sentiment lexicon
                            </div>
                        </div>
                    )}

                    {result && result.indicators && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sentiment Indicators</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Emotional Tone</div>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                            <div 
                                                className="h-2.5 rounded-full bg-blue-600"
                                                style={{ 
                                                    width: `${((result.indicators.emotional_tone + 1) / 2) * 100}%`,
                                                    backgroundColor: result.indicators.emotional_tone > 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {result.indicators.emotional_tone.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Intensity</div>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                            <div 
                                                className="h-2.5 rounded-full bg-purple-600"
                                                style={{ width: `${result.indicators.intensity * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {(result.indicators.intensity * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Objectivity</div>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                            <div 
                                                className="h-2.5 rounded-full bg-blue-600"
                                                style={{ width: `${result.indicators.objectivity * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {(result.indicators.objectivity * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {result.indicators.key_sentiment_words && result.indicators.key_sentiment_words.length > 0 && (
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Sentiment Words</div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.indicators.key_sentiment_words.map((word, index) => (
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
                    )}

                    {(result || customResult) && (
                        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]">
                            <div className="h-64">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                                Distribution of analyzed sentiments across examples
                            </p>
                        </div>
                    )}
                </div>
            )}


        </div>
    );
} 