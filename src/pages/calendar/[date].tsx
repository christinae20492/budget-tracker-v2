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
    <>
      <Head>
        <title>Day's Details</title>
        <meta name="description" content="Details for the selected day." />
      </Head>

      <div className="details-page">
        <h1>Details for {date}</h1>

        <h2>Expenses</h2>
        <ul>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <li key={expense.id}>
                {expense.location} - ${expense.amount} (
                {expense.envelope || "No Title"})
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No expenses recorded.</p>
          )}
        </ul>

        <h2>Income</h2>
        <ul>
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <li key={income.id}>
                {income.source} - ${income.amount}
                <button
                  onClick={() => handleDeleteIncome(income.id)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No income recorded.</p>
          )}
        </ul>
      </div>
    </>
  );
}
