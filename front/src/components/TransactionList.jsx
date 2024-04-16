import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useTransaction } from "../contexts/TransactionContext";
import { currencyFormatter, displayPrettyDate } from "../utils";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import AddTransactionModal from "./AddTransactionModal"; 

const TransactionList = () => {
  const { transactions, deleteTransaction, fetchTransactions } = useTransaction();
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  const handleUpdate = (transaction) => {
    setCurrentTransaction(transaction);
    setShowModal(true);
  };

  return (
    <>
    <Container>
      <ListGroup as="ul">
        {transactions.map((transaction) => (
          <ListGroup.Item
            as="li"
            key={transaction.id}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <Container>
              <Row>
                <Col xs={4} className="d-flex flex-column">
                  <span className="fw-bold">{transaction.title}</span>
                  <span>{transaction.categoryName}</span>
                  
                </Col >
                <Col xs={4}>
                  <span>{displayPrettyDate(transaction.date)}</span>
                </Col>
                <Col xs={4} className="d-flex justify-content-end align-items-center">
                  <Badge bg="primary" pill className="me-2">
                    {currencyFormatter.format(transaction.amount)}
                  </Badge>
                  <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(transaction.id)}>Delete</Button>
                  <Button variant="primary" size="sm" onClick={() => handleUpdate(transaction)}>Update</Button>
                </Col>
              </Row>
            </Container>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {showModal && (
        <AddTransactionModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          existingTransaction={currentTransaction}
          mode="update"
        />
      )}</Container>
    </>
  );
};

export default TransactionList;
