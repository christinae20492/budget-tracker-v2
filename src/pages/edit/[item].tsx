"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/app/components/ui/Layout";
import Head from "next/head";
import ItemView from "@/app/components/ui/ItemView";
import { signIn, useSession } from "next-auth/react";
import { getAllData } from "@/app/server/data";
import { Envelope, Expense, Income } from "@/app/utils/types";
import LoadingScreen from "@/app/components/ui/Loader";
import { warnToast } from "@/app/utils/toast";
import React from "react";

export default function EditEnvelope() {
  const router = useRouter();
  const { item } = router.query;

  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const [returns, setReturns] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      setLoading(false);
      return;
    }

    if (status === "unauthenticated") {
      warnToast("Please login to access this page.");
      signIn();
    }
  }, [status, session]);

  const assignItem = (
    input: any,
    envelopesArray: Envelope[],
    expenseArray: Expense[],
    incomeArray: Income[]
  ) => {
    let envelopeItem;
    let expenseItem;
    let incomeItem;

    const id = Array.isArray(input) ? input[0] : input;

    if (!id) {
      return { envelopeItem, expenseItem, incomeItem };
    }

    envelopeItem = envelopesArray.find((env) => env.id === id) || null;

    if (envelopeItem) {
      return { envelopeItem, expenseItem: null, incomeItem: null };
    }

    expenseItem = expenseArray.find((exp) => exp.id === id) || null;

    if (expenseItem) {
      return { envelopeItem: null, expenseItem, incomeItem: null };
    }

    incomeItem = incomeArray.find((inc) => inc.id === id) || null;

    if (incomeItem) {
      return { envelopeItem: null, expenseItem: null, incomeItem };
    }

    return { envelopeItem, expenseItem, incomeItem };
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllData(session, status);
    const allExp = data?.expenses;
    const allEnv = data?.envelopes;
    const allInc = data?.incomes;

    if (!allExp || !allInc || !allEnv) return;
    if (allExp.length && allEnv.length && allInc.length) {
      setReturns(assignItem(item, allEnv, allExp, allInc));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!item) return;
    fetchData();
  }, [item, status]);

  if (loading) {
    return <LoadingScreen />;
  }

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
