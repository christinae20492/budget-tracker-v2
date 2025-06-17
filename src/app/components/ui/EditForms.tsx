"use client";

import Auth from "@/app/components/ui/Auth";
import {
  Expense,
  getLocalExpenses,
  getLocalIncome,
  Income,
} from "@/app/utils/localStorage";
import { successToast } from "@/app/utils/toast";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface EditFormProps {
  currentItemType: "expense" | "income";
  expense: Expense | null;
  income: Income | null;
}

export const EditForm: React.FC<EditFormProps> = ({ currentItemType, expense, income }) => {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [envelope, setEnvelope] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [comments, setComments] = useState("");

  const [source, setSource] = useState("");
  const [savings, setSavings] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [remainder, setRemainder] = useState(0);

  useEffect(() => {
    if (expense && !income) {
      setLocation(expense.location);
      setDate(expense.date);
      setAmount(expense.amount);
      setComments(expense.comments);
      setEnvelope(expense.envelope);
    } else if (income && !expense) {
        setSource(income.source);
        setDate(income.date);
        setAmount(income.amount)
        setSavings(income.savings);
        setInvestments(income.investments);
        setRemainder(income.remainder);
    }
  }, [expense, income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentItemType === "expense" && expense) {
      const updatedExpense: Expense = {
        id: expense.id,
        location,
        envelope,
        date,
        amount,
        comments,
      };

      const existingExpenses = getLocalExpenses();
      const expenseIndex = existingExpenses.findIndex(exp => exp.id === updatedExpense.id);

      if (expenseIndex !== -1) {
        existingExpenses[expenseIndex] = updatedExpense;
        localStorage.setItem("expenses", JSON.stringify(existingExpenses));
    } else if (income) {
      const updatedIncome: Income = {
        id: income.id,
        source,
        amount,
        date,
        savings,
        investments,
        remainder,
      };
      const existingIncomes = getLocalIncome();
      const incomeIndex = existingIncomes.findIndex(inc => inc.id === updatedIncome.id);

      if (incomeIndex !== -1) {
        existingIncomes[incomeIndex] = updatedIncome;
        localStorage.setItem("incomes", JSON.stringify(existingIncomes));
    }
  }
        successToast(`Your ${currentItemType} was updated successfully!`);
      router.push(`/edit`)
  }
}



    return (
      <>
        {currentItemType === "expense" ? (
          <div>
            <h1 className="header">Expenditure from {expense.date}</h1>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Location of Purchase<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Date of Purchase<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Total Cost ($)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Comments
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
                  rows={3}
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-400"
                >
                  Edit Expense
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="header">Income on {income.date}</h1>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              <div>
                <label>Source of Income</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                  required
                />
              </div>
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                />
              </div>
              <div>
                <label>Total Income Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                  required
                />
              </div>
              <div>
                <label>Savings</label>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                />
              </div>
              <div>
                <label>Investments</label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="block w-full p-2 dark:bg-slate-900 dark:text-white border border-gray-300"
                />
              </div>
              <div>
                <label className="font-semibold">
                  Remaining Income: {remainder}
                </label>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
                >
                  Edit Income
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    );
  };
