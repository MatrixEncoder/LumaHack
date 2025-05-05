import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  Volume1, Volume2, VolumeX, 
  Laptop, ListMusic, Maximize2 
} from 'lucide-react';
import { usePlayback } from '../../context/PlaybackContext';

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong
  } = usePlayback();

  // Local state for progress
  const [progress, setProgress] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  
  // Local state for volume and mute
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  // Handle time updates with throttling
  const handleTimeUpdate = useCallback(() => {
    if (isDraggingProgress) return;
    
    const now = Date.now();
    if (now - lastTimeRef.current < 50) return; // ~20fps
    lastTimeRef.current = now;
    
    // Only update if component is still mounted
    rafRef.current = requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      
      const newProgress = (audio.currentTime / audio.duration) * 100;
      // Batch state updates
      setProgress(prev => Math.abs(prev - newProgress) > 0.1 ? newProgress : prev);
      setTempProgress(prev => Math.abs(prev - newProgress) > 0.1 ? newProgress : prev);
    });
  }, [isDraggingProgress]);
  
  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleTimeUpdate]);
  
  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Sync volume and mute state to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, isMuted ? 0 : volume / 100));
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Handle seeking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong || isDraggingProgress) return;
    
    if (audio.duration) {
      audio.currentTime = (progress / 100) * audio.duration;
    }
  }, [progress, isDraggingProgress, currentSong]);

  // Reset progress when song changes
  useEffect(() => {
    setProgress(0);
    setTempProgress(0);
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
  }, [currentSong]);

  // Handle song end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => nextSong();
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextSong]);
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
    setProgress(percent);
  };
  
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
    setVolume(percent);
    
    if (percent === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate current time based on progress percentage
  const currentTime = currentSong ? (tempProgress / 100) * (currentSong.duration) : 0;
  
  const VolumeIcon = () => {
    if (volume === 0 || isMuted) return <VolumeX />;
    if (volume < 50) return <Volume1 />;
    return <Volume2 />;
  };
  
  // State for modals
  const [showQueue, setShowQueue] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  // Shuffle and repeat refs for logic (do not trigger re-render)
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  // Local UI state for color only
  const [shuffleUI, setShuffleUI] = useState(false);
  const [repeatUI, setRepeatUI] = useState(false);

  return (
    <>
      {/* Queue Modal */}
      {showQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-[#181818] w-full md:w-96 rounded-t-2xl md:rounded-xl shadow-lg p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Queue</h3>
              <button onClick={() => setShowQueue(false)} className="text-[#b3b3b3] hover:text-white text-2xl leading-none">&times;</button>
            </div>
            {/* Simulated queue, show currentSong and up to 4 more songs */}
            {currentSong ? (
              <ul className="space-y-3 overflow-y-auto">
                <li className="flex items-center space-x-3 bg-[#232323] rounded p-2">
                  <img src={currentSong.cover} alt={currentSong.title} className="w-10 h-10 rounded object-cover" />
                  <div>
                    <div className="font-semibold text-white">{currentSong.title}</div>
                    <div className="text-[#b3b3b3] text-xs">{currentSong.artist}</div>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 bg-[#1DB954] text-black rounded-full">Now Playing</span>
                </li>
                {/* Simulate next 4 songs in the queue */}
                {[1,2,3,4].map(i => (
                  <li key={i} className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 rounded bg-[#232323] flex items-center justify-center text-[#b3b3b3]">♪</div>
                    <div>
                      <div className="font-semibold text-white">Upcoming Song {i}</div>
                      <div className="text-[#b3b3b3] text-xs">Artist {i}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[#b3b3b3]">Queue is empty.</div>
            )}
          </div>
        </div>
      )}
      {/* Devices Modal */}
      {showDevices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-[#181818] w-full md:w-80 rounded-t-2xl md:rounded-xl shadow-lg p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Connect to a device</h3>
              <button onClick={() => setShowDevices(false)} className="text-[#b3b3b3] hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 p-2 rounded bg-[#232323]">
                <Laptop size={18} className="text-[#1DB954]" />
                <span className="text-white font-semibold">This device</span>
                <span className="ml-auto text-xs px-2 py-1 bg-[#1DB954] text-black rounded-full">Active</span>
              </li>
              <li className="flex items-center space-x-3 p-2 rounded hover:bg-[#232323] cursor-pointer">
                <Laptop size={18} className="text-[#b3b3b3]" />
                <span className="text-white">Living Room Speaker</span>
              </li>
              <li className="flex items-center space-x-3 p-2 rounded hover:bg-[#232323] cursor-pointer">
                <Laptop size={18} className="text-[#b3b3b3]" />
                <span className="text-white">Bedroom TV</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* Audio element for playback */}
      {currentSong && currentSong.audio && (
        <audio
          ref={audioRef}
          src={currentSong.audio}
          preload="auto"
          onEnded={nextSong}
        />
      )}
      <div className="flex items-center justify-between h-20 px-4 bg-[#181818] border-t border-[#282828] text-white fixed bottom-0 left-0 right-0 z-50 md:static md:h-20 md:px-4 px-2 py-2 overflow-visible" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Now playing */}
      <div className="flex items-center w-1/4 min-w-0 max-w-[40vw] sm:max-w-none">
        {currentSong ? (
          <>
            <div className="h-14 w-14 mr-3 flex-shrink-0">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mr-4">
              <div className="text-sm font-medium truncate">{currentSong.title}</div>
              <div className="text-xs text-[#b3b3b3] truncate">{currentSong.artist}</div>
            </div>
          </>
        ) : (
          <div className="flex items-center text-[#b3b3b3]">
            <span className="text-sm">No song selected</span>
          </div>
        )}
      </div>
      
      {/* Playback controls */}
      <div className="flex flex-col items-center justify-center w-2/4 min-w-0 max-w-[60vw] sm:max-w-none">
        <div className="flex items-center justify-center mb-2 space-x-4">
          <button
            className="player-control"
            onClick={() => {
              shuffleRef.current = !shuffleRef.current;
              setShuffleUI(u => !u);
            }}
            style={{ color: shuffleUI ? '#1DB954' : 'white' }}
            aria-pressed={shuffleUI}
          >
            <Shuffle size={18} />
          </button>
          <button onClick={prevSong} className="player-control">
            <SkipBack size={18} />
          </button>
          <button 
            onClick={togglePlay} 
            className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button onClick={nextSong} className="player-control">
            <SkipForward size={18} />
          </button>
          <button
            className="player-control"
            onClick={() => {
              repeatRef.current = !repeatRef.current;
              setRepeatUI(u => !u);
            }}
            style={{ color: repeatUI ? '#1DB954' : 'white' }}
            aria-pressed={repeatUI}
          >
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center w-full max-w-xl">
          <div className="text-xs text-[#b3b3b3] w-10 text-right mr-2">
            {formatTime(currentTime)}
          </div>
          
          <div 
            ref={progressRef}
            className="flex-1 h-1 bg-[#535353] rounded-full cursor-pointer relative group"
            onClick={handleProgressClick}
            onMouseDown={() => {
              setIsDraggingProgress(true);
              // Disable text selection while dragging
              document.body.style.userSelect = 'none';
            }}
            onMouseUp={() => {
              setIsDraggingProgress(false);
              setProgress(tempProgress);
              document.body.style.userSelect = '';
            }}
            onMouseLeave={() => {
              if (isDraggingProgress) {
                setIsDraggingProgress(false);
                setProgress(tempProgress);
                document.body.style.userSelect = '';
              }
            }}
            onMouseMove={(e) => {
              if (isDraggingProgress && progressRef.current) {
                const rect = progressRef.current.getBoundingClientRect();
                const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
                setTempProgress(prev => Math.abs(prev - percent) > 0.5 ? percent : prev);
              }
            }}
          >
            <div 
              className="h-full bg-[#b3b3b3] rounded-full relative group-hover:bg-[#1DB954] transition-colors duration-200"
              style={{
                width: `${tempProgress}%`,
                // Use transform for better performance
                transform: `translateZ(0)`,
                willChange: 'width'
              }}
            >
              <div 
                className="h-3 w-3 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 shadow-md transition-opacity duration-200"
                style={{
                  transform: 'translateY(-50%) translateZ(0)',
                  willChange: 'opacity'
                }}
              ></div>
            </div>
          </div>
          
          <div className="text-xs text-[#b3b3b3] w-10 ml-2">
            {currentSong ? formatTime(currentSong.duration) : "0:00"}
          </div>
        </div>
      </div>
      
      {/* Volume controls */}
      <div className="flex items-center justify-end w-1/4 min-w-0 max-w-[40vw] sm:max-w-none space-x-2 md:space-x-3">
        <button className="player-control" onClick={() => setShowQueue(true)}>
          <ListMusic size={18} />
        </button>
        <button className="player-control" onClick={() => setShowDevices(true)}>
          <Laptop size={18} />
        </button>
        
        <div className="flex items-center">
          <button onClick={toggleMute} className="player-control mr-1">
            <VolumeIcon />
          </button>
          
          <div 
            ref={volumeRef}
            className="w-24 h-1 bg-[#535353] rounded-full cursor-pointer relative"
            onClick={handleVolumeClick}
            onMouseDown={() => setIsDraggingVolume(true)}
            onMouseUp={() => setIsDraggingVolume(false)}
            onMouseLeave={() => setIsDraggingVolume(false)}
            onMouseMove={(e) => {
              if (isDraggingVolume && volumeRef.current) {
                const rect = volumeRef.current.getBoundingClientRect();
                const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
                setVolume(percent);
                setIsMuted(percent === 0);
              }
            }}
          >
            <div 
              className="h-full bg-[#b3b3b3] rounded-full relative hover:bg-[#1DB954] group"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            >
              <div className="h-3 w-3 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 shadow-md"></div>
            </div>
            
          </div>
        </div>
        
        <button className="player-control">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
    </>
  );
};

export default MusicPlayer;