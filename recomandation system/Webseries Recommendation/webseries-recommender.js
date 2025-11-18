// Webseries Recommendation Module
// This module loads the shows and similarity data and provides recommendations

class WebseriesRecommender {
    constructor() {
        this.shows = [];
        this.similarity = [];
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) {
            return;
        }

        try {
            // Load shows and similarity data
            const [showsRes, similarityRes] = await Promise.all([
                fetch('recomandation system/Webseries Recommendation/shows.json'),
                fetch('recomandation system/Webseries Recommendation/shows_similarity.json')
            ]);

            this.shows = await showsRes.json();
            this.similarity = await similarityRes.json();
            this.loaded = true;
            
            console.log(`Loaded ${this.shows.length} shows for recommendation`);
        } catch (error) {
            console.error('Error loading webseries recommendation data:', error);
            throw error;
        }
    }

    /**
     * Find the index of a show by its title
     * @param {string} showTitle - The title to search for
     * @returns {number|null} - The index or null if not found
     */
    getShowIndex(showTitle) {
        const normalizedTitle = showTitle.toLowerCase().trim();
        
        for (let idx = 0; idx < this.shows.length; idx++) {
            const show = this.shows[idx];
            if (show.title.toLowerCase().trim() === normalizedTitle) {
                return idx;
            }
        }
        return null;
    }

    /**
     * Get recommendations based on multiple favorite shows
     * @param {Array<string>} favoriteShows - Array of show titles user likes
     * @param {number} numRecommendations - Number of recommendations to return
     * @returns {Array<Object>} - Array of recommended shows with details
     */
    recommend(favoriteShows, numRecommendations = 9) {
        if (!this.loaded) {
            console.error('Webseries recommendation data not loaded yet');
            return [];
        }

        // Initialize scores for all shows
        const scores = new Array(this.shows.length).fill(0);
        let foundCount = 0;

        // Aggregate similarity scores from all favorite shows
        for (const showTitle of favoriteShows) {
            const idx = this.getShowIndex(showTitle);
            
            if (idx !== null) {
                foundCount++;
                // Add similarity scores from this favorite show
                for (let i = 0; i < this.similarity[idx].length; i++) {
                    scores[i] += this.similarity[idx][i];
                }
            } else {
                console.warn(`Show not found in database: ${showTitle}`);
            }
        }

        if (foundCount === 0) {
            console.warn('None of the favorite shows were found in the database');
            return [];
        }

        // Average the scores
        for (let i = 0; i < scores.length; i++) {
            scores[i] /= foundCount;
        }

        // Create array of [index, score] pairs
        const indexedScores = scores.map((score, idx) => ({ idx, score }));

        // Sort by score descending
        indexedScores.sort((a, b) => b.score - a.score);

        // Get indices of favorite shows to exclude them
        const favoriteIndices = new Set();
        for (const showTitle of favoriteShows) {
            const idx = this.getShowIndex(showTitle);
            if (idx !== null) {
                favoriteIndices.add(idx);
            }
        }

        // Get top recommendations (excluding favorite shows)
        const recommendations = [];
        for (const item of indexedScores) {
            if (!favoriteIndices.has(item.idx)) {
                recommendations.push({
                    title: this.shows[item.idx].title,
                    score: item.score,
                    id: item.idx
                });
                
                if (recommendations.length >= numRecommendations) {
                    break;
                }
            }
        }

        console.log(`Generated ${recommendations.length} recommendations from ${foundCount} favorite shows`);
        return recommendations;
    }

    /**
     * Get recommendations with basic details
     * @param {Array<string>} favoriteShows - Array of show titles
     * @param {number} numRecommendations - Number of recommendations
     * @returns {Array<Object>} - Recommendations with Title, Poster placeholder, etc.
     */
    getRecommendationsWithDetails(favoriteShows, numRecommendations = 9) {
        const recommendations = this.recommend(favoriteShows, numRecommendations);
        
        const results = recommendations.map(rec => ({
            Title: rec.title,
            Poster: `https://placehold.co/300x450/1a1a2e/ffffff?text=${encodeURIComponent(rec.title)}`,
            Year: 'N/A',
            Type: 'series',
            Plot: 'Recommended based on your favorites',
            imdbID: `show_${rec.id}`,
            id: rec.id,
            score: rec.score
        }));

        console.log(`Returning ${results.length} recommendations with basic details`);
        return results;
    }
}

// Create global instance
const webseriesRecommender = new WebseriesRecommender();
