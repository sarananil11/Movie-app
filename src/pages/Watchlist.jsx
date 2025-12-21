import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { Star, Trash2, Edit3, MessageCircle, Popcorn } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { TMDB_IMAGE_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const Watchlist = () => {
    const { watchlist, removeFromWatchlist, updateMovieData } = useWatchlist();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ personalRating: 0, note: '' });

    const handleEditOpen = (movie) => {
        setSelectedMovie(movie);
        setEditData({ personalRating: movie.personalRating || 0, note: movie.note || '' });
        setShowModal(true);
    };

    const handleSave = () => {
        updateMovieData(selectedMovie.id, editData);
        setShowModal(false);
    };

    if (watchlist.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="bg-slate-900 border border-secondary border-dashed rounded-4 p-5">
                    <Popcorn size={64} className="text-secondary mb-4" />
                    <h2 className="fw-bold mb-3">Your Watchlist is Empty</h2>
                    <p className="text-muted mb-4">Start exploring movies and add them to your collection!</p>
                    <Button as={Link} to="/" variant="primary" className="rounded-pill px-5 py-2 fw-bold">
                        Browse Movies
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h1 className="fw-bold display-5">My Watchlist</h1>
                <Badge bg="primary" className="rounded-pill px-3 py-2 fs-6">
                    {watchlist.length} Movies
                </Badge>
            </div>

            <Row className="g-4">
                {watchlist.map(movie => (
                    <Col key={movie.id} xs={12} md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm overflow-hidden bg-slate-800">
                            <Row className="g-0 h-100">
                                <Col xs={4}>
                                    <Link to={`/movie/${movie.id}`}>
                                        <Card.Img
                                            src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                                            className="h-100 object-fit-cover rounded-0"
                                        />
                                    </Link>
                                </Col>
                                <Col xs={8}>
                                    <Card.Body className="p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title as={Link} to={`/movie/${movie.id}`} className="fs-5 fw-bold text-white text-decoration-none text-truncate pe-3">
                                                {movie.title}
                                            </Card.Title>
                                            <Button
                                                variant="link"
                                                className="p-0 text-danger"
                                                onClick={() => removeFromWatchlist(movie.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <Star size={14} className="text-warning" fill="currentColor" />
                                                <span className="small text-muted">TMDB: {movie.vote_average?.toFixed(1)}</span>
                                            </div>
                                            {movie.personalRating > 0 && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Star size={14} className="text-primary" fill="currentColor" />
                                                    <span className="small text-primary fw-bold">My Rating: {movie.personalRating}/10</span>
                                                </div>
                                            )}
                                        </div>

                                        {movie.note && (
                                            <div className="mb-3 bg-dark bg-opacity-25 rounded p-2 border-start border-primary">
                                                <p className="small text-muted mb-0 fst-italic">
                                                    <MessageCircle size={12} className="me-1" />
                                                    {movie.note}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-auto">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 border-secondary text-light"
                                                onClick={() => handleEditOpen(movie)}
                                            >
                                                <Edit3 size={14} /> Edit Note / Rating
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-slate-900 border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="fw-bold">Update Movie Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-muted small">Personal Rating (1-10)</Form.Label>
                            <Form.Range
                                min="0"
                                max="10"
                                step="0.5"
                                value={editData.personalRating}
                                onChange={(e) => setEditData({ ...editData, personalRating: parseFloat(e.target.value) })}
                            />
                            <div className="text-center fw-bold fs-4 text-primary">
                                {editData.personalRating > 0 ? editData.personalRating : 'No Rating'}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small">Personal Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="bg-slate-800 border-secondary text-white"
                                placeholder="Add a personal note about this movie..."
                                value={editData.note}
                                onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} className="rounded-pill px-4 fw-bold">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Watchlist;
