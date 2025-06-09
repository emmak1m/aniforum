export interface Anime {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            large_image_url: string;
        };
    };
    score: number;
    episodes: number;
    genres: Array<{
        name: string;
    }>;
    studios: Array<{
        name: string;
    }>;
    themes: Array<{
        name: string;
    }>;
} 