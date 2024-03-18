import React from "react";
import { FinanceProvider } from "../contexts/FinanceContext";
import BudgetList from "../BudgetList";
import Menu from "../components/Menu";

function BudgetsPage() {
  return (
    <>
      <Menu />
      <FinanceProvider>
        <BudgetList />
      </FinanceProvider>
    </>
  );
}

export default BudgetsPage;
