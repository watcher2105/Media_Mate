// API Configuration File
// All API keys are centralized here for easy management

const API_CONFIG = {
    // OMDB API - Get your key from: http://www.omdbapi.com/apikey.aspx
    // Free tier: 1,000 requests per day
    OMDB_API_KEY: '9f16bf57',
    
    // Spotify API - Get from: https://developer.spotify.com/dashboard
    SPOTIFY_CLIENT_ID: '4acfb5c3c58448a3a6fc909910dc0282',
    SPOTIFY_CLIENT_SECRET: 'f7fbb11f27954ab08687ff32dfdbecfb',
    
    // Google Gemini AI - Get from: https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: 'AIzaSyBtGBG8qmwCafPDbLAD5aEtMeVyodeX22Y',
    
    // Firebase Configuration
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyAmCKNLQa5D_VTTDApD5KRPGTxTvuMHZu4",
        authDomain: "mediamate-7be1d.firebaseapp.com",
        databaseURL: "https://mediamate-7be1d-default-rtdb.firebaseio.com",
        projectId: "mediamate-7be1d",
        storageBucket: "mediamate-7be1d.firebasestorage.app",
        messagingSenderId: "1070130926077",
        appId: "1:1070130926077:web:781de2dc1275d193af4994",
        measurementId: "G-BSV2LSNR6D"
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
}
