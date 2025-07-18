import { getMonthlyExpenditureDetails, SummaryDetails } from "@/app/utils/expenses";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import SummaryDoughnutChart from "@/app/components/ui/DonutChart";
import Layout from "@/app/components/ui/Layout";
import { successToast, warnToast } from "@/app/utils/toast";
import router from "next/router";
import { signIn, useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/ui/Loader";
import { getAllData } from "@/app/server/data";
import { Expense, Income } from "@/app/utils/types";

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
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
  const { data: session, status } = useSession();

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    setLoading(true);
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      setLoading(false);
      successToast(`Welcome back, ${session?.user.username}`);
      return;
    }

    if (status === "unauthenticated") {
      warnToast("Please login to access this page.");
      signIn();
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await getAllData(session, status);
      if (!data || status==='loading') return;
      const storedExpenses = data.expenses;
      const storedIncomes = data.incomes;
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
      setLoading(false)
    };

    if (session && status) {
      fetchData();
    }
  }, [session, status]);

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
    } else if (!spendingDetails.frequentLocation && summary.difference === 0) {
      return `Why are you looking here? There's nothing to report. Get to budgeting already!`;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
