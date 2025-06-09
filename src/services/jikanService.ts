import axios from 'axios';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export interface Anime {
    mal_id: number;
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    synopsis: string;
    genres: Array<{ name: string }>;
    status: string;
    episodes: number;
    aired: {
        string: string;
    };
    studios: Array<{ name: string }>;
    themes: Array<{ name: string }>;
}

export interface MangaSearchResult {
    mal_id: number;
    title: string;
    synopsis: string;
    genres: Array<{ name: string }>;
    score: number;
    images: {
        jpg: {
            image_url: string;
        };
    };
}

export interface Genre {
    mal_id: number;
    name: string;
    count: number;
}

export interface Manga {
    mal_id: number;
    title: string;
    title_english: string | null;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    synopsis: string;
    genres: Array<{ name: string }>;
    status: string;
    chapters: number;
    volumes: number;
    published: {
        string: string;
    };
    authors: Array<{ name: string }>;
}

export const searchAnime = async (query: string): Promise<Anime[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/anime`, {
            params: { q: query, limit: 10 }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error searching anime:', error);
        return [];
    }
};

export const searchManga = async (query: string): Promise<MangaSearchResult[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/manga`, {
            params: { q: query }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error searching manga:', error);
        throw error;
    }
};

export const getAnimeDetails = async (id: number): Promise<Anime> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/anime/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime details:', error);
        throw error;
    }
};

export const getMangaDetails = async (id: number): Promise<MangaSearchResult> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/manga/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error getting manga details:', error);
        throw error;
    }
};

export const getTopAnime = async (): Promise<Anime[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/top/anime`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching top anime:', error);
        throw error;
    }
};

export const getGenres = async (): Promise<Genre[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/genres/anime`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};

export const getAnimeByGenre = async (genre: string): Promise<Anime[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/anime`, {
            params: {
                genres: genre,
                limit: 20
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anime by genre:', error);
        throw error;
    }
};

export const getTopManga = async (): Promise<Manga[]> => {
    try {
        const response = await axios.get(`${JIKAN_API_BASE}/top/manga`, {
            params: { limit: 10 }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching top manga:', error);
        return [];
    }
}; 