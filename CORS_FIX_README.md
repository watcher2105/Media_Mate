# CORS Error Fix - OMDB API

## Problem
Your application was experiencing CORS (Cross-Origin Resource Sharing) errors when trying to fetch data from the OMDB API. The error occurred because:

1. Your local server runs on `http://127.0.0.1:5500`
2. OMDB API is hosted on `https://www.omdbapi.com`
3. OMDB API doesn't send the `Access-Control-Allow-Origin` header for your origin
4. Browsers block these cross-origin requests by default for security

## Solution Implemented

I've added a **CORS proxy fallback mechanism** to all your HTML files that use the OMDB API:

### Files Modified:
- `main.html`
- `index.html`
- `recommendations-movies.html`
- `recommendations-series.html`
- `favourite.html`

### How It Works:

```javascript
const fetchWithProxy = async (url) => {
    try {
        // Try direct fetch first
        const response = await fetch(url);
        if (!response.ok) throw new Error('Direct fetch failed');
        return await response.json();
    } catch (error) {
        // Fallback to CORS proxy
        console.log('Using CORS proxy for:', url);
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        return await response.json();
    }
};
```

This function:
1. **First attempts** a direct fetch to OMDB API
2. **If that fails** (CORS error), it automatically uses a CORS proxy service
3. The proxy service (`api.allorigins.win`) fetches the data on the server-side (where CORS doesn't apply) and returns it to your app

### Alternative Solutions (Not Implemented)

If you want to explore other options:

1. **Backend Proxy** (Best for production)
   - Create your own server endpoint that fetches OMDB data
   - Your frontend calls your backend, which calls OMDB
   - No CORS issues since the request happens server-to-server

2. **JSONP** (If supported by API)
   - Some APIs support JSONP which bypasses CORS
   - OMDB doesn't fully support this

3. **Browser Extension**
   - Only for development
   - Extensions like "CORS Unblock" can disable CORS in browser
   - Not a real solution for production

## Testing
Your application should now work without CORS errors. If the direct OMDB fetch fails, you'll see "Using CORS proxy for:" messages in the console, which is normal and expected.

## Note
The CORS proxy service (`api.allorigins.win`) is a free public service. For production:
- Consider setting up your own backend proxy
- Or use a paid CORS proxy service with better reliability
- Monitor the proxy service's rate limits and uptime
