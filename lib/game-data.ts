export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Location {
  id: number;
  name: string;
  country: string;
  imageUrl: string;
  hint: string;
  difficulty: Difficulty;
}

export interface Question {
  location: Location;
  options: string[];
  correctAnswer: string;
}

export const locations: Location[] = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
    hint: 'Home to the iconic Eiffel Tower and known as the City of Light',
    difficulty: 'easy'
  },
  {
    id: 2,
    name: 'Rome',
    country: 'Italy',
    imageUrl: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
    hint: 'The Eternal City with ancient ruins and the Colosseum',
    difficulty: 'easy'
  },
  {
    id: 3,
    name: 'Tokyo',
    country: 'Japan',
    imageUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
    hint: 'Asia\'s largest metropolis known for neon lights and technology',
    difficulty: 'easy'
  },
  {
    id: 4,
    name: 'New York',
    country: 'USA',
    imageUrl: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
    hint: 'The Big Apple with its famous skyline and Statue of Liberty',
    difficulty: 'easy'
  },
  {
    id: 5,
    name: 'London',
    country: 'UK',
    imageUrl: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    hint: 'Home to Big Ben, double-decker buses, and royal palaces',
    difficulty: 'easy'
  },
  {
    id: 6,
    name: 'Cairo',
    country: 'Egypt',
    imageUrl: 'https://images.pexels.com/photos/3290075/pexels-photo-3290075.jpeg',
    hint: 'Ancient city near the great pyramids and the Sphinx',
    difficulty: 'medium'
  },
  {
    id: 7,
    name: 'Sydney',
    country: 'Australia',
    imageUrl: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg',
    hint: 'Famous for its sail-shaped Opera House and harbor bridge',
    difficulty: 'medium'
  },
  {
    id: 8,
    name: 'Rio de Janeiro',
    country: 'Brazil',
    imageUrl: 'https://images.pexels.com/photos/351283/pexels-photo-351283.jpeg',
    hint: 'Known for Christ the Redeemer statue and Copacabana beach',
    difficulty: 'medium'
  },
  {
    id: 9,
    name: 'Dubai',
    country: 'UAE',
    imageUrl: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg',
    hint: 'Desert city with the world\'s tallest building and luxury shopping',
    difficulty: 'medium'
  },
  {
    id: 10,
    name: 'Barcelona',
    country: 'Spain',
    imageUrl: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
    hint: 'Gaudi\'s masterpieces and Mediterranean beaches define this city',
    difficulty: 'medium'
  },
  {
    id: 11,
    name: 'Reykjavik',
    country: 'Iceland',
    imageUrl: 'https://images.pexels.com/photos/1051449/pexels-photo-1051449.jpeg',
    hint: 'Northernmost capital city known for northern lights and geothermal pools',
    difficulty: 'hard'
  },
  {
    id: 12,
    name: 'Marrakech',
    country: 'Morocco',
    imageUrl: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg',
    hint: 'Red city with vibrant souks and desert gateway',
    difficulty: 'hard'
  },
  {
    id: 13,
    name: 'Prague',
    country: 'Czech Republic',
    imageUrl: 'https://images.pexels.com/photos/290275/pexels-photo-290275.jpeg',
    hint: 'City of a hundred spires with a famous astronomical clock',
    difficulty: 'hard'
  },
  {
    id: 14,
    name: 'Kyoto',
    country: 'Japan',
    imageUrl: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg',
    hint: 'Ancient Japanese capital with thousands of temples and zen gardens',
    difficulty: 'hard'
  },
  {
    id: 15,
    name: 'Cusco',
    country: 'Peru',
    imageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg',
    hint: 'Gateway to Machu Picchu and former Inca capital',
    difficulty: 'hard'
  }
];

const cityNamesByDifficulty: Record<Difficulty, string[]> = {
  easy: ['Paris', 'Rome', 'Tokyo', 'New York', 'London', 'Berlin', 'Madrid', 'Moscow'],
  medium: ['Cairo', 'Sydney', 'Rio de Janeiro', 'Dubai', 'Barcelona', 'Singapore', 'Istanbul', 'Bangkok'],
  hard: ['Reykjavik', 'Marrakech', 'Prague', 'Kyoto', 'Cusco', 'Tallinn', 'Bruges', 'Ljubljana']
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuestions(difficulty: Difficulty, count: number = 10): Question[] {
  const filteredLocations = locations.filter(loc => loc.difficulty === difficulty);
  const selectedLocations = shuffleArray(filteredLocations).slice(0, Math.min(count, filteredLocations.length));

  const questions: Question[] = selectedLocations.map(location => {
    const incorrectOptions = cityNamesByDifficulty[difficulty]
      .filter(city => city !== location.name);
    const shuffledIncorrect = shuffleArray(incorrectOptions).slice(0, 3);
    const allOptions = shuffleArray([location.name, ...shuffledIncorrect]);

    return {
      location,
      options: allOptions,
      correctAnswer: location.name
    };
  });

  return questions;
}
