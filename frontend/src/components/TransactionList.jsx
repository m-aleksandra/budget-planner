import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useFinance } from "../contexts/FinanceContext";
import { Button, Modal, Container, Stack } from "react-bootstrap";
import TransactionForm from "./TransactionForm";
import { useState } from "react";

const TransactionList = () => {
  // const {
  //   transactions,
  //   fetchTransactions,
  //   handleShowTransactionForm,
  //   handleCloseTransactionForm,
  //   showTransactionForm,
  // } = useFinance();
  // const TransactionList = () => {
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'update'
    const [selectedTransaction, setSelectedTransaction] = useState({});
    const { transactions, fetchTransactions, } = useFinance();
  
    const handleShowForm = (mode, transaction = {}) => {
      setFormMode(mode);
      setSelectedTransaction(transaction);
      setShowTransactionForm(true);
    };

    const handleCloseForm = () => {
      setFormMode(null);
      setSelectedTransaction({});
      setShowTransactionForm(false);
    };
  const deleteTransaction = async (id) => {
    const url = `http://127.0.0.1:5000/transaction/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(url, options);

    if (response.status === 404) {
      const message = await response.json();
      alert(message.message);
    } else {
      handleCloseForm();
      fetchTransactions();
      
    }
  }
  return (
    <>
      <Container>
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Transactions</h1>
          <Button variant="primary" onClick={() => handleShowForm('add')}>
            Add Transaction
          </Button>
        </Stack>
        <ListGroup as="ul">
          {transactions.map((transaction) => (
            <ListGroup.Item
              as="li"
              key={transaction.id}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{transaction.title}</div>
                <div>{transaction.categoryId}</div>
                {new Date(transaction.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <Badge bg="primary" pill>
                {transaction.amount}
              </Badge>
              <Button variant="danger" onClick={() => deleteTransaction(transaction.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleShowForm('update', transaction)}>Update</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <TransactionForm
        show={showTransactionForm}
        handleClose={handleCloseForm}
        mode={formMode}
        existingTransaction={selectedTransaction}
      />
      </Container>
    </>
  );
}

export default TransactionList;
