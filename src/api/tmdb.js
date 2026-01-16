import { TMDB_API_KEY, TMDB_BASE_URL } from '../config';
import { MOCK_MOVIES, MOCK_TRENDING } from './mockData';

const fetchFromTMDB = async (endpoint, params = {}) => {
    // Check if API key is still the placeholder or empty
    if (!TMDB_API_KEY) {
        console.warn("Using Mock Data: TMDB API Key not provided.");
        return handleMockRequest(endpoint, params);
    }

    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        ...params,
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('TMDB Fetch Error, falling back to mock data:', error);
        return handleMockRequest(endpoint, params);
    }
};

const handleMockRequest = (endpoint, params) => {
    if (endpoint.includes('/trending')) {
        return MOCK_TRENDING;
    }
    if (endpoint.includes('/search')) {
        const query = params.query?.toLowerCase() || '';
        const results = MOCK_MOVIES.filter(m =>
            m.title.toLowerCase().includes(query) ||
            m.overview.toLowerCase().includes(query)
        );
        return { results };
    }
    if (endpoint.includes('/movie/')) {
        const idStr = endpoint.split('/').pop();
        const id = parseInt(idStr.split('?')[0]);
        const movie = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
        return movie;
    }
    return { results: MOCK_MOVIES };
};

export const movieService = {
    getTrending: (page = 1) => fetchFromTMDB('/trending/movie/day', { page }),
    searchMovies: (query, page = 1) => fetchFromTMDB('/search/movie', { query, page }),
    getMovieDetails: (id) => fetchFromTMDB(`/movie/${id}`, { append_to_response: 'videos,credits' }),
    getPopular: (page = 1) => fetchFromTMDB('/movie/popular', { page }),
};
