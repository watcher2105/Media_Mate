# Media-Mate Recommendation System Integration

## Overview
Successfully integrated local machine learning recommendation models for all four media types:
- **Movies** - 4,806 movies with pre-computed similarity matrix
- **Webseries** - Web series with similarity-based recommendations  
- **Music** - Song recommendations based on artist and track similarity
- **Books** - Book recommendations using content-based filtering

## Implementation

### Created Files

1. **webseries-recommender.js** (`recomandation system/Webseries Recommendation/`)
   - `WebseriesRecommender` class
   - Loads `shows.json` and `shows_similarity.json`
   - Methods: `loadData()`, `getShowIndex()`, `recommend()`, `getRecommendationsWithDetails()`
   - Global instance: `webseriesRecommender`

2. **music-recommender.js** (`recomandation system/Music Recomendation/`)
   - `MusicRecommender` class
   - Loads `data.json` and `similarity.json`
   - Supports search by "Artist - Song" or song name only
   - Methods: `loadData()`, `getSongIndex()`, `recommend()`, `getRecommendationsWithDetails()`
   - Global instance: `musicRecommender`

3. **book-recommender.js** (`recomandation system/Book Recomendation/`)
   - `BookRecommender` class
   - Loads `books.json` and `similarity.json`
   - Methods: `loadData()`, `getBookIndex()`, `recommend()`, `getRecommendationsWithDetails()`
   - Global instance: `bookRecommender`

### Modified Files

**main.html**
- Added script tags for all three new recommender modules (lines 676-678)
- Updated `loadInitialRecommendations()` function:
  - Loads all 4 models in parallel using `Promise.all()`
  - Gets recommendations from each model based on user's Firebase favorites
  - Fetches OMDB details for movies and webseries (real posters and metadata)
  - Uses placeholder data for music and books (can be enhanced with Spotify/Google Books APIs later)
  - Each media type processed independently - if one fails, others still work

## How It Works

### Flow for Each Media Type

1. **User Login** → Firebase retrieves user's favorite items
2. **Model Loading** → All 4 recommendation models load in parallel
3. **Generate Recommendations**:
   - Movies: Model generates 9 movie titles → OMDB fetches posters/details
   - Webseries: Model generates 9 show titles → OMDB fetches posters/details  
   - Music: Model generates 9 songs → Uses placeholder images (Artist name)
   - Books: Model generates 9 books → Uses placeholder images (Book title)
4. **Display** → Recommendations shown in respective sections with cards

### Algorithm

All recommenders use **content-based filtering**:
- Pre-computed similarity matrix between all items
- Aggregates similarity scores from multiple user favorites
- Ranks all items by similarity score
- Returns top N recommendations (excluding user's favorites)

### API Integration

- **OMDB API** (6c6fb997): Fetches real posters, plots, years for movies and webseries
- **Placeholder Service** (placehold.co): Generates fallback images if OMDB fails
- **Firebase Realtime Database**: Stores user favorites at `users/{uid}/favourites/{movies|series|music|books}`

## Error Handling

- Each media type has independent error handling
- If model loading fails for one type, others continue working
- If OMDB fetch fails, shows placeholder image instead
- Warnings logged to console for debugging (e.g., "Movie not found in database")
- Empty arrays returned if no favorites match database entries

## Console Output

Successful load shows:
```
Loading recommendation models...
Loaded 4806 movies for recommendation
Loaded X shows for recommendation
Loaded X songs for recommendation
Loaded X books for recommendation
Model-based movie recommendations: (9) [{...}, ...]
Movie recommendations with OMDB data: 9 movies
Model-based webseries recommendations: (9) [{...}, ...]
Webseries recommendations with OMDB data: 9 shows
Model-based music recommendations: (9) [{...}, ...]
Music recommendations ready: 9 songs
Model-based book recommendations: (9) [{...}, ...]
Book recommendations ready: 9 books
```

## Future Enhancements

1. **Music**: Integrate Spotify API for real album covers
2. **Books**: Integrate Google Books API for book covers and descriptions
3. **Caching**: Store recommendations in localStorage to avoid recomputing
4. **Hybrid Recommendations**: Combine content-based + collaborative filtering
5. **Real-time Updates**: Refresh recommendations when user adds new favorites

## Testing

To test:
1. Sign up with 2-3 favorite items per media type
2. Login and navigate to main.html
3. Check console for successful model loading
4. View recommendations in each media section
5. Verify OMDB posters load for movies/webseries

## Data Files

All recommendation systems use:
- **JSON data file**: List of items with titles/metadata
- **Similarity JSON**: Pre-computed cosine similarity matrix
- Both files must be in the same folder as the recommender script
