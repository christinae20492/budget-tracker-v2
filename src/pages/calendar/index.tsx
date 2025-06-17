import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ExpenseModal from "@/app/components/ui/ExpenseModal";
import {
  getLocalExpenses,
  Expense,
  getLocalIncome,
  Income,
  getEnvelopes,
  Envelope,
} from "@/app/utils/localStorage";
import { getExpenses } from "@/app/utils/dynamotest";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";
import Layout from "@/app/components/ui/Layout";
import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
import Auth from "@/app/components/ui/Auth";

Amplify.configure(awsmobile)

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

  const router = useRouter();
  type ViewType = "expenses" | "income" | "both";

  const updateView = () => {
    setCalendarView(window.innerWidth < 1000 ? "dayGridWeek" : "dayGridMonth");
  };

const fetchExpenses = async () =>{
      setExpenses(await getExpenses());
}

  useEffect(() => {
//fetchExpenses();
setExpenses(getLocalExpenses());
    setIncomes(getLocalIncome());
    setEnvelopes(getEnvelopes());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setExpenses(getLocalExpenses());
      setIncomes(getLocalIncome());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

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

  const getCategoryColor = (envelopeName: string, envelopes: Envelope[]) => {
    return (
      envelopes.find((env) => env.title === envelopeName)?.color || "#DA5151"
    );
  };

  const calendarEvents = useMemo(() => {
    const expenseEvents = expenses.map((expense) => ({
      id: String(expense.id),
      title: `${expense.location} - $${expense.amount}`,
      start: expense.date,
      backgroundColor: getCategoryColor(expense.envelope, envelopes),
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

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenses={selectedDateExpenses}
        incomes={selectedDateIncome}
        selectedDate={selectedDate}
        view={view}
      />
    </Layout>
  );
}
