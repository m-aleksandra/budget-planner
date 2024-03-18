import { useState } from "react";
import { Button, Modal, Container, Stack } from "react-bootstrap";
import BudgetForm from "./components/BudgetForm";
import React from "react";
import { useFinance } from "./contexts/FinanceContext";
import BudgetCard from "./components/BudgetCard";
import ViewTransactionModal from "./components/TransactionsModal";

const BudgetList = ({}) => {
  const {
    budgets,
    handleShowBudgetForm,
    handleCloseBudgetForm,
    showBudgetForm,
    currentBudgetId,
    handleShowTransactionModal,
    handleCloseTransactionModal
  } = useFinance();

  return (
    <Container className="my-4">
      <Stack direction="horizontal" gap="2" className="mb-4">
        <h1 className="me-auto">Budgets</h1>
        <Button variant="primary" onClick={handleShowBudgetForm}>
          Add Budget
        </Button>
      </Stack>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            name={budget.categoryName}
            amount={budget.amount}
            max={budget.max}
            month={budget.month}
            year={budget.year}
            onShowTransactions={() => handleShowTransactionModal(budget.id)}
          />
        ))}
      </div>
      <Modal
        show={showBudgetForm}
        onHide={handleCloseBudgetForm}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Set Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BudgetForm />
        </Modal.Body>
      </Modal>

      <ViewTransactionModal
        budgetId={currentBudgetId}
        handleClose={handleCloseTransactionModal}
      />
     
    </Container>
  );
};

export default BudgetList;
