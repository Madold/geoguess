export type Difficulty = "easy" | "medium" | "hard";

export interface Location {
  id: number;
  name: string;
  country: string;
  imageId: string;
  hint: string;
  difficulty: Difficulty;
  latitude: number;
  longitude: number;
}

export interface Question {
  location: Location;
  options: string[];
  correctAnswer: string;
}

export const locations: Location[] = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    imageId: "1004351301404983",
    hint: "Home to the iconic Eiffel Tower and known as the City of Light",
    difficulty: "easy",
    latitude: 48.852121, // Aproximado del centro de París
    longitude: 2.346178,
  },
  {
    id: 2,
    name: "Rome",
    country: "Italy",
    imageId: "1845688592864847",
    hint: "The Eternal City with ancient ruins and the Colosseum",
    difficulty: "easy",
    latitude: 41.9028, // Aproximado del centro de Roma
    longitude: 12.4964,
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    imageId: "247945900459629",
    hint: "Asia's largest metropolis known for neon lights and technology",
    difficulty: "easy",
    latitude: 35.6895, // Aproximado de Tokio
    longitude: 139.6917,
  },
  {
    id: 4,
    name: "New York",
    country: "USA",
    imageId: "1467457553797781",
    hint: "The Big Apple with its famous skyline and Statue of Liberty",
    difficulty: "easy",
    latitude: 40.7128, // Aproximado de Nueva York
    longitude: -74.006,
  },
  {
    id: 5,
    name: "London",
    country: "UK",
    imageId: "240939401996959",
    hint: "Home to Big Ben, double-decker buses, and royal palaces",
    difficulty: "easy",
    latitude: 51.5074, // Aproximado de Londres
    longitude: 0.1278,
  },
  {
    id: 6,
    name: "Cairo",
    country: "Egypt",
    imageId: "1290550125227737",
    hint: "Ancient city near the great pyramids and the Sphinx",
    difficulty: "medium",
    latitude: 30.0333, // Aproximado de El Cairo
    longitude: 31.2333,
  },
  {
    id: 7,
    name: "Sydney",
    country: "Australia",
    imageId: "811243919490327",
    hint: "Famous for its sail-shaped Opera House and harbor bridge",
    difficulty: "medium",
    latitude: -33.8688, // Aproximado de Sídney
    longitude: 151.2093,
  },
  {
    id: 8,
    name: "Rio de Janeiro",
    country: "Brazil",
    imageId: "453173799119193",
    hint: "Known for Christ the Redeemer statue and Copacabana beach",
    difficulty: "medium",
    latitude: -22.9068, // Aproximado de Río de Janeiro
    longitude: -43.1729,
  },
  {
    id: 9,
    name: "Dubai",
    country: "UAE",
    imageId: "1000650170679297",
    hint: "Desert city with the world's tallest building and luxury shopping",
    difficulty: "medium",
    latitude: 25.2048, // Aproximado de Dubái
    longitude: 55.2708,
  },
  {
    id: 10,
    name: "Barcelona",
    country: "Spain",
    imageId: "286501789603354",
    hint: "Gaudi's masterpieces and Mediterranean beaches define this city",
    difficulty: "medium",
    latitude: 41.3851, // Aproximado de Barcelona
    longitude: 2.1734,
  },
  {
    id: 11,
    name: "Reykjavik",
    country: "Iceland",
    imageId: "702943297633517",
    hint: "Northernmost capital city known for northern lights and geothermal pools",
    difficulty: "hard",
    latitude: 64.1265, // Aproximado de Reikiavik
    longitude: -21.8174,
  },
  {
    id: 12,
    name: "Marrakech",
    country: "Morocco",
    imageId: "767376107295070",
    hint: "Red city with vibrant souks and desert gateway",
    difficulty: "hard",
    latitude: 31.6295, // Aproximado de Marrakech
    longitude: -7.9811,
  },
  {
    id: 13,
    name: "Prague",
    country: "Czech Republic",
    imageId: "1052266089528639",
    hint: "City of a hundred spires with a famous astronomical clock",
    difficulty: "hard",
    latitude: 50.0755, // Aproximado de Praga
    longitude: 14.4378,
  },
  {
    id: 14,
    name: "Kyoto",
    country: "Japan",
    imageId: "1339112230177112",
    hint: "Ancient Japanese capital with thousands of temples and zen gardens",
    difficulty: "hard",
    latitude: 35.0116, // Aproximado de Kioto
    longitude: 135.7681,
  },
  {
    id: 15,
    name: "Cusco",
    country: "Peru",
    imageId: "762111565948684",
    hint: "Gateway to Machu Picchu and former Inca capital",
    difficulty: "hard",
    latitude: -13.532, // Aproximado de Cusco
    longitude: -71.9675,
  },
];

const cityNamesByDifficulty: Record<Difficulty, string[]> = {
  easy: [
    "Paris",
    "Rome",
    "Tokyo",
    "New York",
    "London",
    "Berlin",
    "Madrid",
    "Moscow",
  ],
  medium: [
    "Cairo",
    "Sydney",
    "Rio de Janeiro",
    "Dubai",
    "Barcelona",
    "Singapore",
    "Istanbul",
    "Bangkok",
  ],
  hard: [
    "Reykjavik",
    "Marrakech",
    "Prague",
    "Kyoto",
    "Cusco",
    "Tallinn",
    "Bruges",
    "Ljubljana",
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuestions(
  difficulty: Difficulty,
  count: number = 10
): Question[] {
  const filteredLocations = locations.filter(
    (loc) => loc.difficulty === difficulty
  );
  const selectedLocations = shuffleArray(filteredLocations).slice(
    0,
    Math.min(count, filteredLocations.length)
  );

  const questions: Question[] = selectedLocations.map((location) => {
    const incorrectOptions = cityNamesByDifficulty[difficulty].filter(
      (city) => city !== location.name
    );
    const shuffledIncorrect = shuffleArray(incorrectOptions).slice(0, 3);
    const allOptions = shuffleArray([location.name, ...shuffledIncorrect]);

    return {
      location,
      options: allOptions,
      correctAnswer: location.name,
    };
  });

  return questions;
}
