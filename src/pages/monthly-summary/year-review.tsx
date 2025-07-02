"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { getYearlyExpenditureDetails } from "@/app/utils/expenses";

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
import { useSession } from "next-auth/react";
import { getAllExpenses } from "@/app/server/expenses";
import { getAllIncomes } from "@/app/server/incomes";
import LoadingScreen from "@/app/components/ui/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface YearSummaryDetails {
  incomeTotals: number,
    expenseTotals: number,
    spendingDifference: number,
    highestEnvelope: string,
    highestAmount: number,
    frequentEnvelope: string,
    monthlyExpenses: any,
    monthlyIncome: any
}

export default function YearlySummary() {
  const [summary, setSummary] = useState<YearSummaryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    setIsLoading(true);
    const allExp = await getAllExpenses(session, status);
    const allInc = await getAllIncomes(session, status);
    if (!allExp || !allInc) return;
    const details = getYearlyExpenditureDetails(allInc, allExp, year);
    setSummary(details);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [year, status]);

  if (!summary || isLoading) {
    return <LoadingScreen />;
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
        borderColor: "#731718",
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
      <h1 className="text-center xl:text-2xl md:text-3xl md:p-2 font-bold">
        Yearly Summary
      </h1>

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
