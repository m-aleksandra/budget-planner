import { useState } from "react";
import Form from "react-bootstrap/Form"
import { useFinance } from "../contexts/FinanceContext";
import { Button } from "react-bootstrap";

function BudgetForm() {
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [max, setMax] = useState(0);
  const [category, setCategory] = useState("");

  const {
    categories,
    fetchBudgets,
    handleCloseBudgetForm,
  } = useFinance();

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      month,
      year,
      max,
      category,
      accountId: 1,
    };

    const url = "http://127.0.0.1:5000/budget";
    const options = {
      method: "POST",
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
      fetchBudgets();
      handleCloseBudgetForm();
    }
  };
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Month: </Form.Label>
          <Form.Control
            type="number"
            placeholder="Number of month"
            onChange={(e) => setMonth(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Year: </Form.Label>
          <Form.Control
            type="number"
            placeholder="Year"
            onChange={(e) => setYear(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount: </Form.Label>
          <Form.Control
            type="number"
            placeholder="Amount"
            onChange={(e) => setMax(e.target.value)}
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
        <Button type="submit" className="mt-2">Save</Button>
      </Form>
    </>
  );
}

export default BudgetForm;
