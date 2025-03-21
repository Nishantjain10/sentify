'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import ThemeToggle from './components/ThemeToggle';
import { useState, useEffect } from 'react';
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

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/analyze');
  };

  const DemoCarousel = () => {
    const demoExamples = [
      {
        text: "The new product exceeded all my expectations! The customer service was exceptional.",
        sentiment: "positive",
        confidence: 0.92,
        explanation: "Strong positive sentiment with emphasis on product satisfaction and service quality."
      },
      {
        text: "Current weather conditions: Partly cloudy with light winds, temperature at 72°F.",
        sentiment: "neutral",
        confidence: 0.88,
        explanation: "Neutral, factual description of weather conditions without emotional content."
      },
      {
        text: "I've been waiting for hours with no response from customer service. Very frustrating!",
        sentiment: "negative",
        confidence: 0.89,
        explanation: "Strong negative sentiment expressing frustration with service delays."
      }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [demoText, setDemoText] = useState(demoExamples[0].text);
    const [demoResult, setDemoResult] = useState(demoExamples[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [chartData, setChartData] = useState({
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          label: 'Sentiment Distribution',
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(34, 197, 94, 0.5)',  // green
            'rgba(59, 130, 246, 0.5)', // blue
            'rgba(239, 68, 68, 0.5)',  // red
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1,
        },
      ],
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Sentiment Analysis Distribution',
          color: 'rgb(107, 114, 128)',
          font: {
            size: 14,
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Count: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          grid: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      animation: {
        duration: 500,
      },
    };

    useEffect(() => {
      setDemoText(demoExamples[currentSlide].text);
      setShowResult(false);
      setDemoResult(null);
    }, [currentSlide]);

    useEffect(() => {
      if (demoResult) {
        // Update chart data when a new analysis is complete
        const newData = [...chartData.datasets[0].data];
        switch (demoResult.sentiment.toLowerCase()) {
          case 'positive':
            newData[0]++;
            break;
          case 'neutral':
            newData[1]++;
            break;
          case 'negative':
            newData[2]++;
            break;
        }
        setChartData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: newData,
          }],
        }));
      }
    }, [demoResult]);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % demoExamples.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + demoExamples.length) % demoExamples.length);
    };

    const handleAnalyze = async () => {
      setIsAnalyzing(true);
      setShowResult(false);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDemoResult(demoExamples[currentSlide]);
      setIsAnalyzing(false);
      setShowResult(true);
    };

    const getSentimentColor = (sentiment = 'neutral') => {
      switch (sentiment?.toLowerCase()) {
        case 'positive':
          return 'text-green-600 dark:text-green-400';
        case 'negative':
          return 'text-red-600 dark:text-red-400';
        default:
          return 'text-blue-600 dark:text-blue-400';
      }
    };

    const getSentimentBg = (sentiment = 'neutral') => {
      switch (sentiment?.toLowerCase()) {
        case 'positive':
          return 'bg-green-100 dark:bg-green-900/30';
        case 'negative':
          return 'bg-red-100 dark:bg-red-900/30';
        default:
          return 'bg-blue-100 dark:bg-blue-900/30';
      }
    };

  return (
      <div className="relative perspective-1000">
        <div className="flex items-center">
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 p-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer transform hover:-translate-x-1 hover:shadow-lg rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="w-full px-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl group relative cursor-default">
              {/* Glowing effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="mb-6 transform transition-transform duration-300">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Example Text
                  </label>
                  <textarea
                    value={demoText}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:shadow-md"
                    rows="3"
                  />
                </div>

                <div className="flex justify-center mb-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:rotate-1 relative overflow-hidden group/button cursor-pointer ${
                      isAnalyzing 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-xl'
                    }`}
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                    
                    {isAnalyzing ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Analyze Sentiment</span>
                        <svg className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>

                <div className={`transform transition-all duration-500 ease-out ${
                  showResult 
                    ? 'opacity-100 translate-y-0 rotate-0 scale-100' 
                    : 'opacity-0 translate-y-4 rotate-1 scale-95'
                }`}>
                  {demoResult && (
                    <>
                      <div className={`mt-6 p-4 rounded-lg ${getSentimentBg(demoResult.sentiment)} transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getSentimentColor(demoResult.sentiment)} text-lg`}>
                              {demoResult.sentiment.charAt(0).toUpperCase() + demoResult.sentiment.slice(1)}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {Math.round(demoResult.confidence * 100)}% confidence
                              </span>
                              <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {demoResult.explanation}
                        </p>
                      </div>
                      
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="h-64">
                          <Bar data={chartData} options={chartOptions} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                          Distribution of analyzed sentiments across examples
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 p-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer transform hover:translate-x-1 hover:shadow-lg rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-6 gap-3">
          {demoExamples.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer transform hover:scale-125 ${
                currentSlide === index
                  ? 'bg-blue-600 dark:bg-blue-400 scale-125 ring-4 ring-blue-100 dark:ring-blue-900'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500'
              }`}
            />
          ))}
        </div>

        {/* Add custom cursor indicators */}
        <style jsx global>{`
          .cursor-pointer {
            cursor: pointer;
          }
          .cursor-default {
            cursor: default;
          }
          .perspective-1000 {
            perspective: 1000px;
          }
          @keyframes shine {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 py-4 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sentify
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-6">
              <a href="#features" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Features</a>
              <a href="#demo" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Demo</a>
              <a href="/analyze/twitter" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Twitter Analysis</a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full">
              Powered by Google Gemini AI
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
            Understand Your Social<br />Media Impact
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Real-time sentiment analysis of social media mentions about your brand. 
            Powered by advanced AI to deliver actionable insights.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2"
            >
              <span>Start Analyzing</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button 
              onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 text-gray-900 dark:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to understand and improve your social media presence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Real-time Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get instant insights from social media mentions within minutes of posting. Track sentiment changes in real-time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Detailed sentiment classification and trend analysis with interactive visualizations and custom reports.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Leveraging Google's Gemini API for accurate sentiment classification and predictive analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">See It In Action</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience how Sentify can transform your social media strategy
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto border border-gray-100 dark:border-gray-600">
            <DemoCarousel />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Sentify</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Making social media analysis smarter and more actionable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-gray-600 dark:text-gray-300">
            © 2024 Sentify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
