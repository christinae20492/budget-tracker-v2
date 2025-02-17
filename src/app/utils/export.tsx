export const importYearlyData = (file: Blob) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    const result = event.target?.result;

    if (typeof result !== "string") {
      alert("Error reading file. Please ensure it's a valid JSON export.");
      return;
    }

    try {
      const data = JSON.parse(result);

      if (!data.expenses || !data.incomes || !data.envelopes) {
        alert("Invalid file format");
        return;
      }

      localStorage.setItem("expenses", JSON.stringify(data.expenses));
      localStorage.setItem("incomes", JSON.stringify(data.incomes));
      localStorage.setItem("envelopes", JSON.stringify(data.envelopes));

      alert("Data imported successfully!");
    } catch (error) {
      alert("Error reading file. Please ensure it's a valid JSON export.");
    }
  };

  reader.readAsText(file);
};

export const exportYearlyData = () => {
  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const incomes = JSON.parse(localStorage.getItem("incomes") || "[]");
  const envelopes = JSON.parse(localStorage.getItem("envelopes") || "[]");

  const currentYear = new Date().getFullYear();

  const filteredExpenses = expenses.filter(
    (expense: { date: string | number | Date; }) => new Date(expense.date).getFullYear() === currentYear
  );
  const filteredIncomes = incomes.filter(
    (income: { date: string | number | Date; }) => new Date(income.date).getFullYear() === currentYear
  );

  const dataToExport = {
    year: currentYear,
    expenses: filteredExpenses,
    incomes: filteredIncomes,
    envelopes,
  };

  const jsonData = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `budget_data_${currentYear}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
