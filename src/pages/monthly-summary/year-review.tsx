"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { getYearlyExpenditureDetails } from "@/app/utils/expenses";
import { getLocalExpenses, getLocalIncome } from "@/app/utils/localStorage";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function YearlySummary() {
  const [summary, setSummary] = useState<ReturnType<
    typeof getYearlyExpenditureDetails
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const expenses = getLocalExpenses();
  const incomes = getLocalIncome();

  useEffect(() => {
    if (expenses.length && incomes.length) {
      const details = getYearlyExpenditureDetails(incomes, expenses, year);
      setSummary(details);
      setIsLoading(false);
    }
  }, [year]);

  if (!summary) {
    return <div>Loading Yearly Summary...</div>;
  }

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Total Income",
        data: summary.monthlyIncome,
        borderColor: "#34853B",
        backgroundColor: "#2CE83F",
      },
      {
        label: "Total Spending",
        data: summary.monthlyExpenses,
        borderColor: "#962C2C",
        backgroundColor: "#CC3838",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Income vs. Expenditure for ${year}`,
      },
    },
  };

  return (
    <Layout>
      <Head>
        <title>Your Year In Review</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className="text-center xl:text-2xl md:text-3xl md:p-2 font-bold">Yearly Summary</h1>

      <div className="text-center my-5">
        <h3 className="text-gray-400 xl:text-xl md:text-2xl">
          <button onClick={() => setYear(year - 1)}>Previous Year</button>
        </h3>
        <h3>
          <span className="xl:text-xl md:text-2xl">{year}</span>
        </h3>
        <h3 className="text-gray-400 xl:text-xl md:text-2xl">
          <button onClick={() => setYear(year + 1)}>Next Year</button>
        </h3>
      </div>

      <div className="xl:m-0 md:m-3">
        <p className="my-2">Total Income: ${summary.incomeTotals.toFixed(2)}</p>
        <p className="my-2">
          Total Spending: ${summary.expenseTotals.toFixed(2)}
        </p>
        <p className="my-2">
          Net Savings: ${summary.spendingDifference.toFixed(2)}
        </p>
      

      <p className="my-2">
        Category with Highest Spending: {summary.highestEnvelope} - $
        {summary.highestAmount}
      </p>
      <p className="my-2">
        Most Frequent Purchases Category: {summary.frequentEnvelope}
      </p>
      </div>

      <div className="mt-10">
        <h2 className="text-center text-xl font-semibold">
          Income vs. Expenditure
        </h2>
        <div className="max-w-lg mx-auto">
          <Line data={data} options={options} />
        </div>
      </div>
    </Layout>
  );
}
