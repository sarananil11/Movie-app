import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { movieService } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            setLoading(true);
            const data = await movieService.getTrending();
            setMovies(data.results);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch movies. Please check your API key.");
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            setLoading(true);
            try {
                const data = await movieService.searchMovies(value);
                setMovies(data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else if (value.length === 0) {
            fetchTrending();
        }
    };

    return (
        <div>
            <section className="hero-section text-center">
                <Container>
                    <h1 className="display-3 fw-bold mb-4">
                        Connect with <span className="text-danger">Cinema</span>
                    </h1>
                    <p className="lead text-muted max-w-2xl mx-auto mb-5">
                        Discover millions of movies, TV shows and people. Explore now and add to your personal watchlist.
                    </p>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <InputGroup size="lg" className="shadow-lg rounded-pill overflow-hidden border-0">
                                <InputGroup.Text className="bg-white border-0 ps-4">
                                    <Search className="text-muted" size={24} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search for a movie..."
                                    className="border-0 py-3 ps-2 fst-italic shadow-none"
                                    value={query}
                                    onChange={handleSearch}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                <h2 className="mb-4 fw-bold">{query ? `Results for "${query}"` : "Trending Movies"}</h2>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" variant="danger" />
                    </div>
                ) : error ? (
                    <div className="alert alert-danger bg-danger bg-opacity-10 border-danger text-danger rounded-4 py-4 text-center">
                        {error}
                    </div>
                ) : (
                    <div className="movie-grid">
                        {movies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                        {movies.length === 0 && (
                            <div className="w-100 text-center py-5 text-muted">
                                No movies found. Try another search.
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Home;
