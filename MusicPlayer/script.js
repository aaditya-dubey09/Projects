// Simple variables instead of class
        let currentSongIndex = 0;
        let isPlaying = false;
        let currentTime = 0;
        let duration = 222;
        let progressInterval;
        
        // Song data
        const songs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
    emoji: "🎧",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
    emoji: "🎶",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
    emoji: "🎵",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
    emoji: "🎤",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
    emoji: "🎸",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
    emoji: "🎹",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
    emoji: "🎷",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
    emoji: "🎺",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
    emoji: "🎻",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
    emoji: "🎼",
  },
];
        
        // Get elements
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const playlistContainer = document.getElementById('playlist');

// Render playlist dynamically
function renderPlaylist() {
  playlistContainer.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (index === currentSongIndex) item.classList.add('active');
    item.innerHTML = `
      <div class="playlist-item-info">
        <div class="playlist-item-title">${song.title}</div>
        <div class="playlist-item-artist">${song.artist}</div>
      </div>
      <div class="playlist-item-duration">${song.duration}</div>
    `;
    item.addEventListener('click', () => {
      selectSong(index);
      if (!isPlaying) togglePlay();
    });
    playlistContainer.appendChild(item);
  });
  updatePlaylistUI();
}

// Update playlist UI (active class, EQ bars, etc.)
function updatePlaylistUI() {
  const items = playlistContainer.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    item.classList.toggle('active', index === currentSongIndex);
    // Optionally add EQ bars if you want
    let eqBars = item.querySelector('.eq-bars');
    if (index === currentSongIndex && isPlaying) {
      if (!eqBars) {
        eqBars = document.createElement('div');
        eqBars.className = 'eq-bars';
        eqBars.innerHTML = `
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
        `;
        item.appendChild(eqBars);
      }
    } else if (eqBars) {
      eqBars.remove();
    }
  });
}

// Update display
function updateDisplay() {
  const currentSong = songs[currentSongIndex];
  songTitle.textContent = currentSong.title;
  artistName.textContent = currentSong.artist;
  albumArt.innerHTML = `<span>${currentSong.emoji || "🎵"}</span>`;
  duration = currentSong.seconds || 222;
  durationEl.textContent = currentSong.duration;
  updatePlaylistUI();
  updateProgress();
}

        // Play/Pause function
        function togglePlay() {
            isPlaying = !isPlaying;
            playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
            
            if (isPlaying) {
                albumArt.classList.add('spinning');
                startProgress();
                updateEqualizer();
            } else {
                albumArt.classList.remove('spinning');
                stopProgress();
            }
        }
        
        // Previous song
        function previousSong() {
            currentSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
            currentTime = 0;
            updateDisplay();
            if (isPlaying) startProgress();
        }
        
        // Next song
        function nextSong() {
            currentSongIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
            currentTime = 0;
            updateDisplay();
            if (isPlaying) startProgress();
        }
        
        // Select song from playlist
        function selectSong(index) {
            currentSongIndex = index;
            currentTime = 0;
            updateDisplay();
            if (isPlaying) startProgress();
        }
        
        // Seek in progress bar
        function seek(e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            currentTime = percentage * duration;
            updateProgress();
        }
        
        // Set volume
        function setVolume(value) {
            const volumeIcon = document.querySelector('.volume-icon');
            if (value == 0) {
                volumeIcon.textContent = '🔇';
            } else if (value < 50) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
        
        // Update display
        function updateDisplay() {
            const currentSong = songs[currentSongIndex];
            songTitle.textContent = currentSong.title;
            artistName.textContent = currentSong.artist;
            albumArt.innerHTML = `<span>${currentSong.emoji}</span>`;
            duration = currentSong.seconds;
            durationEl.textContent = currentSong.duration;
            
            // Update playlist
            playlistItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentSongIndex);
                const eqBars = item.querySelector('.eq-bars');
                eqBars.classList.toggle('paused', index !== currentSongIndex || !isPlaying);
            });
            
            updateProgress();
        }
        
        // Update progress bar
        function updateProgress() {
            const percentage = (currentTime / duration) * 100;
            progress.style.width = percentage + '%';
            progress.style.width = (currentTime / duration * 100) + '%';
            currentTimeEl.textContent = formatTime(currentTime);
        }
        
        // Start progress timer
        function startProgress() {
            stopProgress(); // Clear existing interval
            progressInterval = setInterval(() => {
                currentTime += 1;
                if (currentTime >= duration) {
                    nextSong();
                }
                updateProgress();
            }, 1000);
        }
        
        // Stop progress timer
        function stopProgress() {
            clearInterval(progressInterval);
        }
        
        // Format time
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

// Update display (fix playlist update)
function updateDisplay() {
    const currentSong = songs[currentSongIndex];
    songTitle.textContent = currentSong.title;
    artistName.textContent = currentSong.artist;
    albumArt.innerHTML = `<span>${currentSong.emoji}</span>`;
    duration = currentSong.seconds;
    durationEl.textContent = currentSong.duration;
    updatePlaylistUI();
    updateProgress();
}

        // Event listeners
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', previousSong);
nextBtn.addEventListener('click', nextSong);
progressBar.addEventListener('click', seek);
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

// On DOM ready, render playlist and update display
document.addEventListener('DOMContentLoaded', () => {
  renderPlaylist();
  updateDisplay();

  const musicPlayer = document.querySelector('.music-player');
  musicPlayer.style.opacity = '0';
  musicPlayer.style.transform = 'translateY(20px)';
  setTimeout(() => {
    musicPlayer.style.transition = 'all 0.6s ease';
    musicPlayer.style.opacity = '1';
    musicPlayer.style.transform = 'translateY(0)';
  }, 100);
});