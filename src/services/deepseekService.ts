import axios from 'axios';

const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export const getAlternativeTitles = async (title: string): Promise<string[]> => {
    if (!DEEPSEEK_API_KEY) {
        console.warn('DeepSeek API key is not set. Please add EXPO_PUBLIC_DEEPSEEK_API_KEY to your environment variables.');
        return [];
    }

    try {
        console.log('Fetching alternative titles for:', title);
        const prompt = `Given the anime title "${title}", list any well-known alternative titles, nicknames, or abbreviations that fans commonly use to refer to this anime. Only include titles that are widely recognized by the anime community. Format the response as a comma-separated list.`;

        const response = await axios.post<DeepSeekResponse>(
            DEEPSEEK_API_URL,
            {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that provides alternative titles for anime.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 150,
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        if (!response.data.choices?.[0]?.message?.content) {
            console.warn('No content received from DeepSeek API');
            return [];
        }

        const content = response.data.choices[0].message.content;
        console.log('Received response from DeepSeek:', content);

        // Split by commas and clean up the results
        const titles = content.split(',')
            .map(title => title.trim())
            .filter(title => title && title.toLowerCase() !== title.toLowerCase());

        console.log('Processed alternative titles:', titles);
        return titles;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error fetching alternative titles:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
        } else {
            console.error('Error fetching alternative titles:', error);
        }
        return [];
    }
}; 