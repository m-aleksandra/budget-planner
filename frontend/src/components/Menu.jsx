import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const Menu = () => {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/">Transactions</Nav.Link>
            <Nav.Link href="/budgets">Budgets</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default Menu;