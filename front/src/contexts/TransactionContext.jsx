import React, { createContext, useContext, useState, useEffect } from "react";

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch("http://127.0.0.1:5000/transaction");
    const data = await response.json();
    setTransactions(data.transactions);
  };
  const addTransaction = async (data) => {
    const url = "http://127.0.0.1:5000/transaction";
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
  const deleteTransaction = async (id) => {
    const url = `http://127.0.0.1:5000/transaction/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch(url, options);

    if (response.status === 404) {
      const message = await response.json();
      alert(message.message);
    } 
    
  }
  const updateTransaction = async (id, data) => {
    const url = `http://127.0.0.1:5000/transaction/${id}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    if (response.status === 404) {
      const message = await response.json();
      alert(message.message);
    } 
    
  }
  return (
    <TransactionContext.Provider value={{transactions, fetchTransactions, addTransaction, deleteTransaction, updateTransaction}}>
      {children}
    </TransactionContext.Provider>
  );
};
