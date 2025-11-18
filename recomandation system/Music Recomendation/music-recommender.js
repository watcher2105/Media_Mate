// Music Recommendation Module
// This module loads the songs and similarity data and provides recommendations

class MusicRecommender {
    constructor() {
        this.songs = [];
        this.similarity = [];
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) {
            return;
        }

        try {
            // Load songs and similarity data
            const [songsRes, similarityRes] = await Promise.all([
                fetch('recomandation system/Music Recomendation/data.json'),
                fetch('recomandation system/Music Recomendation/similarity.json')
            ]);

            this.songs = await songsRes.json();
            this.similarity = await similarityRes.json();
            this.loaded = true;
            
            console.log(`Loaded ${this.songs.length} songs for recommendation`);
        } catch (error) {
            console.error('Error loading music recommendation data:', error);
            throw error;
        }
    }

    /**
     * Find the index of a song by artist and song name
     * @param {string} searchString - Either "Artist - Song" or just song name
     * @returns {number|null} - The index or null if not found
     */
    getSongIndex(searchString) {
        const normalized = searchString.toLowerCase().trim();
        
        for (let idx = 0; idx < this.songs.length; idx++) {
            const song = this.songs[idx];
            const fullName = `${song.artist} - ${song.song}`.toLowerCase().trim();
            const songOnly = song.song.toLowerCase().trim();
            const artistOnly = song.artist.toLowerCase().trim();
            
            if (fullName === normalized || songOnly === normalized || 
                normalized.includes(songOnly) || normalized.includes(artistOnly)) {
                return idx;
            }
        }
        return null;
    }

    /**
     * Get recommendations based on multiple favorite songs
     * @param {Array<string>} favoriteSongs - Array of song names user likes
     * @param {number} numRecommendations - Number of recommendations to return
     * @returns {Array<Object>} - Array of recommended songs with details
     */
    recommend(favoriteSongs, numRecommendations = 9) {
        if (!this.loaded) {
            console.error('Music recommendation data not loaded yet');
            return [];
        }

        // Initialize scores for all songs
        const scores = new Array(this.songs.length).fill(0);
        let foundCount = 0;

        // Aggregate similarity scores from all favorite songs
        for (const songName of favoriteSongs) {
            const idx = this.getSongIndex(songName);
            
            if (idx !== null) {
                foundCount++;
                // Add similarity scores from this favorite song
                for (let i = 0; i < this.similarity[idx].length; i++) {
                    scores[i] += this.similarity[idx][i];
                }
            } else {
                console.warn(`Song not found in database: ${songName}`);
            }
        }

        if (foundCount === 0) {
            console.warn('None of the favorite songs were found in the database');
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

        // Get indices of favorite songs to exclude them
        const favoriteIndices = new Set();
        for (const songName of favoriteSongs) {
            const idx = this.getSongIndex(songName);
            if (idx !== null) {
                favoriteIndices.add(idx);
            }
        }

        // Get top recommendations (excluding favorite songs)
        const recommendations = [];
        for (const item of indexedScores) {
            if (!favoriteIndices.has(item.idx)) {
                recommendations.push({
                    artist: this.songs[item.idx].artist,
                    song: this.songs[item.idx].song,
                    title: `${this.songs[item.idx].artist} - ${this.songs[item.idx].song}`,
                    score: item.score,
                    id: item.idx
                });
                
                if (recommendations.length >= numRecommendations) {
                    break;
                }
            }
        }

        console.log(`Generated ${recommendations.length} music recommendations from ${foundCount} favorite songs`);
        return recommendations;
    }

    /**
     * Get recommendations with basic details
     * @param {Array<string>} favoriteSongs - Array of song names
     * @param {number} numRecommendations - Number of recommendations
     * @returns {Array<Object>} - Recommendations with Title, Poster placeholder, etc.
     */
    getRecommendationsWithDetails(favoriteSongs, numRecommendations = 9) {
        const recommendations = this.recommend(favoriteSongs, numRecommendations);
        
        const results = recommendations.map(rec => ({
            Title: rec.title,
            Artist: rec.artist,
            Song: rec.song,
            Poster: `https://placehold.co/300x450/1a1a2e/ffffff?text=${encodeURIComponent(rec.artist)}`,
            Year: 'N/A',
            Type: 'music',
            Plot: 'Recommended based on your favorites',
            id: rec.id,
            score: rec.score
        }));

        console.log(`Returning ${results.length} music recommendations with basic details`);
        return results;
    }
}

// Create global instance
const musicRecommender = new MusicRecommender();
