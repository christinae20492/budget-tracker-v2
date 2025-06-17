"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getEnvelopes,
  Envelope,
  Expense,
  Income,
  getLocalIncome,
  getLocalExpenses,
} from "@/app/utils/localStorage";
import Layout from "@/app/components/ui/Layout";
import Head from "next/head";
import Auth from "@/app/components/ui/Auth";
import ItemView from "@/app/components/ui/ItemView";

export default function EditEnvelope() {
  const router = useRouter();
  const { item } = router.query;

  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [returns, setReturns] = useState<any>([]);

  const assignItem = (
    input: any,
    envelopesArray: Envelope[],
    expenseArray: Expense[],
    incomeArray: Income[]
  ) => {
    let envelopeItem;
    let expenseItem;
    let incomeItem;

    const foundEnv = envelopesArray.find((env) => env.title === input);
    if (foundEnv) {
      envelopeItem = foundEnv;
      expenseItem = null;
      incomeItem = null;
      return { envelopeItem, expenseItem, incomeItem };
    } else if (!foundEnv) {
      let itemAsNum = +input;
      const foundExpense = expenseArray.find(
        (expense) => expense.id === itemAsNum
      );
      if (foundExpense) {
        expenseItem = foundExpense;
        incomeItem = null;
        envelopeItem = null;
      } else {
        const foundIncome = incomeArray.find(
          (income) => income.id === itemAsNum
        );
        if (foundIncome) {
          incomeItem = foundIncome;
          expenseItem = null;
          envelopeItem = null;
        }
      }
    } else {
      envelopeItem = null;
      expenseItem = null;
      incomeItem = null;
    }

    return { envelopeItem, expenseItem, incomeItem };
  };

  useEffect(() => {
    if (!item) return;
    const expenseArray = getLocalExpenses();
    const incomeArray = getLocalIncome();
    const envelopesArray = getEnvelopes();

    if (expenseArray.length && envelopesArray.length && incomeArray.length) {
      setReturns(assignItem(item, envelopesArray, expenseArray, incomeArray));
    }
  }, [item]);

  return (
    <Layout>
      <Head>
        <title>Item Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ItemView
        envelopeItem={returns.envelopeItem}
        expenseItem={returns.expenseItem}
        incomeItem={returns.incomeItem}
      />
    </Layout>
  );
}
