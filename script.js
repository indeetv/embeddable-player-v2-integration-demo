const screener_key = 'YOUR_SCREENER_KEY_HERE'
const watchApiKey = 'YOUR_API_KEY_HERE'

const dataToEnablePlayback = {
    apiUrl: `https://api.indee.tv/v2/watch/stream/${screener_key}/playback`,
    loginApiUrl: 'https://api.indee.tv/v2/watch/auth/login',
    embeddablePlayerInitializationUrl: 'https://api.indee.tv/v2/watch/stream/player/init',
    embeddablePlayerTemplateURL: 'https://api.indee.tv/v2/watch/stream/player/view',
    apiKey: watchApiKey,
    authToken: ''
};

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Function to generate ClientID Header that is required by the APIs
     * @returns {string} - ClientID Header (e.g., "WEB-CHROME-125.0.0.0-WINDOWS10")
     */
    const generateClientId = () => {
        const parser = new UAParser(window.navigator.userAgent);
        const { browser, os } = parser.getResult();
        return `WEB-${browser.name.toUpperCase()}-${browser.version}-${os.name.toUpperCase()}${os.version}` || '';
    };

    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };


    const logUserIn = async (accessToken) => {
        try {
            const response = await fetch(dataToEnablePlayback.loginApiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${dataToEnablePlayback.apiKey}`,
                    Clientid: generateClientId(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'pin', credentials: { pin: accessToken }, persist: false }),
            });
            const loginPayload = await response.json()
            dataToEnablePlayback.authToken = loginPayload.token
        } catch (error) {
            console.error('Error for login api:', error);
        }
    }

    /**
     * Fetches the embeddable player HTML and initializes the Indee player
     * @param {Object} playbackData - Response from the playback API
     */
    const getEmbeddablePlayer = async (playbackData) => {
        try {
            const response = await fetch(dataToEnablePlayback.embeddablePlayerTemplateURL, {
                headers: {
                    Authorization: `Bearer ${dataToEnablePlayback.apiKey}`,
                    Clientid: generateClientId(),
                    'Content-Type': 'application/html',
                },
            });
            const embeddablePlayerHtml = await response.text();
            if (window?.initializeIndeePlayer) {
                window.initializeIndeePlayer(
                    'video_player',
                    {
                        playbackSourcesData: { drm: playbackData.drm, manifest: playbackData.manifest },
                        playbackMode: 'dash',
                        overlayWatermarkDetails: {},
                        engagementInterval: { ...playbackData.engagement }
                    },
                    embeddablePlayerHtml,
                    'video_key',
                    { autoPlay: true }
                );
            }
        } catch (error) {
            console.error('Error fetching or initializing the embeddable player:', error);
        }
    };

    const fetchPlaybackData = async () => {
        try {
            const response = await fetch(dataToEnablePlayback.apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: `JWT ${dataToEnablePlayback.authToken}`,
                    Clientid: generateClientId(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stream_protocol: 'dash' }),
            });
            const playbackData = await response.json();
            await getEmbeddablePlayer(playbackData);
        } catch (error) {
            console.error('Error fetching playback data:', error);
        }
    };

    const init = async () => {
        try {
            await loadScript(dataToEnablePlayback.embeddablePlayerInitializationUrl);
            const userInput = prompt("Please enter your access token");
            await logUserIn(userInput)
            await fetchPlaybackData();
        } catch (error) {
            console.error('Error initializing the player:', error);
        }
    };

    init();
});
