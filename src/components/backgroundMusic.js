import React, { useEffect, useRef, useState } from 'react';

const BackgroundMusic = ({ src, volume = 0.2 }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlay = () => {
      const audio = audioRef.current;
      if (audio && !isPlaying) {
        audio.volume = volume; // Set the initial volume
        audio.play();
        audio.loop = true; // Ensure the audio loops indefinitely
        setIsPlaying(true);
        document.removeEventListener('click', handlePlay); // Remove the event listener after playing
      }
    };

    document.addEventListener('click', handlePlay);

    return () => {
      document.removeEventListener('click', handlePlay);
    };
  }, [isPlaying, volume]);

  return <audio ref={audioRef} src={src} />;
};

export default BackgroundMusic;
