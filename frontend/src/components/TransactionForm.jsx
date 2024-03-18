import { useState, useEffect } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { Form, Button, Modal } from "react-bootstrap";

const TransactionForm = ({
  show,
  handleClose,
  mode,
  existingTransaction,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  
  useEffect(() => {
    if (mode === 'update' && existingTransaction.date) {
      setDate(formatDate(existingTransaction.date));
    } else {
      setDate(""); 
    }
  }, [existingTransaction, mode]);

  useEffect(() => {
    if (mode === 'update') {
      setTitle(existingTransaction.title || "");
      setAmount(existingTransaction.amount || 0);
      setCategory(existingTransaction.categoryName || ""); 
    }
  }, [existingTransaction, mode]);
  console.log(existingTransaction)


  const { categories, fetchTransactions } = useFinance();

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      date,
      amount,
      category,
      accountId: 1,
    };

    const url =
      "http://127.0.0.1:5000/transaction" +
      (mode === 'update' ? `/${existingTransaction.id}` : "");
    const options = {
      method: mode === 'update' ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    if (response.status !== 201 && response.status !== 200) {
      const message = await response.json();
      alert(message.message);
    } else {
      fetchTransactions();
      handleClose()
    }
  };

  return (
    <>
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'update' ? 'Update Transaction' : 'Add Transaction'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title: </Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date: </Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount: </Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            list="categoryList"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="categoryList">
            {categories.map((cat, index) => (
              <option key={index} value={cat.name} />
            ))}
          </datalist>
        </Form.Group>

        <Button type="submit" className="mt-2">
          Save
        </Button>
      </Form>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default TransactionForm;
