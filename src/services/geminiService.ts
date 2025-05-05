import {AiPlaylistType } from '../types';


export const generatePlaylistFromMood = async (mood: string): Promise<AiPlaylistType | null> => {
  // MOCKED RESPONSE for hackathon demo (frontend-only, no CORS/API key issues)
  // You can expand this with mood-specific playlists if desired
  const moodSongs: Record<string, { title: string, artist: string }[]> = {
    happy: [
      { title: "Happy", artist: "Pharrell Williams" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
      { title: "Shut Up and Dance", artist: "WALK THE MOON" },
      { title: "Good as Hell", artist: "Lizzo" },
      { title: "On Top of the World", artist: "Imagine Dragons" },
      { title: "Best Day of My Life", artist: "American Authors" },
      { title: "Firework", artist: "Katy Perry" },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
      { title: "Happy Now", artist: "Zedd & Elley Duhé" }
    ],
    sad: [
      { title: "Someone Like You", artist: "Adele" },
      { title: "Fix You", artist: "Coldplay" },
      { title: "Let Her Go", artist: "Passenger" },
      { title: "Yesterday", artist: "The Beatles" },
      { title: "Skinny Love", artist: "Birdy" },
      { title: "The Night We Met", artist: "Lord Huron" },
      { title: "Say Something", artist: "A Great Big World & Christina Aguilera" },
      { title: "All I Want", artist: "Kodaline" },
      { title: "Happier", artist: "Ed Sheeran" },
      { title: "Jealous", artist: "Labrinth" }
    ],
    energetic: [
      { title: "Stronger", artist: "Kanye West" },
      { title: "Titanium", artist: "David Guetta ft. Sia" },
      { title: "Don't Start Now", artist: "Dua Lipa" },
      { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis" },
      { title: "Feel This Moment", artist: "Pitbull ft. Christina Aguilera" },
      { title: "Levels", artist: "Avicii" },
      { title: "Bang Bang", artist: "Jessie J, Ariana Grande, Nicki Minaj" },
      { title: "Turn Down for What", artist: "DJ Snake & Lil Jon" },
      { title: "Pump It", artist: "The Black Eyed Peas" },
      { title: "Dance Monkey", artist: "Tones and I" }
    ],
    chill: [
      { title: "Sunflower", artist: "Post Malone & Swae Lee" },
      { title: "Location", artist: "Khalid" },
      { title: "Electric Feel", artist: "MGMT" },
      { title: "Sunday Best", artist: "Surfaces" },
      { title: "Riptide", artist: "Vance Joy" },
      { title: "Lost in Japan", artist: "Shawn Mendes" },
      { title: "Banana Pancakes", artist: "Jack Johnson" },
      { title: "Put It All on Me", artist: "Ed Sheeran ft. Ella Mai" },
      { title: "Ocean Eyes", artist: "Billie Eilish" },
      { title: "Budapest", artist: "George Ezra" }
    ],
    heartbroken: [
      { title: "Someone You Loved", artist: "Lewis Capaldi" },
      { title: "Back to December", artist: "Taylor Swift" },
      { title: "Let Me Down Slowly", artist: "Alec Benjamin" },
      { title: "Lose You to Love Me", artist: "Selena Gomez" },
      { title: "I Will Always Love You", artist: "Whitney Houston" },
      { title: "All I Want", artist: "Kodaline" },
      { title: "When I Was Your Man", artist: "Bruno Mars" },
      { title: "Too Good at Goodbyes", artist: "Sam Smith" },
      { title: "Un-break My Heart", artist: "Toni Braxton" },
      { title: "Let It Go", artist: "James Bay" }
    ],
    relax: [
      { title: "Weightless", artist: "Marconi Union" },
      { title: "Holocene", artist: "Bon Iver" },
      { title: "River Flows In You", artist: "Yiruma" },
      { title: "Bloom", artist: "The Paper Kites" },
      { title: "Sunset Lover", artist: "Petit Biscuit" },
      { title: "Breathe Me", artist: "Sia" },
      { title: "Cherry Wine", artist: "Hozier" },
      { title: "Lost Cause", artist: "Billie Eilish" },
      { title: "Ophelia", artist: "The Lumineers" },
      { title: "The Night We Met", artist: "Lord Huron" }
    ]
  };
  const songs = moodSongs[mood.toLowerCase()] || moodSongs["happy"];
  return {
    title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`,
    mood,
    songs,
    createdAt: new Date().toISOString(),
    id: Math.random().toString(36).slice(2),
  };
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