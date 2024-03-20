import React from 'react'
import ReactDOM from 'react-dom/client'
import BudgetsPage from './pages/BudgetsPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import ChartPage from './pages/ChartPage.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/budgets",
    element: <BudgetsPage/>
  },
  {
    path: "/",
    element: <TransactionsPage/>
  },
  {
    path: "/chart",
    element: <ChartPage/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
