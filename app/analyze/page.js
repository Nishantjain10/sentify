'use client';

import { useState } from 'react';
import SentimentAnalyzer from '../components/SentimentAnalyzer';
import Navbar from '../components/Navbar';

const ExampleSection = () => {
    const examples = [
        {
            text: "The new product exceeded all my expectations! The customer service was exceptional, and I couldn't be happier with my purchase.",
            category: "Positive",
            context: "Product Review"
        },
        {
            text: "I've been waiting for over an hour and still no response from support. This is frustrating and completely unacceptable.",
            category: "Negative",
            context: "Customer Service"
        },
        {
            text: "The weather today is partly cloudy with a temperature of 72°F. Light breeze expected in the afternoon.",
            category: "Neutral",
            context: "Weather Report"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Example Texts</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Click on any example to see how our sentiment analysis works:
                </p>
                <div className="space-y-4">
                    {examples.map((example, index) => (
                        <ExampleCard key={index} {...example} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ExampleCard = ({ text, category, context }) => {
    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'positive':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'negative':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            default:
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
        }
    };

    const handleClick = () => {
        // Use the globally available function to set and analyze the example text
        if (typeof window !== 'undefined' && window.handleSentimentExample) {
            window.handleSentimentExample(text);
            // Scroll to the analyzer results
            const resultsArea = document.getElementById('analysis-results');
            if (resultsArea) {
                resultsArea.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div 
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all hover:shadow-md"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                    {category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{context}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{text}</p>
            <button
                onClick={handleClick}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
                Click to analyze this text →
            </button>
        </div>
    );
};

export default function AnalyzePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Navbar />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Sentiment Analysis</h1>
                    <p className="text-gray-900 dark:text-gray-300">
                        Enter your text below to analyze its sentiment using our advanced AI model.
                    </p>
                </div>
                <ExampleSection />
                <SentimentAnalyzer />
            </div>
        </div>
    );
} 