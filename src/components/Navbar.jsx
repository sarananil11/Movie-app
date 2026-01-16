import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Popcorn, LogOut, User, UserRound } from 'lucide-react';

const NavigationBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
        logout();
        navigate('/login');
    }
};


    
    

    return (
        <Navbar variant="dark" expand="lg" sticky="top" className="py-3 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary fs-3">
                    <Popcorn size={32} />
                    <span className="d-none d-sm-inline">MovieWatch</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto ms-lg-4 gap-3">
                        <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
                        <Nav.Link as={Link} to="/watchlist" className="text-light">Watchlist</Nav.Link>
                        <Nav.Link as={Link} to="/mynotes" className="text-light">My Notes</Nav.Link>
                    </Nav>

                    <Nav className="align-items-center  gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <>
                                <div className="d-flex align-items-center gap-2 text-muted pe-lg-3 border-end border-secondary">
                                    <UserRound size={18} color='white' />
                                    <span className="small d-none text-white d-md-inline">{user.username}</span>
                                </div>
                                <Button
                                    variant="link"
                                    onClick={handleLogout}
                                    className="p-1 hover-white transition-all text-decoration-none"
                                    title="Logout"
                                    
                                >
                                    Logout  
                                    <LogOut size={20}  />
                                </Button>
                            </>
                        ) : (
                            <Button as={Link} to="/login" variant="primary" className="rounded-pill px-4 fw-medium">
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
