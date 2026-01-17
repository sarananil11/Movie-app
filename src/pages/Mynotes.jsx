import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { Trash2, Edit3, MessageCircle, FileText } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { TMDB_IMAGE_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const Mynotes = () => {
    const { watchlist, updateMovieData } = useWatchlist();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ personalRating: 0, note: '' });

    // Filter watchlist to only show movies with notes
    const moviesWithNotes = watchlist.filter(movie => movie.note && movie.note.trim() !== '');

    const handleEditOpen = (movie) => {
        setSelectedMovie(movie);
        setEditData({ personalRating: movie.personalRating || 0, note: movie.note || '' });
        setShowModal(true);
    };

    const handleSave = () => {
        updateMovieData(selectedMovie.movieId || selectedMovie.id, editData);
        setShowModal(false);
    };

    const handleClearNote = (movie) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            updateMovieData(movie.movieId || movie.id, { note: '' });
        }
    };

    if (moviesWithNotes.length === 0) {
        return (
            <Container className="py-5 text-center">
                <div className="bg-slate-900 border border-secondary border-dashed rounded-4 p-5">
                    <FileText size={64} className="text-secondary mb-4" />
                    <h2 className="fw-bold mb-3">No Notes Yet</h2>
                    <p className="text-muted mb-4">You haven't added any personal notes to your movies. Add some in your watchlist!</p>
                    <Button as={Link} to="/watchlist" variant="primary" className="rounded-pill px-5 py-2 fw-bold">
                        Go to Watchlist
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <div className="d-flex align-items-center justify-content-between mb-5">
                <h1 className="fw-bold display-5">My Movie Notes</h1>
                <Badge bg="danger" className="rounded-pill px-3 py-2 fs-6">
                    {moviesWithNotes.length} Notes
                </Badge>
            </div>

            <Row className="g-4">
                {moviesWithNotes.map(movie => {
                    const movieId = movie.movieId || movie.id;
                    return (
                        <Col key={movieId} xs={12} md={6}>
                            <Card className="h-100 border-0 shadow-sm overflow-hidden bg-slate-800">
                                <Row className="g-0 h-100">
                                    <Col xs={4}>
                                        <Link to={`/movie/${movieId}`}>
                                            <Card.Img
                                                src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                                                className="h-100 object-fit-cover rounded-0"
                                            />
                                        </Link>
                                    </Col>
                                    <Col xs={8}>
                                        <Card.Body className="p-3 d-flex flex-column h-100">
                                            <div className="mb-2">
                                                <Card.Title as={Link} to={`/movie/${movieId}`} className="fs-5 fw-bold text-white text-decoration-none d-block mb-1">
                                                    {movie.title}
                                                </Card.Title>
                                                {movie.personalRating > 0 && (
                                                    <Badge bg="dark" className="border border-primary text-primary small">
                                                        Rating: {movie.personalRating}/10
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 bg-dark bg-opacity-25 rounded p-3 mb-3 border-start border-primary">
                                                <p className="text-light mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {movie.note}
                                                </p>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 border-danger text-light"
                                                    onClick={() => handleEditOpen(movie)}
                                                >
                                                    <Edit3 size={14} /> Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="rounded-pill d-flex align-items-center justify-content-center p-2"
                                                    onClick={() => handleClearNote(movie)}
                                                    title="Delete Note"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-slate-900 border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="fw-bold">Edit Note</Modal.Title>
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
                                rows={5}
                                className="bg-slate-800 border-secondary text-black"
                                placeholder="Edit your personal note..."
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

export default Mynotes;
