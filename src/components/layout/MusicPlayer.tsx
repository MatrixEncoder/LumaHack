import React, { useState, useRef, useEffect } from 'react';
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
    progress, 
    volume,
    togglePlay, 
    nextSong, 
    prevSong,
    setProgress,
    setVolume
  } = usePlayback();
  
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(progress);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (!isDraggingProgress && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isDraggingProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (!isDraggingProgress && audio.duration) {
      audio.currentTime = (progress / 100) * audio.duration;
    }
  }, [progress, isDraggingProgress, currentSong]);

  useEffect(() => {
    setProgress(0);
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
  }, [currentSong, setProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = () => nextSong();
    return () => { audio.onended = null; };
  }, [nextSong]);

  useEffect(() => {
    if (!isDraggingProgress) {
      setTempProgress(progress);
    }
  }, [progress, isDraggingProgress]);
  
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
  
  return (
    <>
      {/* Audio element for playback */}
      {currentSong && currentSong.audio && (
        <audio
          ref={audioRef}
          src={currentSong.audio}
          preload="auto"
          onEnded={nextSong}
        />
      )}
      <div className="flex items-center justify-between h-20 px-4 bg-[#181818] border-t border-[#282828] text-white">
      {/* Now playing */}
      <div className="flex items-center w-1/4">
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
      <div className="flex flex-col items-center justify-center w-2/4">
        <div className="flex items-center justify-center mb-2 space-x-4">
          <button className="player-control">
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
          <button className="player-control">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center w-full max-w-xl">
          <div className="text-xs text-[#b3b3b3] w-10 text-right mr-2">
            {formatTime(currentTime)}
          </div>
          
          <div 
            ref={progressRef}
            className="flex-1 h-1 bg-[#535353] rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
            onMouseDown={() => setIsDraggingProgress(true)}
            onMouseUp={() => {
              setIsDraggingProgress(false);
              setProgress(tempProgress);
            }}
            onMouseLeave={() => {
              if (isDraggingProgress) {
                setIsDraggingProgress(false);
                setProgress(tempProgress);
              }
            }}
            onMouseMove={(e) => {
              if (isDraggingProgress && progressRef.current) {
                const rect = progressRef.current.getBoundingClientRect();
                const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
                setTempProgress(percent);
              }
            }}
          >
            <div 
              className="h-full bg-[#b3b3b3] rounded-full relative hover:bg-[#1DB954] group"
              style={{ width: `${tempProgress}%` }}
            >
              <div className="h-3 w-3 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 shadow-md"></div>
            </div>
          </div>
          
          <div className="text-xs text-[#b3b3b3] w-10 ml-2">
            {currentSong ? formatTime(currentSong.duration) : "0:00"}
          </div>
        </div>
      </div>
      
      {/* Volume controls */}
      <div className="flex items-center justify-end w-1/4 space-x-3">
        <button className="player-control">
          <ListMusic size={18} />
        </button>
        <button className="player-control">
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