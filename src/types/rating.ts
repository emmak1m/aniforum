export interface RatingCategory {
    name: string;
    description: string;
    value: number;
}

export const ratingCategories: RatingCategory[] = [
    {
        name: 'Story',
        description: 'How engaging and well-written is the story?',
        value: 0
    },
    {
        name: 'Animation',
        description: 'How is the quality of the animation?',
        value: 0
    },
    {
        name: 'Sound',
        description: 'How good is the music and sound design?',
        value: 0
    },
    {
        name: 'Characters',
        description: 'How well-developed and interesting are the characters?',
        value: 0
    },
    {
        name: 'Enjoyment',
        description: 'How much did you enjoy watching it?',
        value: 0
    }
]; 