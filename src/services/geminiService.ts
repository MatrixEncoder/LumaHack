import { AiPlaylistSongType, AiPlaylistType } from '../types';

export const generatePlaylistFromMood = async (mood: string): Promise<AiPlaylistType | null> => {
  try {
    // Lowercase and trimmed mood for matching
    const moodInput = mood.trim().toLowerCase();
    if (!moodInput) return null;

    // Define mood pools
    const moodPools: Record<string, AiPlaylistSongType[]> = {
      happy: [
        { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
        { title: "Happy", artist: "Pharrell Williams" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Walking on Sunshine", artist: "Katrina and The Waves" },
        { title: "Good as Hell", artist: "Lizzo" },
        { title: "I Gotta Feeling", artist: "Black Eyed Peas" },
        { title: "High Hopes", artist: "Panic! At The Disco" },
        { title: "Electric Feel", artist: "MGMT" },
        { title: "Best Day Of My Life", artist: "American Authors" },
        { title: "Firework", artist: "Katy Perry" }
      ],
      energetic: [
        { title: "Titanium", artist: "David Guetta ft. Sia" },
        { title: "Stronger", artist: "Kanye West" },
        { title: "Don't Stop Me Now", artist: "Queen" },
        { title: "Feel This Moment", artist: "Pitbull ft. Christina Aguilera" },
        { title: "On Top Of The World", artist: "Imagine Dragons" },
        { title: "Let's Go", artist: "Calvin Harris ft. Ne-Yo" },
        { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
        { title: "Levels", artist: "Avicii" },
        { title: "Turn Down for What", artist: "DJ Snake & Lil Jon" },
        { title: "Bangarang", artist: "Skrillex" }
      ],
      sad: [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Fix You", artist: "Coldplay" },
        { title: "All Too Well", artist: "Taylor Swift" },
        { title: "Skinny Love", artist: "Bon Iver" },
        { title: "Hurt", artist: "Johnny Cash" },
        { title: "When The Party's Over", artist: "Billie Eilish" },
        { title: "Everybody Hurts", artist: "R.E.M." },
        { title: "Tears In Heaven", artist: "Eric Clapton" },
        { title: "The Night We Met", artist: "Lord Huron" },
        { title: "Let Her Go", artist: "Passenger" }
      ],
      heartbroken: [
        { title: "Back to December", artist: "Taylor Swift" },
        { title: "Someone You Loved", artist: "Lewis Capaldi" },
        { title: "Un-break My Heart", artist: "Toni Braxton" },
        { title: "Too Good at Goodbyes", artist: "Sam Smith" },
        { title: "Let It Go", artist: "James Bay" },
        { title: "We Don't Talk Anymore", artist: "Charlie Puth" },
        { title: "Love The Way You Lie", artist: "Eminem ft. Rihanna" },
        { title: "Happier", artist: "Ed Sheeran" },
        { title: "Somebody That I Used to Know", artist: "Gotye" },
        { title: "Irreplaceable", artist: "Beyoncé" }
      ],
      chill: [
        { title: "Sunday Morning", artist: "Maroon 5" },
        { title: "Dreams", artist: "Fleetwood Mac" },
        { title: "Banana Pancakes", artist: "Jack Johnson" },
        { title: "Redbone", artist: "Childish Gambino" },
        { title: "Cigarette Daydreams", artist: "Cage The Elephant" },
        { title: "Watermelon Sugar", artist: "Harry Styles" },
        { title: "Landslide", artist: "Fleetwood Mac" },
        { title: "3 Nights", artist: "Dominic Fike" },
        { title: "Budapest", artist: "George Ezra" },
        { title: "Location", artist: "Khalid" }
      ],
      relax: [
        { title: "Weightless", artist: "Marconi Union" },
        { title: "Holocene", artist: "Bon Iver" },
        { title: "Sunset Lover", artist: "Petit Biscuit" },
        { title: "Bloom", artist: "ODESZA" },
        { title: "Rivers and Roads", artist: "The Head and the Heart" },
        { title: "Sunset", artist: "The Midnight" },
        { title: "Lost in Japan", artist: "Shawn Mendes" },
        { title: "Ocean Eyes", artist: "Billie Eilish" },
        { title: "Cherry Wine", artist: "Hozier" },
        { title: "Home", artist: "Edward Sharpe & The Magnetic Zeros" }
      ]
    };

    // Find which mood pool matches
    let matchedMood = Object.keys(moodPools).find(moodKey => moodInput.includes(moodKey));
    if (!matchedMood) {
      // If no mood matches, return null for garbage input
      return null;
    }
    // Shuffle and pick 8 random songs from the matched mood pool
    const pool = [...moodPools[matchedMood]];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const mockSongs = pool.slice(0, 8);
    const playlistTitle = `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`;
    return {
      title: playlistTitle,
      mood: mood,
      songs: mockSongs,
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substring(2, 9)
    };
  } catch (error) {
    console.error("Error generating playlist:", error);
    return null;
  }
};

// Utility to convert mock playlist to actual playlist with cover images
export const enhancePlaylist = (aiPlaylist: AiPlaylistType) => {
  // In a real app, you might fetch images and additional metadata
  // For now, we'll just return a random cover image
  const covers = [
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    'https://images.pexels.com/photos/3552948/pexels-photo-3552948.jpeg',
    'https://images.pexels.com/photos/4571219/pexels-photo-4571219.jpeg',
    'https://images.pexels.com/photos/4691535/pexels-photo-4691535.jpeg',
    'https://images.pexels.com/photos/3156381/pexels-photo-3156381.jpeg',
  ];
  
  const randomCover = covers[Math.floor(Math.random() * covers.length)];
  
  return {
    ...aiPlaylist,
    cover: randomCover
  };
};