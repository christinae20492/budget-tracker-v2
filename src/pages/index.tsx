import { getMonthlyExpenditureDetails } from "@/app/utils/expenses";
import {
  Expense,
  Income,
  getLocalExpenses,
  getLocalIncome,
  getEnvelopes,
} from "@/app/utils/localStorage";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Auth from "@/app/components/ui/Auth";
import SummaryDoughnutChart from "@/app/components/ui/DonutChart";
import Layout from "@/app/components/ui/Layout";

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState({
    incomeTotals: 0,
    expenseTotals: 0,
    difference: 0,
  });
  const [spendingDetails, setSpendingDetails] = useState({
    highestEnvelope: "",
    highestAmount: 0,
    frequentLocation: "",
  });

  useEffect(() => {
    const fetchData = () => {
      const storedExpenses = getLocalExpenses();
      const storedIncomes = getLocalIncome();
      const details = getMonthlyExpenditureDetails(
        storedIncomes,
        storedExpenses
      );
      setExpenses(storedExpenses);
      setIncomes(storedIncomes);
      setSummary({
        incomeTotals: details.incomeTotals || 0,
        expenseTotals: details.expenseTotals || 0,
        difference: (details.incomeTotals || 0) - (details.expenseTotals || 0),
      });
      setSpendingDetails({
        highestEnvelope: details.highestEnvelope || "n/a",
        highestAmount: details.highestSpendingAmount || 0,
        frequentLocation: details.highestSpendingLocation || "n/a",
      });
    };

    fetchData();
  }, []);

  const Message = () => {
    if (summary.difference > 0) {
      return `🎉 Wow, you saved a lot of money this month! You still have $${summary.difference.toFixed(
        2
      )} left over after paying the month's debts.`;
    } else if (summary.difference < 0) {
      return `😞 This month wasn't too good budget-wise. It looks like ${
        spendingDetails.frequentLocation
      } really got to you—you spent a total of $${spendingDetails.highestAmount.toFixed(
        2
      )} there this month.`;
    } else if (!spendingDetails.frequentLocation && !summary.difference) {
      return `Why are you looking here? There's nothing to report. Get to budgeting already!`;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Just a Bit - Budget Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <h1 className="my-5 text-center">Your "At a Glance"</h1>
        <table className="comparison-table text-center mx-auto">
          <thead>
            <tr>
              <th className="positive-item">Income</th>
              <th className="neg-item">Expenditure</th>
              <th className="difference">Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${summary.incomeTotals.toFixed(2)}</td>
              <td>${summary.expenseTotals.toFixed(2)}</td>
              <td>${summary.difference.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className="m-6">{Message()}</div>
        <div className="mt-6">
          <SummaryDoughnutChart summary={summary} />
        </div>
        <button></button>
      </div>
    </Layout>
  );
}
