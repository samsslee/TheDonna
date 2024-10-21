import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { text } = await request.json();
    const systemContent = `You are a helpful assistant. Only respond with JSON object, nothing else.
    If the user tells you about an event that should be scheduled, respond in the format {eventName: , eventDate:}.
    The event Date must be in UTC format.
    If the user tells you something that is not an event to be scheduled, respond empty object {}`

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
                    content: text
                }
            ],
            max_tokens: 512,
            temperature: 0,
        })
    });

    //There should be data sanitization here to ensure that the data is actually the exact JSON object we need
    //need more error handling

    const data = await response.json();
    return json({data: data});
}
