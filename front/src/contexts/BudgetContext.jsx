import React, { createContext, useContext, useState, useEffect } from "react";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const response = await fetch("http://127.0.0.1:5000/budget");
    const data = await response.json();
    setBudgets(data.budgets);
  };

  const addBudget = async (data) => {
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
    } 
  }
  const deleteBudget = async (id) => {
    const url = `http://127.0.0.1:5000/budget/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (response.status !== 201 && response.status !== 200) {
      const message = await response.json();
      alert(message.message);
    } 
  }
  const getBudget = async (id) => {
    const url = `http://127.0.0.1:5000/budget/${id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    const response = await fetch(url, options);
    if (response.ok) {
      const budget = await response.json();
      return budget.budget; 
    } else {
      const message = await response.json();
      alert(message.message);
      return null;
    }
  };
  
  return (
    <BudgetContext.Provider value={{budgets, fetchBudgets, addBudget, getBudget, deleteBudget}}>
      {children}
    </BudgetContext.Provider>
  );
};