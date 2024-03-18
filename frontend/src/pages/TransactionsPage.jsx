import React from 'react';
import { FinanceProvider } from '../contexts/FinanceContext';
import TransactionList from '../components/TransactionList';
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/Menu";

function TransactionsPage() {
  return (<>
    <Menu/>
    <FinanceProvider>
      <TransactionList/>
    </FinanceProvider></>
  );
}

export default TransactionsPage;