"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getLocalExpenses,
  getLocalIncome,
  Expense,
  Income,
} from "@/app/utils/localStorage";
import Layout from "@/app/components/ui/Layout";

export default function DayDetails() {
  const router = useRouter();
  const { date } = router.query;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    if (date) {
      setExpenses(
        getLocalExpenses().filter((expense) => expense.date === date)
      );
      setIncomes(getLocalIncome().filter((income) => income.date === date));
    }
  }, [date]);

  const updateStorage = (data: Expense[] | Income[], type: string) => {
    localStorage.setItem(type, JSON.stringify(data));
  };

  const handleDeleteExpense = (id: number) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    updateStorage(updatedExpenses, "expenses");
  };

  const handleDeleteIncome = (id: number) => {
    const updatedIncomes = incomes.filter((income) => income.id !== id);
    setIncomes(updatedIncomes);
    updateStorage(updatedIncomes, "incomes");
  };

  if (!date) return <p>Loading...</p>;

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
                    {expense.envelope || "No Title"})
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
