// API Configuration File
// All API keys are centralized here for easy management

const API_CONFIG = {
    // OMDB API - Get your key from: http://www.omdbapi.com/apikey.aspx
    // Free tier: 1,000 requests per day
    OMDB_API_KEY: 'your_omdb_key',
    
    // Spotify API - Get from: https://developer.spotify.com/dashboard
    SPOTIFY_CLIENT_ID: 'your_spotify_client_id',
    SPOTIFY_CLIENT_SECRET: 'your_spotify_client_secret',
    
    // Google Gemini AI - Get from: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'your_gemini_api_key',
    
    // Firebase Configuration
    FIREBASE_CONFIG: {
        apiKey: 'your_firebase_api_key',
        authDomain: 'your_app.firebaseapp.com',
        databaseURL: 'https://your_app.firebaseio.com',
        projectId: 'your_project_id',
        storageBucket: 'your_app.appspot.com',
        messagingSenderId: 'your_sender_id',
        appId: 'your_app_id'
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}
