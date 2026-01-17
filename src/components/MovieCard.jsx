import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { TMDB_IMAGE_BASE_URL } from '../config';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';


const MovieCard = ({ movie }) => {
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { user } = useAuth();
    const isAdded = isInWatchlist(movie.id);

    const toggleWatchlist = (e) => {
        e.preventDefault();

        // Login 
        if (!user) {
            alert("Please login to manage your watchlist.");
            return;
        }
        
        if (isAdded) {  //line 13
            removeFromWatchlist(movie.id);
            alert("Removed from watchlist")
            console.log("Removed from watchlist")
        } else {
            addToWatchlist(movie);
            alert("Added to watchlist")
            console.log("Added from watchlist")
        }
    };


    
    // poster image
    const posterPath = movie.poster_path
        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`)
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <Card as={Link} to={`/movie/${movie.id}`} className="h-100 text-decoration-none shadow-sm position-relative">
            <div className="position-absolute top-0 end-0 p-2 z-index-1">
                <Button
                    variant={isAdded ? "success" : "light"}
                    className="rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center"
                    onClick={toggleWatchlist}
                    style={{ width: '40px', height: '40px', opacity: 0.9 }}
                >
                    {isAdded ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </Button>
            </div>

            <Card.Img variant="top" src={posterPath} alt={movie.title} />

            <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 mb-2 text-truncate" title={movie.title}>
                    {movie.title}
                </Card.Title>
                <div className="mt-auto d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={20} fill="currentColor" />
                        <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <Badge bg="secondary" className="fw-normal bg-opacity-25 text-muted small">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'TBA'}
                    </Badge>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;
