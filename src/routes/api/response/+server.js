import { json } from '@sveltejs/kit';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '$lib/firebase';
import { makeEmbedding } from '../makeEmbedding';

// Function to calculate cosine similarity
// thank you: https://www.restack.io/p/similarity-search-answer-javascript-cosine-similarity-cat-ai
const cosineSimilarity = (a, b) => {
    const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

// Function to compare the question to documents in Firestore
const compareQuestionToDocs = async (question) => {
    const questionEmbedding = await makeEmbedding(question);
    const dbDocs = await getDocs(collection(db, "demoDonna"));

    const similarityPromises = dbDocs.docs.map(async (doc) => {
        const { phrase, embedding, timestamp } = doc.data();
        const similarity = cosineSimilarity(questionEmbedding, embedding);
        return { phrase, timestamp, similarity };
    });

    //Would love to limit the number of responses based on similarity before actually like making the whole function and filtering.
    const resultsWithSimilarities = await Promise.all(similarityPromises);

    // Quick and dirty filter results where similarity is greater than 0.75
    const filteredResults = resultsWithSimilarities.filter(result => result.similarity > 0.75);

    // Sort results by similarity
    filteredResults.sort((a, b) => b.similarity - a.similarity);

    return filteredResults;
};

// API Endpoint
export async function POST({ request }) {
    const { text } = await request.json();
    const systemContent = `You are a helpful assistant. 
        Recommend what the user should do based on their question and the provided context. 
        Do not invent an opinion if you do not have relevant context.`;

    try {
        const results = await compareQuestionToDocs(text);
        //console.log("here are the results", results) //use this for troubleshooting if the program isn't running as expected
    
        //I realized during cleanup I should make this it's own function because it's shared with the triage chat completions, but oh well.
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemContent
                    },
                    {
                        role: 'user',
                        content: `query: ${text}, potentially related context: ${JSON.stringify(results)}`
                    }
                ],
                max_tokens: 512,
                temperature: 0,
            })
        });

        const data = await response.json();
        return json({ results, data });
    } catch (error) {
        console.error(error);
        return json({ error: error.message }, { status: 500 });
    }
}
