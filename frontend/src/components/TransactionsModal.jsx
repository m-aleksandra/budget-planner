import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useFinance } from "../contexts/FinanceContext";
import { Button, Modal, Container, Stack } from "react-bootstrap";

const ViewTransactionModal = ({ budgetId, handleClose }) => {
  
  const {currentBudget} = useFinance();
  const transactions = currentBudget !== null ? currentBudget.transactions : [];
  console.log(transactions)
  return (
    <>
      <Modal show={budgetId !== null} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>{budgetId}</Modal.Header>
        <Modal.Body>
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
                  {new Date(transaction.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <Badge bg="primary" pill>
                  {transaction.amount}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewTransactionModal;
