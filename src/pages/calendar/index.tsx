import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";
import Layout from "@/app/components/ui/Layout";
import { getAllData } from "@/app/server/data";
import { signIn, useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/ui/Loader";
import CalendarModal from "@/app/components/ui/CalendarModal";
import { Envelope, Expense, Income } from "@/app/utils/types";
import { warnToast } from "@/app/utils/toast";
import React from "react";

export default function ExpenseCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>("both");
  const [selectedDateExpenses, setSelectedDateExpenses] = useState<Expense[]>(
    []
  );
  const [selectedDateIncome, setSelectedDateIncome] = useState<Income[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);

  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type ViewType = "expenses" | "income" | "both";

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

  const fetchData = async () => {
    const data = await getAllData(session, status);
    if (!data) return null;
    const allExp = data.expenses;
    const allInc = data.incomes;
    const allEnv = data.envelopes;
    setExpenses(allExp);
    setIncomes(allInc);
    setEnvelopes(allEnv);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [session, status]);

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setSelectedDateExpenses(
      expenses.filter((expense) => expense.date === clickedDate)
    );
    setSelectedDateIncome(
      incomes.filter((income) => income.date === clickedDate)
    );
    setIsModalOpen(true);
  };

  const handleToggle = (newView: ViewType) => {
    setView(newView);
  };

  const handleEventClick = (info: { event: { startStr: any } }) => {
    const selectedDate = info.event.startStr;
    router.push(`calendar/${selectedDate}`);
  };

  const getCategoryColor = (envelopeId: string, envelopes: Envelope[]) => {
    if (!envelopes || envelopes.length === 0) return;
    return envelopes.find((env) => env.id === envelopeId)?.color || "#DA5151";
  };

  const calendarEvents = useMemo(() => {
    const expenseEvents = expenses.map((expense) => ({
      id: String(expense.id),
      title: `${expense.location} - $${expense.amount}`,
      start: expense.date,
      backgroundColor: getCategoryColor(expense.envelopeId, envelopes),
    }));

    const incomeEvents = incomes.map((income) => ({
      id: String(income.id),
      title: `${income.source} - $${income.amount}`,
      start: income.date,
      backgroundColor: "#239312",
    }));

    if (view === "expenses") return expenseEvents;
    if (view === "income") return incomeEvents;
    return [...expenseEvents, ...incomeEvents];
  }, [view, expenses, incomes, envelopes]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Details Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="my-6">
        <ToggleSwitch onToggle={handleToggle} />
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView={calendarView}
        dateClick={handleDateClick}
        selectable={true}
        headerToolbar={{ left: "prev,next", center: "title", right: "today" }}
        events={calendarEvents}
        eventClick={handleEventClick}
        footerToolbar={{ center: "dayGridMonth,timeGridWeek,timeGridDay" }}
      />

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenses={selectedDateExpenses}
        incomes={selectedDateIncome}
        envelopes={envelopes}
        selectedDate={selectedDate}
        view={view}
      />
    </Layout>
  );
}
