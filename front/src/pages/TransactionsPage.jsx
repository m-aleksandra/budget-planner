import React from "react";
import { TransactionProvider } from "../contexts/TransactionContext";
import { CategoryProvider } from "../contexts/CategoryContext";
import TransactionList from "../components/TransactionList";
import AddTransactionModal from "../components/AddTransactionModal";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/Menu";
import { Button, Container } from "react-bootstrap";
import { useState } from "react";

function TransactionsPage() {
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  return (
    <>
      <Menu />
      <CategoryProvider>
        <TransactionProvider>
        <Container className="d-flex justify-content-end mt-4 mb-4">
            <Button onClick={() => setShowAddTransactionModal(true)} variant="primary">
              New Transaction
            </Button>
          </Container>
          <TransactionList />
          <AddTransactionModal
            show={showAddTransactionModal}
            handleClose={() => setShowAddTransactionModal(false)}
          />
        </TransactionProvider>
      </CategoryProvider>
    </>
  );
}

export default TransactionsPage;
