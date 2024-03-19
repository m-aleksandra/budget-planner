import React from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { currencyFormatter } from '../utils';

const ViewTransactionsModal = ({ show, onHide, transactions }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {transactions.map((transaction, index) => (
            <ListGroup.Item key={index}>
              {transaction.title}  {currencyFormatter.format(transaction.amount)}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default ViewTransactionsModal;
