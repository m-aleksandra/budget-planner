import React from "react";
import { TransactionProvider } from "../contexts/TransactionContext";
import { CategoryProvider } from "../contexts/CategoryContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "../components/Menu";
import { Button } from "react-bootstrap";
import { useState } from "react";
import ChartDisplay from "../components/ChartDisplay";


function ChartPage() {
  return (
    <>
      <Menu />
      <CategoryProvider>
        <TransactionProvider>
          <ChartDisplay/>
        </TransactionProvider>
      </CategoryProvider>
    </>
  );
}

export default ChartPage;