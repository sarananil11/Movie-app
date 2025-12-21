import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            register({ username: formData.username, email: formData.email });
            navigate('/');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-center min-vh-100 py-5">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="p-4 shadow-lg border-0 rounded-4">
                        <Card.Body>
                            <h2 className="text-center mb-4 fw-bold">Create Account</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="regUsername">
                                    <Form.Label className="small text-muted">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Choose a username"
                                        className="bg-slate-800 border-secondary text-white py-2"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="regEmail">
                                    <Form.Label className="small text-muted">Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        className="bg-slate-800 border-secondary text-white py-2"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="regPassword">
                                    <Form.Label className="small text-muted">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Create a password"
                                        className="bg-slate-800 border-secondary text-white py-2"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold rounded-pill mb-3">
                                    Register
                                </Button>

                                <p className="text-center small text-muted mb-0">
                                    Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login</Link>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
