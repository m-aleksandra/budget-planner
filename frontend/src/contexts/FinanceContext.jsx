import React, { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);

  const handleCloseBudgetForm = () => setShowBudgetForm(false);
  const handleShowBudgetForm = () => setShowBudgetForm(true);
  const handleCloseTransactionForm = () => setShowTransactionForm(false);
  const handleShowTransactionForm = () => setShowTransactionForm(true);
  const handleShowTransactionModal = (budgetId) => {
    setCurrentBudgetId(budgetId);
    fetchCurrentBudget(budgetId);
  };
  const handleCloseTransactionModal = () => {
    setCurrentBudgetId(null);
    setCurrentBudget(null)
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch("http://127.0.0.1:5000/transaction");
    const data = await response.json();
    setTransactions(data.transactions);
  };

  const fetchCategories = async () => {
    const response = await fetch("http://127.0.0.1:5000/category");
    const data = await response.json();
    setCategories(data.categories);
  };

  const fetchBudgets = async () => {
    const response = await fetch("http://127.0.0.1:5000/budget");
    const data = await response.json();
    setBudgets(data.budgets);
  };

  const fetchCurrentBudget = async (id) => {
    const url = `http://127.0.0.1:5000/budget/${id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    setCurrentBudget(data.budget)
  };
  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        fetchTransactions,
        fetchCategories,
        fetchBudgets,
        handleCloseBudgetForm,
        handleShowBudgetForm,
        showBudgetForm,
        handleCloseTransactionForm,
        handleShowTransactionForm,
        showTransactionForm,
        currentBudgetId,
        handleShowTransactionModal,
        handleCloseTransactionModal,
        currentBudget
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
