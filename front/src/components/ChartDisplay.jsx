import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useTransaction } from "../contexts/TransactionContext";
import { Pie } from 'react-chartjs-2';

Chart.register(CategoryScale);

function ChartDisplay() {

const { transactions } = useTransaction();
const [chartData, setChartData] = useState({
  datasets: [],
});

useEffect(() => {
  console.log("T", transactions)
  const dataAggregated = transactions.reduce((acc, transaction) => {
    acc[transaction.categoryName] = (acc[transaction.categoryName] || 0) + transaction.amount;
    return acc;
  }, {});
  console.log("Agg", dataAggregated)

  setChartData({
    labels: Object.keys(dataAggregated),
    datasets: [
      {
        label: 'Transactions by Category',
        data: Object.values(dataAggregated),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#cc65fe',
          '#445ce2',
          '#e244b1',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#cc65fe',
          '#445ce2',
          '#e244b1',
        ],
      },
    ],
  });
}, [transactions]); 

return (
    <Container>
    <div className="row">
      <div className="col-md-6">
        <Pie data={chartData} />
      </div>
    </div>
  </Container>
);
  
}

export default ChartDisplay;
