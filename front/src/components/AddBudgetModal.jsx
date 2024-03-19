import { Modal, Form, Button } from "react-bootstrap";
import { useState, useRef } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { useCategory } from "../contexts/CategoryContext";

const AddBudgetModal = ({ show, handleClose }) => {
  const month = useRef();
  const year = useRef();
  const max = useRef();
  const category = useRef();
  const { addBudget, fetchBudgets } = useBudget();
  const { categories } = useCategory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      month: month.current.value,
      year: year.current.value,
      max: max.current.value,
      category: category.current.value,
      accountId: 1,
    };
    await addBudget(data);
    await fetchBudgets();
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>Add Budget</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Month: </Form.Label>
              <Form.Control
                type="number"
                placeholder="Number of month"
                ref={month}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year: </Form.Label>
              <Form.Control type="number" placeholder="Year" ref={year} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount: </Form.Label>
              <Form.Control type="number" placeholder="Amount" ref={max} />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                list="categoryList"
                ref={category}
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

export default AddBudgetModal;
