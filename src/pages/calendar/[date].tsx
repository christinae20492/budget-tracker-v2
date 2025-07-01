"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { successToast } from "@/app/utils/toast";
import { Envelope, Expense, Income } from "@/app/utils/types";
import { useSession } from "next-auth/react";
import { deleteExpense, getAllExpenses } from "@/app/server/expenses";
import { deleteIncome, getAllIncomes } from "@/app/server/incomes";
import LoadingScreen from "@/app/components/ui/Loader";
import { getAllData } from "@/app/server/data";

export default function DayDetails() {
  const router = useRouter();
  const { date } = router.query;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchData = async () =>{
        if (date && status==="authenticated") {
          setLoading(true)
          const data = await getAllData(session, status);
    if (!data) return null;
    const allExp = data.expenses;
    const allInc = data.incomes;
    const allEnv = data.envelopes;
    setExpenses(allExp.filter((expense) => expense.date === date));
    setIncomes(allInc.filter((income) => income.date === date));
    setEnvelopes(allEnv);
      setLoading(false)
    } else if (!date || status==='loading') return;
  }

  useEffect(() => {
    fetchData()
  }, [date, status]);

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id, session, status)
    router.push('/calendar');
    successToast("Expense successfully deleted.")
  };

  const handleDeleteIncome = async (id: string) => {
    await deleteIncome(id, session, status);
    router.push('/calendar');
    successToast("Income successfully deleted.")
  };

  const getEnvelopeTitle = (envelopeId: string) => {
    if (!envelopes) return;
    const envelope = envelopes.find((env) => env.id === envelopeId);
    return envelope ? envelope.title : "Unknown Envelope";
  };

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Layout>
      <Head>
        <title>Day's Details - {date}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="details-page">
        <h1 className="header">{date}</h1>

        <div>
          <h2 className="header">Expenses</h2>
          <ul className="text-center mx-auto">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <span>
                  <li key={expense.id}
                  className="exp-inc-item">
                    {expense.location} - ${expense.amount} (
                    {getEnvelopeTitle(expense.envelopeId) || "No Title"})
                  </li>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="exp-inc-btn"
                  >
                    Delete
                  </button>
                </span>
              ))
            ) : (
              <p>No expenses recorded.</p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="header">Income</h2>
          <ul className="text-center mx-auto">
            {incomes.length > 0 ? (
              incomes.map((income) => (
                <span>
                  <li key={income.id}
                  className="exp-inc-item text-green-dark">
                    {income.source} - ${income.amount}
                  </li>
                  <button
                    onClick={() => handleDeleteIncome(income.id)}
                    className="exp-inc-btn"
                  >
                    Delete
                  </button>
                </span>
              ))
            ) : (
              <p>No income recorded.</p>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
