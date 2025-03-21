import { TwitterApi } from 'twitter-api-v2';

// Cache for storing recent tweet results
const tweetCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Initialize Twitter client with proper configuration
const client = new TwitterApi({
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    // Add proper headers for CORS
    headers: {
        'User-Agent': 'Sentify/1.0.0',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
});

// Validate Twitter credentials on startup
(async () => {
    try {
        if (!process.env.TWITTER_BEARER_TOKEN) {
            console.error('TWITTER_BEARER_TOKEN is not set in environment variables');
            return;
        }
        
        // Test the credentials
        await client.v2.me();
        console.log('Twitter API credentials validated successfully');
    } catch (error) {
        console.error('Failed to validate Twitter API credentials:', error.message);
    }
})();

export async function fetchTweetsAboutBrand(brandHandle, maxResults = 10) {
    try {
        // Remove @ symbol if present
        const handle = brandHandle.replace('@', '');
        
        // Check cache first
        const cacheKey = `${handle}-${maxResults}`;
        const cachedResult = tweetCache.get(cacheKey);
        if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            return cachedResult.data;
        }
        
        // Search for tweets mentioning the brand with recommended fields
        const tweets = await client.v2.search(`@${handle}`, {
            max_results: maxResults,
            'tweet.fields': [
                'created_at',
                'public_metrics',
                'author_id',
                'context_annotations'
            ],
            expansions: [
                'author_id',
                'referenced_tweets.id',
                'entities.mentions.username'
            ],
            'user.fields': [
                'username',
                'name',
                'profile_image_url'
            ],
            exclude: ['retweets', 'replies']
        });

        // Check if we have tweets and handle the response structure
        if (!tweets || !tweets._realData || !tweets._realData.data) {
            return [];
        }

        const tweetData = tweets._realData.data;
        const users = tweets._realData.includes?.users || [];

        const processedTweets = tweetData.map(tweet => ({
            id: tweet.id,
            text: tweet.text,
            created_at: tweet.created_at,
            metrics: tweet.public_metrics,
            context: tweet.context_annotations,
            author: {
                id: tweet.author_id,
                username: users.find(u => u.id === tweet.author_id)?.username,
                name: users.find(u => u.id === tweet.author_id)?.name,
                profile_image: users.find(u => u.id === tweet.author_id)?.profile_image_url
            }
        }));

        // Cache the results
        tweetCache.set(cacheKey, {
            data: processedTweets,
            timestamp: Date.now()
        });

        return processedTweets;
    } catch (error) {
        console.error('Error fetching tweets:', error);
        
        // Handle rate limit errors with detailed information
        if (error.code === 429) {
            const resetTime = error.rateLimit?.reset 
                ? new Date(error.rateLimit.reset * 1000).toLocaleTimeString()
                : 'a few minutes';
            const limit = error.rateLimit?.limit || 'unknown';
            const remaining = error.rateLimit?.remaining || 0;
            
            // Check cache for stale data if rate limited
            const cacheKey = `${brandHandle.replace('@', '')}-${maxResults}`;
            const cachedResult = tweetCache.get(cacheKey);
            if (cachedResult) {
                console.log('Returning cached data due to rate limit');
                return cachedResult.data;
            }
            
            throw new Error(
                `Twitter API rate limit exceeded (${remaining}/${limit} requests remaining). ` +
                `Please try again after ${resetTime}. ` +
                `Note: Twitter's API has a limit of ${limit} requests per 15-minute window.`
            );
        }
        
        // Handle authentication errors with more detailed messages
        if (error.code === 401) {
            console.error('Authentication error details:', error);
            throw new Error(
                'Invalid Twitter API credentials. Please check your TWITTER_BEARER_TOKEN ' +
                'or verify your API access at https://developer.twitter.com/en/portal/dashboard. ' +
                'Make sure your token has the necessary permissions.'
            );
        }

        // Handle other common API errors
        if (error.code === 403) {
            throw new Error(
                'Access forbidden. Please check your API access level and permissions. ' +
                'Make sure your Twitter Developer account is approved for the required access level.'
            );
        }
        
        if (error.code === 404) {
            throw new Error(
                `No tweets found for @${brandHandle}. The account may not exist, be private, ` +
                'or you might not have permission to access it.'
            );
        }

        // Handle other API errors with more context
        if (error.code) {
            console.error('Twitter API error details:', error);
            throw new Error(
                `Twitter API error (${error.code}): ${error.message}. ` +
                'Please check your API credentials and permissions.'
            );
        }

        throw new Error(`Failed to fetch tweets: ${error.message}`);
    }
} 