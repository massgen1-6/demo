// 1. Asynchronously load the official YouTube IFrame Player API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script');
if (firstScriptTag && firstScriptTag.length > 0) {
    firstScriptTag[0].parentNode.insertBefore(tag, firstScriptTag[0]);
} else {
    document.head.appendChild(tag);
}

let player;

// 2. This function automatically runs as soon as the YouTube API code downloads
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'dQw4w9WgXcQ', // Default startup video ID (Rickroll)
        playerVars: {
            'playsinline': 1,
            'controls': 1,
            'rel': 0
        }
    });
}

// 3. FIXED: Properly extracts and returns the raw text string index [1] from the RegEx array match
function extractVideoId(url) {
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    // Crucial Fix: Grab index 1 where the actual 11-character string capture group lives
    if (match && match[1] && match[1].length === 11) {
        return match[1];
    }
    
    return url;
}

// 4. Main function to hot-swap the video stream without a full page refresh
function handleVideoSearch() {
    const inputValue = document.getElementById('song-input').value.trim();
    if (!inputValue) return alert("Please enter a link or specific video ID first!");

    const targetVideoId = extractVideoId(inputValue);
    console.log("Passing ID to Player:", targetVideoId); // Verify it prints '2mDCVzruYzQ' in browser console

    if (player && typeof player.loadVideoById === 'function') {
        // Enforce explicit player variable loading methods
        player.loadVideoById({
            videoId: targetVideoId
        });
    } else {
        alert("The YouTube Player API is still processing. Give it a second and click again!");
    }
}

// 5. Ensure event bindings attach safely once the browser DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const songInput = document.getElementById('song-input');

    if (searchBtn) {
        searchBtn.addEventListener('click', handleVideoSearch);
    }

    if (songInput) {
        songInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleVideoSearch();
            }
        });
    }
});
