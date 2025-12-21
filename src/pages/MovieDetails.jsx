import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner, Image } from 'react-bootstrap';
import { Star, Clock, Calendar, ChevronLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { movieService } from '../api/tmdb';
import { TMDB_BACKDROP_BASE_URL, TMDB_IMAGE_BASE_URL } from '../config';
import { useWatchlist } from '../context/WatchlistContext';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await movieService.getMovieDetails(id);
                setMovie(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load movie details.");
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error || !movie) return (
        <Container className="py-5 text-center">
            <div className="alert alert-danger">{error || "Movie not found."}</div>
            <Button variant="primary" onClick={() => navigate('/')}>Go Back</Button>
        </Container>
    );

    const isAdded = isInWatchlist(movie.id);

    const bannerStyle = {
        height: '60vh',
        backgroundImage: `linear-gradient(to top, var(--movie-bg), transparent), url(${movie.backdrop_path?.startsWith('http') ? movie.backdrop_path : TMDB_BACKDROP_BASE_URL + movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const posterSrc = movie.poster_path?.startsWith('http')
        ? movie.poster_path
        : `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`;

    return (
        <div className="movie-details-page">
            {/* Backdrop Section */}
            <div className="position-relative w-100" style={bannerStyle}>
                <Container className="h-100 position-relative">
                    <Button
                        variant="link"
                        className="position-absolute top-0 start-0 mt-4 text-white text-decoration-none d-flex align-items-center gap-2 bg-dark bg-opacity-50 rounded-pill px-3 py-2"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft size={20} /> Back
                    </Button>
                </Container>
            </div>

            <Container className="mt-n5 position-relative z-index-2 pb-5" style={{ marginTop: '-200px' }}>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Row className="g-4 g-lg-5">
                            <Col md={4} lg={3}>
                                <Image
                                    src={posterSrc}
                                    fluid
                                    rounded-4
                                    className="shadow-lg border border-secondary"
                                    alt={movie.title}
                                />
                            </Col>
                            <Col md={8} lg={9}>
                                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                                    <h1 className="display-5 fw-bold mb-0">{movie.title}</h1>
                                    <Badge bg="primary" className="p-2 rounded-pill fs-6">
                                        {movie.status}
                                    </Badge>
                                </div>

                                <div className="d-flex flex-wrap gap-4 text-muted mb-4 fs-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <Star size={18} className="text-warning" fill="currentColor" />
                                        <span className="text-white fw-bold">{movie.vote_average?.toFixed(1)}</span>
                                        <span>/ 10</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Clock size={18} />
                                        <span>{movie.runtime} min</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{movie.release_date}</span>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {movie.genres?.map(genre => (
                                        <Badge key={genre.id} bg="dark" className="border border-secondary px-3 py-2 fw-normal fs-6">
                                            {genre.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="mb-5">
                                    <h3 className="h4 fw-bold mb-3">Overview</h3>
                                    <p className="lead text-muted fs-5">{movie.overview}</p>
                                </div>

                                <div className="d-flex gap-3">
                                    <Button
                                        variant={isAdded ? "outline-danger" : "primary"}
                                        size="lg"
                                        className="rounded-pill px-4 d-flex align-items-center gap-2 fw-bold"
                                        onClick={() => isAdded ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                                    >
                                        {isAdded ? (
                                            <><BookmarkCheck size={24} /> Remove from Watchlist</>
                                        ) : (
                                            <><Bookmark size={24} /> Add to Watchlist</>
                                        )}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MovieDetails;
