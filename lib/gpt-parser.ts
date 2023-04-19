import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from 'eventsource-parser';

export type Agent = "user" | "system";

export interface Message {
    role: Agent;
    content: string;
}

export interface StreamPayload {
    model: string;
    prompt: string;
    max_tokens: number;
    temperature: number;
    stream: boolean;
}

export async function chatGPTStream(payload: StreamPayload) {
    const res = await fetch('https://api.openai.com/v1/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPEN_API_KEY ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    return new Response(res.body, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
    })
}
