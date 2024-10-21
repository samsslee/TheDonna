export const makeEmbedding = async (text) => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: text
        })
    });

    if (!response.ok) {
        throw new Error(`Error making embeddings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding; // Return just the embedding
};