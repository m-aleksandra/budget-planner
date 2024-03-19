import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useTransaction } from "../contexts/TransactionContext";
import { currencyFormatter, displayPrettyDate } from "../utils";
import { Button } from "react-bootstrap";
import { useState } from "react";
import AddTransactionModal from "./AddTransactionModal"; // Adjust the path as necessary

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
      <ListGroup as="ul">
        {transactions.map((transaction) => (
          <ListGroup.Item
            as="li"
            key={transaction.id}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{transaction.title}</div>
              <div>{transaction.categoryName}</div>
              {displayPrettyDate(transaction.date)}
            </div>
            <Badge bg="primary" pill>
              {currencyFormatter.format(transaction.amount)}
            </Badge>
            <Button variant="danger" onClick={() => handleDelete(transaction.id)}>Delete</Button>
            <Button variant="primary" onClick={() => handleUpdate(transaction)}>Update</Button>
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
      )}
    </>
  );
};

export default TransactionList;
