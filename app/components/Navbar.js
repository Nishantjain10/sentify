'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';
  const isAnalyzePage = pathname === '/analyze';
  const isTwitterAnalyzePage = pathname === '/analyze/twitter';

  const handleGetStarted = () => {
    router.push('/analyze');
  };

  return (
    <nav className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 py-4 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sentify
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6">
            {isHomePage && (
              <>
                <Link href="/#features" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Features</Link>
                <Link href="/#demo" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Demo</Link>
                <Link href="/analyze" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Text Analysis</Link>
                <Link href="/analyze/twitter" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Twitter Analysis</Link>
              </>
            )}
            
            {(isAnalyzePage || isTwitterAnalyzePage) && (
              <>
                <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Home</Link>
                {isAnalyzePage && (
                  <Link href="/analyze/twitter" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Twitter Analysis</Link>
                )}
                {isTwitterAnalyzePage && (
                  <Link href="/analyze" className="text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">Text Analysis</Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isHomePage && (
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 