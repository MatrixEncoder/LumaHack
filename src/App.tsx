import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Home, Search, Library, PlaylistDetails, AlbumDetails } from './pages';
import Account from './pages/Account';
import Notifications from './pages/Notifications';
import CreatePlaylist from './pages/CreatePlaylist';
import LikedSongs from './pages/LikedSongs';
import { PlaybackProvider } from './context/PlaybackContext';
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  return (
    <PlaybackProvider>
      <PlaylistProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="playlist/:id" element={<PlaylistDetails />} />
            <Route path="album/:id" element={<AlbumDetails />} />
            <Route path="account" element={<Account />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="create-playlist" element={<CreatePlaylist />} />
            <Route path="liked-songs" element={<LikedSongs />} />
          </Route>
        </Routes>
      </PlaylistProvider>
    </PlaybackProvider>
  );
}

export default App;