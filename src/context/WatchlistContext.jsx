import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const { user } = useAuth();

    // auto loads user
    useEffect(() => {
        const fetchWatchlist = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch(`http://localhost:5000/watchlist?userId=${user.id}`);
                    const data = await response.json();
                    setWatchlist(data);
                } catch (error) {
                    console.error('Error fetching watchlist:', error);
                }
            } else {
                setWatchlist([]);
            }
        };
        fetchWatchlist();
    }, [user]); // da

    // add
    const addToWatchlist = async (movie) => {
        if (!user) return;

        if (!watchlist.find(m => m.movieId === movie.id)) {
            const movieWithUser = {
                ...movie,
                movieId: movie.id,
                userId: user.id,
                personalRating: 0,
                note: ''
            };
            delete movieWithUser.id;

            try {
                const response = await fetch('http://localhost:5000/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(movieWithUser)
                });
                const savedMovie = await response.json();
                setWatchlist([...watchlist, savedMovie]);
            } catch (error) {
                console.error('Error adding to watchlist:', error);
            }
        }
    };


    // remove
    const removeFromWatchlist = async (identifier) => {
        if (!user) return;

        const item = watchlist.find(m => m.id === identifier || m.movieId === identifier);

        if (item) {
            try {
                const response = await fetch(`http://localhost:5000/watchlist/${item.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setWatchlist(watchlist.filter(m => m.id !== item.id));
                }
            } catch (error) {
                console.error('Error removing from watchlist:', error);
            }
        }
    };

    // update
    const updateMovieData = async (identifier, data) => {
        if (!user) return;
        // Find by database id OR tmdbId
        const item = watchlist.find(m => m.id === identifier || m.movieId === identifier);

        if (item) {
            try {
                const response = await fetch(`http://localhost:5000/watchlist/${item.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const updatedItem = await response.json();
                setWatchlist(watchlist.map(m => m.id === item.id ? updatedItem : m));
            } catch (error) {
                console.error('Error updating movie data:', error);
            }
        }
    };

    const isInWatchlist = (tmdbId) => {
        return watchlist.some(m => m.movieId === tmdbId || m.id === tmdbId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, updateMovieData, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};
