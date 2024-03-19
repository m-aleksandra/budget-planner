import { Modal, Form, Button } from "react-bootstrap";
import { useRef, useEffect } from "react";
import { useTransaction } from "../contexts/TransactionContext";
import { useCategory } from "../contexts/CategoryContext";
import { displayISOdate } from "../utils";

const AddTransactionModal = ({ show, handleClose, existingTransaction = null, mode = 'add', categoryName=null }) => {
  const title = useRef();
  const amount = useRef();
  const category = useRef();
  const date = useRef();
  const { addTransaction, updateTransaction, fetchTransactions } = useTransaction();
  const { categories } = useCategory();

  useEffect(() => {
    if (mode === 'update' && existingTransaction) {
      title.current.value = existingTransaction.title;
      amount.current.value = existingTransaction.amount;
      category.current.value = existingTransaction.categoryName;
      date.current.value = displayISOdate(existingTransaction.date); 
    }
  }, [existingTransaction, mode]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: title.current.value,
      amount: amount.current.value,
      date: date.current.value,
      category: categoryName ? categoryName : category.current.value,
      accountId: 1, 
    };

    if (mode === 'add') {
      await addTransaction(data);
    } else if (mode === 'update' && existingTransaction?.id) {
      await updateTransaction(existingTransaction.id, data);
    }

    await fetchTransactions();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>{mode === 'add' ? 'Add Transaction' : 'Update Transaction'}</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title: </Form.Label>
            <Form.Control type="text" ref={title} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date: </Form.Label>
            <Form.Control type="date" ref={date} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount: </Form.Label>
            <Form.Control type="number" ref={amount} />
          </Form.Group>
          {!categoryName && (
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" list="categoryList" ref={category} />
              <datalist id="categoryList">
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name} />
                ))}
              </datalist>
            </Form.Group>
          )}
          <Button type="submit" className="mt-2">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTransactionModal;
