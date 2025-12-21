import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            login({ username: formData.username });
            navigate('/');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-center min-vh-100 py-5">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="p-4 shadow-lg border-0 rounded-4">
                        <Card.Body>
                            <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label className="small text-muted">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        className="bg-slate-800 border-secondary text-white py-2"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label className="small text-muted">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        className="bg-slate-800 border-secondary text-white py-2"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold rounded-pill mb-3">
                                    Sign In
                                </Button>

                                <p className="text-center small text-muted mb-0">
                                    Don't have an account? <Link to="/register" className="text-primary text-decoration-none">Register</Link>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
