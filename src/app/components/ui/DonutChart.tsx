'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SummaryData {
  incomeTotals: number;
  expenseTotals: number;
  difference: number;
}

interface SummaryDoughnutChartProps {
  summary: SummaryData;
}

const SummaryDoughnutChart: React.FC<SummaryDoughnutChartProps> = ({ summary }) => {
  const income = Math.max(0, summary.incomeTotals);
  const expenses = Math.max(0, summary.expenseTotals);
  const remainder = Math.max(0, summary.difference);

  const data = {
    labels: ["Income", "Expenses", "Remainder"],
    datasets: [
      {
        data: [
          income, 
          expenses,
          remainder, 
        ],
        backgroundColor: [
          "#86bd75",
          "#DB6A6A", 
          "#E4C04C", 
        ],
        hoverBackgroundColor: [
          "#45A049",
          "#E64A19", 
          "#bdb775",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
      },
    },
    layout: {
      padding: 10
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', height: '400px', margin: 'auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default SummaryDoughnutChart;