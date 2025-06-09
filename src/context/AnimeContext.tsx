import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTopAnime, Anime } from '../services/jikanService';

interface AnimeContextType {
    animeList: Anime[];
    loading: boolean;
    error: string | null;
}

const AnimeContext = createContext<AnimeContextType>({
    animeList: [],
    loading: true,
    error: null,
});

export const useAnime = () => useContext(AnimeContext);

export const AnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const data = await getTopAnime();
                setAnimeList(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch anime data');
                console.error('Error fetching anime:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, []);

    return (
        <AnimeContext.Provider value={{ animeList, loading, error }}>
            {children}
        </AnimeContext.Provider>
    );
}; 