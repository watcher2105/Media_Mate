# 🎬 Media Mate

**Your Ultimate Entertainment Companion** - A comprehensive web application for discovering, tracking, and getting personalized recommendations for movies, web series, music, and books.


## 🌟 Features

### 🎯 Core Functionality

- **Smart Recommendations**: Hybrid recommendation system combining local machine learning models with Google Gemini AI
- **Multi-Media Support**: Movies, Web Series, Music, and Books
- **User Authentication**: Secure Firebase authentication with email/password
- **Personal Favorites**: Save and manage your favorite media across all categories
- **Watchlist**: Add items to your watchlist for later viewing
- **Chatbot Assistant**: AI-powered chatbot to help you navigate and find content

### 🤖 Advanced Recommendation Engine

The recommendation system uses a **hybrid approach**:

1. **Local ML Models**: Content-based filtering using similarity matrices
   - 4,806 movies
   - 12,109 web series
   - 5,000 songs
   - 243 books

2. **AI Fallback**: Google Gemini AI provides recommendations when items aren't in the local database

3. **Intelligent Processing**:
   - Processes each favorite individually
   - Requests 5 recommendations per favorite
   - Filters out duplicates and favorites from results
   - Returns 9 unique recommendations per category

### 📊 Data Sources & APIs

- **OMDB API**: Movie and TV show details
- **Spotify API**: Music tracks and albums
- **Google Books API**: Book information
- **Google Gemini AI**: AI-powered recommendations
- **Firebase**: Authentication and database

## 🚀 Getting Started

### Prerequisites

```bash
- Firebase account (for backend)
- API Keys (see Configuration section)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/watcher2105/Media_Mate.git
cd Media_Mate
```

2. **Configure API Keys**

Edit `config.js` and add your API keys:

```javascript
const API_CONFIG = {
    OMDB_API_KEY: 'your_omdb_key',
    SPOTIFY_CLIENT_ID: 'your_spotify_client_id',
    SPOTIFY_CLIENT_SECRET: 'your_spotify_client_secret',
    GEMINI_API_KEY: 'your_gemini_api_key',
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
```

3. **Get API Keys**

- **OMDB**: https://www.omdbapi.com/apikey.aspx
- **Spotify**: https://developer.spotify.com/dashboard
- **Google Gemini**: https://aistudio.google.com/
- **Firebase**: https://console.firebase.google.com/

4. **Run the application**

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000

# Or using Five Server (VS Code extension)
# Right-click on index.html -> "Open with Five Server"
```


## 📁 Project Structure

```
Media_Mate/
├── index.html                      # Landing page
├── login.html                      # Login page
├── signup.html                     # Registration page
├── main.html                       # Main application dashboard
├── profile.html                    # User profile management
├── favourite.html                  # Favorites selection
├── recommendations-movies.html     # Movie recommendations
├── recommendations-series.html     # Web series recommendations
├── recommendations-music.html      # Music recommendations
├── recommendations-books.html      # Book recommendations
├── chatbot.html                   # AI chatbot interface
├── about.html                     # About page
├── config.js                      # API configuration
├── recomandation system/
│   ├── Movie Recommedation/
│   │   ├── movies.json           # Movie dataset (4,806 movies)
│   │   ├── similarity.json       # Similarity matrix
│   │   └── movie-recommender.js  # Movie recommendation engine
│   ├── Webseries Recommendation/
│   │   ├── shows.json            # Web series dataset (12,109 shows)
│   │   ├── shows_similarity.json # Similarity matrix
│   │   └── webseries-recommender.js
│   ├── Music Recomendation/
│   │   ├── data.json             # Music dataset (5,000 songs)
│   │   ├── similarity.json       # Similarity matrix
│   │   └── music-recommender.js
│   └── Book Recomendation/
│       ├── books.json            # Books dataset (243 books)
│       ├── similarity.json       # Similarity matrix
│       └── book-recommender.js
├── Jupyter Files Recomendation system/
│   ├── Movie Recommedation/
│   │   └── Recomandation system content based.ipynb
│   ├── Webseries Recommendation/
│   │   └── Recomandation system content based.ipynb
│   ├── Music Recomendation/
│   │   └── Recomandation system content based.ipynb
│   └── Book Recomendation/
│       └── Recomandation system content based.ipynb
├── README.md                      # This file
├── LICENSE                        # MIT License
└── RECOMMENDATION_INTEGRATION.md  # Integration guide
```

## 🎨 Key Technologies

### Frontend
- **HTML5/CSS3**: Modern, responsive UI
- **JavaScript (ES6+)**: Core application logic
- **Anime.js**: Smooth animations
- **Font Awesome**: Icon library

### Backend & Services
- **Firebase Authentication**: User management
- **Firebase Realtime Database**: Data storage
- **REST APIs**: External data fetching

### Machine Learning
- **Content-Based Filtering**: Similarity matrices
- **Cosine Similarity**: Recommendation scoring
- **Hybrid AI System**: ML + Gemini AI
- **Python/Jupyter**: Data processing and model training
- **Scikit-learn**: Machine learning library for similarity computation

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Enable Realtime Database
4. Update security rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### API Rate Limits

- **OMDB**: 1,000 requests/day (free tier)
- **Spotify**: 10,000 requests/day
- **Google Books**: 1,000 requests/day
- **Gemini AI**: Varies by tier

## 🎯 How It Works

### Recommendation Flow

```
User selects favorites
        ↓
For each favorite:
        ↓
    Try local ML model
        ↓
    Found in database? ──Yes──→ Get 5 similar items
        ↓ No
    Use Gemini AI ──→ Get AI recommendations
        ↓
Combine all recommendations
        ↓
Remove duplicates & favorites
        ↓
Fetch details from APIs (OMDB/Spotify/Books)
        ↓
Display 9 unique recommendations
```

### Hybrid Recommendation Algorithm

```javascript
1. Process each favorite individually
2. Request 5 recommendations per favorite
3. Filter out items that match user's favorites
4. Fetch full details from external APIs
5. Remove duplicates by title (case-insensitive)
6. Limit to 9 final recommendations
7. Display with fallback placeholders for missing images
```

## 📚 Jupyter Notebooks & Dataset Expansion

### About the Jupyter Notebooks

The `Jupyter Files Recomendation system/` folder contains Python notebooks that:
- Load and preprocess media datasets
- Calculate similarity matrices using cosine similarity
- Generate `.pkl` (pickle) files for models
- Convert models to JSON format for web use

### Expanding the Dataset

To increase the dataset and regenerate recommendation models:

#### Prerequisites
```bash
pip install pandas numpy scikit-learn jupyter
```

#### Steps to Expand Dataset

**1. Prepare Your Data**

For **Movies**: Create a CSV with columns: `id`, `original_title`, `overview`, `genre`, `keywords`, `cast`, `crew`

For **Web Series**: CSV with: `id`, `title`, `overview`, `genre`, `cast`, `network`

For **Music**: CSV with: `artist`, `song`, `text` (lyrics)

For **Books**: CSV with: `title`, `author`, `genre`, `description`

**2. Run Jupyter Notebooks**

```bash
# Navigate to the appropriate folder
cd "Jupyter Files Recomendation system/Movie Recommedation"

# Launch Jupyter
jupyter notebook
```

**3. Update Dataset in Notebook**

In each notebook:
- Locate the data loading cell
- Replace the dataset file path with your new CSV
- Run all cells sequentially

**4. Convert PKL to JSON**

Add this cell at the end of each notebook:

```python
import json
import pickle

# Load the pickle files
with open('movies.pkl', 'rb') as f:
    movies = pickle.load(f)
    
with open('similarity.pkl', 'rb') as f:
    similarity = pickle.load(f)

# Convert to JSON-serializable format
movies_json = movies.to_dict('records')  # For pandas DataFrame
similarity_json = similarity.tolist()     # For numpy array

# Save as JSON
with open('../../recomandation system/Movie Recommedation/movies.json', 'w') as f:
    json.dump(movies_json, f)
    
with open('../../recomandation system/Movie Recommedation/similarity.json', 'w') as f:
    json.dump(similarity_json, f)

print("Successfully converted PKL to JSON!")
```

**5. Verify the Output**

Check that the JSON files are created in the `recomandation system/` folder:
- `movies.json` or `shows.json` or `data.json` or `books.json`
- `similarity.json` or `shows_similarity.json`

**6. Restart the Application**

Reload the web app to use the new expanded dataset.

### Dataset Size Recommendations

- **Minimum**: 100 items per category
- **Optimal**: 1,000 - 10,000 items
- **Maximum**: Limited by browser memory (~50MB JSON)

### Performance Considerations

- Larger datasets = longer initial load time
- Similarity matrices grow exponentially (N×N)
- Consider splitting very large datasets into chunks
- Use lazy loading for datasets > 10,000 items

## 🐛 Troubleshooting

### Common Issues

**1. API Key Errors (401 Unauthorized)**
- Solution: Update your API keys in `config.js`
- OMDB keys expire - get a new one from omdbapi.com

**2. Images Not Loading (404 errors)**
- Automatic fallback to placeholder images is implemented
- Check browser console for CORS issues

**3. Recommendations Not Showing**
- Ensure you've added favorites
- Check browser console for API errors
- Verify Firebase connection

**4. Browser Cache Issues**
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Open in incognito/private mode

**5. CORS Errors**
- Multi-tier proxy fallback is implemented
- Check if external APIs are accessible

## 📊 Performance

- **Initial Load**: ~2-3 seconds
- **Recommendation Generation**: ~3-5 seconds
- **API Fetch Time**: ~1-2 seconds per item
- **Total Dataset Size**: ~30MB (JSON files)

## 🔒 Security

- Firebase Authentication for user management
- Secure API key storage (move to backend in production)
- Input sanitization to prevent XSS
- HTTPS recommended for production deployment

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means

✅ **You CAN**:
- Use this project for personal or commercial purposes
- Modify and distribute the code
- Use it in private projects
- Sublicense the code

❌ **You CANNOT**:
- Hold the authors liable for damages
- Use the authors' names for endorsement

📋 **You MUST**:
- Include the original copyright notice
- Include the license text in distributions

### Third-Party Licenses

This project uses external APIs and services:
- **OMDB API**: Subject to OMDB terms of service
- **Spotify API**: Subject to Spotify Developer terms
- **Google Books API**: Subject to Google API terms
- **Google Gemini AI**: Subject to Google AI terms
- **Firebase**: Subject to Google Firebase terms

Please review each service's terms before deployment.