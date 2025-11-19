// Movie Recommendation Module
// This module loads the movies and similarity data and provides recommendations

class MovieRecommender {
    constructor() {
        this.movies = [];
        this.similarity = [];
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) {
            return;
        }

        try {
            // Load movies and similarity data
            const [moviesRes, similarityRes] = await Promise.all([
                fetch('recomandation system/Movie Recommedation/movies.json'),
                fetch('recomandation system/Movie Recommedation/similarity.json')
            ]);

            this.movies = await moviesRes.json();
            this.similarity = await similarityRes.json();
            this.loaded = true;
            
            console.log(`Loaded ${this.movies.length} movies for recommendation`);
        } catch (error) {
            console.error('Error loading recommendation data:', error);
            throw error;
        }
    }

    /**
     * Find the index of a movie by its title
     * @param {string} movieTitle - The title to search for
     * @returns {number|null} - The index or null if not found
     */
    getMovieIndex(movieTitle) {
        const normalizedTitle = movieTitle.toLowerCase().trim();
        
        for (let idx = 0; idx < this.movies.length; idx++) {
            const movie = this.movies[idx];
            if (movie.original_title.toLowerCase().trim() === normalizedTitle) {
                return idx;
            }
        }
        return null;
    }

    /**
     * Get recommendations based on multiple favorite movies
     * @param {Array<string>} favoriteMovies - Array of movie titles user likes
     * @param {number} numRecommendations - Number of recommendations to return
     * @returns {Array<Object>} - Array of recommended movies with details
     */
    recommend(favoriteMovies, numRecommendations = 9) {
        if (!this.loaded) {
            console.error('Recommendation data not loaded yet');
            return [];
        }

        if (!favoriteMovies || favoriteMovies.length === 0) {
            return [];
        }

        // Get indices of favorite movies
        const favoriteIndices = [];
        for (const title of favoriteMovies) {
            const idx = this.getMovieIndex(title);
            if (idx !== null) {
                favoriteIndices.push(idx);
            } else {
                console.warn(`Movie not found in database: ${title}`);
            }
        }

        if (favoriteIndices.length === 0) {
            console.warn('None of the favorite movies were found in the database');
            return [];
        }

        // Aggregate similarity scores
        const aggregatedScores = new Array(this.movies.length).fill(0);
        
        for (const favIdx of favoriteIndices) {
            const distances = this.similarity[favIdx];
            for (let i = 0; i < distances.length; i++) {
                aggregatedScores[i] += distances[i];
            }
        }

        // Average the scores
        for (let i = 0; i < aggregatedScores.length; i++) {
            aggregatedScores[i] /= favoriteIndices.length;
        }

        // Create list of (index, score) tuples, excluding favorite movies
        const indexedScores = [];
        for (let idx = 0; idx < aggregatedScores.length; idx++) {
            if (!favoriteIndices.includes(idx)) {
                indexedScores.push({ idx, score: aggregatedScores[idx] });
            }
        }

        // Sort by score in descending order
        indexedScores.sort((a, b) => b.score - a.score);

        // Get top N recommendations
        const recommendations = [];
        for (let i = 0; i < Math.min(numRecommendations, indexedScores.length); i++) {
            const { idx, score } = indexedScores[i];
            const movie = this.movies[idx];
            recommendations.push({
                title: movie.original_title,
                id: movie.id,
                score: score
            });
        }

        console.log(`Generated ${recommendations.length} recommendations from ${favoriteIndices.length} favorite movies`);
        return recommendations;
    }

    /**
     * Get recommendations with details (without OMDB calls to avoid CORS)
     * @param {Array<string>} favoriteMovies - Array of movie titles user likes
     * @param {number} numRecommendations - Number of recommendations to return
     * @returns {Array<Object>} - Array of recommended movies with basic details
     */
    getRecommendationsWithDetails(favoriteMovies, numRecommendations = 9) {
        const recommendations = this.recommend(favoriteMovies, numRecommendations);
        
        if (recommendations.length === 0) {
            return [];
        }

        // Return recommendations with basic details from our database
        // We'll let the main.html fetchMovies function handle getting full details
        const detailedRecommendations = recommendations.map((rec) => {
            return {
                Title: rec.title,
                Poster: `https://placehold.co/300x450/1a1a2e/ffffff?text=${encodeURIComponent(rec.title)}`, // Placeholder
                id: rec.id,
                imdbID: rec.id,
                score: rec.score,
                Year: 'N/A',
                Type: 'movie'
            };
        });

        console.log(`Returning ${detailedRecommendations.length} recommendations with basic details`);
        return detailedRecommendations;
    }
}

// Create a singleton instance
const movieRecommender = new MovieRecommender();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = movieRecommender;
}
