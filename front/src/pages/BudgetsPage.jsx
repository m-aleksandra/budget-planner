import React from "react";
import { BudgetProvider } from "../contexts/BudgetContext";
import { CategoryProvider } from "../contexts/CategoryContext";
import { TransactionProvider } from "../contexts/TransactionContext";
import { useState } from "react";
import BudgetList from "../components/BudgetList";
import AddBudgetModal from "../components/AddBudgetModal";
import Menu from "../components/Menu";
import { Button } from "react-bootstrap";

function BudgetsPage() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  return (
    <>
      <Menu />
      <TransactionProvider>
        <CategoryProvider>
          <BudgetProvider>
            <BudgetList />
            <Button onClick={() => setShowAddBudgetModal(true)}>
              New Budget
            </Button>
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
