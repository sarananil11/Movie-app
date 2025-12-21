import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const storedWatchlist = localStorage.getItem('movie_app_watchlist');
        if (storedWatchlist) {
            setWatchlist(JSON.parse(storedWatchlist));
        }
    }, []);

    const saveToLocalStorage = (list) => {
        localStorage.setItem('movie_app_watchlist', JSON.stringify(list));
    };

    const addToWatchlist = (movie) => {
        if (!watchlist.find(m => m.id === movie.id)) {
            const newList = [...watchlist, { ...movie, personalRating: 0, note: '' }];
            setWatchlist(newList);
            saveToLocalStorage(newList);
        }
    };

    const removeFromWatchlist = (movieId) => {
        const newList = watchlist.filter(m => m.id !== movieId);
        setWatchlist(newList);
        saveToLocalStorage(newList);
    };

    const updateMovieData = (movieId, data) => {
        const newList = watchlist.map(m =>
            m.id === movieId ? { ...m, ...data } : m
        );
        setWatchlist(newList);
        saveToLocalStorage(newList);
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some(m => m.id === movieId);
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
