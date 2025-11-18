// Book Recommendation Module
// This module loads the books and similarity data and provides recommendations

class BookRecommender {
    constructor() {
        this.books = [];
        this.similarity = [];
        this.loaded = false;
    }

    async loadData() {
        if (this.loaded) {
            return;
        }

        try {
            // Load books and similarity data
            const [booksRes, similarityRes] = await Promise.all([
                fetch('recomandation system/Book Recomendation/books.json'),
                fetch('recomandation system/Book Recomendation/similarity.json')
            ]);

            this.books = await booksRes.json();
            this.similarity = await similarityRes.json();
            this.loaded = true;
            
            console.log(`Loaded ${this.books.length} books for recommendation`);
        } catch (error) {
            console.error('Error loading book recommendation data:', error);
            throw error;
        }
    }

    /**
     * Find the index of a book by its title
     * @param {string} bookTitle - The title to search for
     * @returns {number|null} - The index or null if not found
     */
    getBookIndex(bookTitle) {
        const normalizedTitle = bookTitle.toLowerCase().trim();
        
        for (let idx = 0; idx < this.books.length; idx++) {
            const book = this.books[idx];
            if (book.title.toLowerCase().trim() === normalizedTitle) {
                return idx;
            }
        }
        return null;
    }

    /**
     * Get recommendations based on multiple favorite books
     * @param {Array<string>} favoriteBooks - Array of book titles user likes
     * @param {number} numRecommendations - Number of recommendations to return
     * @returns {Array<Object>} - Array of recommended books with details
     */
    recommend(favoriteBooks, numRecommendations = 9) {
        if (!this.loaded) {
            console.error('Book recommendation data not loaded yet');
            return [];
        }

        // Initialize scores for all books
        const scores = new Array(this.books.length).fill(0);
        let foundCount = 0;

        // Aggregate similarity scores from all favorite books
        for (const bookTitle of favoriteBooks) {
            const idx = this.getBookIndex(bookTitle);
            
            if (idx !== null) {
                foundCount++;
                // Add similarity scores from this favorite book
                for (let i = 0; i < this.similarity[idx].length; i++) {
                    scores[i] += this.similarity[idx][i];
                }
            } else {
                console.warn(`Book not found in database: ${bookTitle}`);
            }
        }

        if (foundCount === 0) {
            console.warn('None of the favorite books were found in the database');
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

        // Get indices of favorite books to exclude them
        const favoriteIndices = new Set();
        for (const bookTitle of favoriteBooks) {
            const idx = this.getBookIndex(bookTitle);
            if (idx !== null) {
                favoriteIndices.add(idx);
            }
        }

        // Get top recommendations (excluding favorite books)
        const recommendations = [];
        for (const item of indexedScores) {
            if (!favoriteIndices.has(item.idx)) {
                recommendations.push({
                    title: this.books[item.idx].title,
                    score: item.score,
                    id: item.idx
                });
                
                if (recommendations.length >= numRecommendations) {
                    break;
                }
            }
        }

        console.log(`Generated ${recommendations.length} recommendations from ${foundCount} favorite books`);
        return recommendations;
    }

    /**
     * Get recommendations with basic details
     * @param {Array<string>} favoriteBooks - Array of book titles
     * @param {number} numRecommendations - Number of recommendations
     * @returns {Array<Object>} - Recommendations with Title, Poster placeholder, etc.
     */
    getRecommendationsWithDetails(favoriteBooks, numRecommendations = 9) {
        const recommendations = this.recommend(favoriteBooks, numRecommendations);
        
        const results = recommendations.map(rec => ({
            Title: rec.title,
            Poster: `https://placehold.co/300x450/1a1a2e/ffffff?text=${encodeURIComponent(rec.title)}`,
            Year: 'N/A',
            Type: 'book',
            Plot: 'Recommended based on your favorites',
            id: rec.id,
            score: rec.score
        }));

        console.log(`Returning ${results.length} recommendations with basic details`);
        return results;
    }
}

// Create global instance
const bookRecommender = new BookRecommender();
