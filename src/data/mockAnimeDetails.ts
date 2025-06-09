import { Anime } from '../services/jikanService';

export const mockAnimeDetails: Record<number, Anime> = {
    1: {
        mal_id: 1,
        title: 'Attack on Titan',
        title_english: 'Attack on Titan',
        images: {
            jpg: {
                large_image_url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg'
            }
        },
        score: 8.5,
        episodes: 25,
        status: 'Finished Airing',
        aired: {
            string: 'Apr 7, 2013 to Sep 29, 2013'
        },
        synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans...',
        genres: [
            { name: 'Action' },
            { name: 'Drama' },
            { name: 'Fantasy' }
        ]
    },
    2: {
        mal_id: 2,
        title: 'Death Note',
        title_english: 'Death Note',
        images: {
            jpg: {
                large_image_url: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg'
            }
        },
        score: 8.6,
        episodes: 37,
        status: 'Finished Airing',
        aired: {
            string: 'Oct 4, 2006 to Jun 27, 2007'
        },
        synopsis: 'A shinigami, as a god of death, can kill any person—provided they see their victim\'s face and write their victim\'s name in a notebook called a Death Note...',
        genres: [
            { name: 'Mystery' },
            { name: 'Psychological' },
            { name: 'Supernatural' }
        ]
    },
    3: {
        mal_id: 3,
        title: 'Fullmetal Alchemist: Brotherhood',
        title_english: 'Fullmetal Alchemist: Brotherhood',
        images: {
            jpg: {
                large_image_url: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg'
            }
        },
        score: 9.1,
        episodes: 64,
        status: 'Finished Airing',
        aired: {
            string: 'Apr 5, 2009 to Jul 4, 2010'
        },
        synopsis: 'After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality...',
        genres: [
            { name: 'Action' },
            { name: 'Adventure' },
            { name: 'Drama' },
            { name: 'Fantasy' }
        ]
    }
}; 