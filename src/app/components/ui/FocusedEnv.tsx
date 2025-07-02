import { getAllEnvelopes, getEnvelopeExpenses } from '@/app/server/envelopes';
import { warnToast } from '@/app/utils/toast';
import { Envelope, Expense } from '@/app/utils/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import LoadingScreen from './Loader';

interface FocusedEnvProps {
  onClose: () => void;
  envelope: string;
}

export default function FocusedEnv({ onClose, envelope }: FocusedEnvProps) {

  const [envelopeData, setEnvelopeData] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [mostFrequentLocation, setMostFrequentLocation] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchData = async () => {
    if (!envelope || typeof envelope !== "string" || status === "loading") return;

    const envelopes = await getAllEnvelopes(session, status);
    if (!envelopes || envelopes.length === 0) {
      return;
    }

    const currentEnvelope = envelopes.find((env) => env.id === envelope);
    if (!currentEnvelope) {
      setEnvelopeData(null);
      return;
    }

    setEnvelopeData(currentEnvelope);
    const expenseList = await getEnvelopeExpenses(envelope, session, status, false);

    if (!expenseList) return;

    // Filter expenses for the current month
     const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthPadded = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYearMonthString = `${currentYear}-${currentMonthPadded}`;

    const filteredExpenses = expenseList.filter((expense) => {
      const expenseYearMonthString = expense.date.substring(0, 7); 
      
      return expenseYearMonthString === currentYearMonthString;
    });

    setExpenses(filteredExpenses);

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotalSpent(total);

    let diff = total - currentEnvelope?.budget;

    if (currentEnvelope.budget) {
      if (currentEnvelope.fixed && total > currentEnvelope.budget) {
        warnToast(`Budget exceeded! You spent an extra $${diff.toFixed(2)}!`);
      }
    }

    if (filteredExpenses.length > 0) {
      const locationFrequency: Record<string, number> = {};
      filteredExpenses.forEach((expense) => {
        locationFrequency[expense.location] =
          (locationFrequency[expense.location] || 0) + 1;
      });

      const frequentLocation = Object.keys(locationFrequency).reduce((a, b) =>
        locationFrequency[a] > locationFrequency[b] ? a : b
      );

      setMostFrequentLocation(frequentLocation);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (envelope && typeof envelope === "string" && status === "authenticated") {
        fetchData();
    }
  }, [envelope, status]);

  if (!envelopeData) {
    return (
      <div className="text-center text-red-500 mt-8">Envelope not found</div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className='modal-bg text-center'>
    <div onClick={onClose} className='fixed inset-0 bg-black bg-opacity-50'>
    <div className="modal-main w-1/2 h-5/6 my-5">
        <h1 className="header">{envelopeData.title} Details</h1>
        <h2 className="text-gray-600">
          Budget: <strong>${envelopeData.budget}</strong>
        </h2>
        <h2 className="text-gray-600">
          Total Spent: <strong>${totalSpent.toFixed(2)}</strong>
        </h2>

        <h2 className="mt-4 text-lg font-semibold">Expenses</h2>
        {expenses.length > 0 ? (
          <ul className="list-disc pl-5">
            {expenses.map((expense, index) => (
              <span>
                <li
                  key={index}
                  className={`exp-inc-item my-3 ${
                    expense.location === mostFrequentLocation
                      ? "font-bold text-blue-med"
                      : ""
                  }`}
                >
                  {expense.location}: ${expense.amount}
                </li>
              </span>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            No expenses recorded for this envelope this month.
          </p>
        )}
      </div>
      </div>
      </div>
  )
}
