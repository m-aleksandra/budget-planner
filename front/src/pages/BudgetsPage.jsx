import React from "react";
import { BudgetProvider } from "../contexts/BudgetContext";
import { CategoryProvider } from "../contexts/CategoryContext";
import { TransactionProvider } from "../contexts/TransactionContext";
import { useState } from "react";
import BudgetList from "../components/BudgetList";
import AddBudgetModal from "../components/AddBudgetModal";
import Menu from "../components/Menu";
import { Button, Container } from "react-bootstrap";

function BudgetsPage() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  return (
    <>
      <Menu />
      <TransactionProvider>
        <CategoryProvider>
          <BudgetProvider>
            <Container className="d-flex justify-content-end mt-4 mb-4">
              <Button onClick={() => setShowAddBudgetModal(true)}>
                New Budget
              </Button>
            </Container>
            <BudgetList />

            <AddBudgetModal
              show={showAddBudgetModal}
              handleClose={() => setShowAddBudgetModal(false)}
            />
          </BudgetProvider>
        </CategoryProvider>
      </TransactionProvider>
    </>
  );
}

export default BudgetsPage;
