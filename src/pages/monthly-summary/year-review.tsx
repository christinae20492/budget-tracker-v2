"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { getYearlyExpenditureDetails } from "@/app/utils/expenses";
import { getLocalExpenses, getLocalIncome } from "@/app/utils/localStorage";

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
      const details = getYearlyExpenditureDetails(incomes, expenses);
      setSummary(details);
      setIsLoading(false);
    }
  }, [expenses, incomes, year]);

  if (!summary) {
    return <div>Loading Yearly Summary...</div>;
  }

  return (
    <Layout>
      <h1 className="text-center">Yearly Summary</h1>
      <div className="text-center my-5">
        <h3 className="text-gray-400">
          <button onClick={() => setYear(year - 1)}>Previous Year</button>
        </h3>
        <h3>
          <span>{year}</span>
        </h3>
        <h3 className="text-gray-400">
          <button onClick={() => setYear(year + 1)}>Next Year</button>
        </h3>
      </div>
      <div>
        <p>Total Income: ${summary.incomeTotals.toFixed(2)}</p>
        <p>Total Spending: ${summary.expenseTotals.toFixed(2)}</p>
        <p>Net Savings: ${summary.spendingDifference.toFixed(2)}</p>
      </div>
      <p>
        Category with Highest Spending: {summary.highestEnvelope} - $
        {summary.highestAmount}
      </p>
      <p>Most Frequent Purchases Category: {summary.frequentEnvelope}</p>
    </Layout>
  );
}
