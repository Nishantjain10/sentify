import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Helper function to create a new sentiment analysis entry
export async function createSentimentEntry(text, sentiment, confidence) {
    try {
        return await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
            'unique()',
            {
                text,
                sentiment,
                confidence,
                timestamp: new Date().toISOString(),
            }
        );
    } catch (error) {
        console.error('Error creating sentiment entry:', error);
        throw error;
    }
}

// Helper function to get all sentiment entries
export async function getSentimentEntries() {
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching sentiment entries:', error);
        throw error;
    }
} 