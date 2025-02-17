import { exportYearlyData, importYearlyData } from "@/app/utils/export";

export default function DataManagement() {
  return (
    <div className="data-management">
      <h2>Export & Import Data</h2>

      {/* Export Button */}
      <button onClick={exportYearlyData} className="export-btn">
        Export Yearly Data
      </button>

      {/* Import Button */}
      <input
        type="file"
        accept="application/json"
        onChange={(e) => {
          const file = e.target?.files?.[0]; // Ensure file is not null
          if (file) {
            importYearlyData(file);
          }
        }}
        className="import-btn"
      />
    </div>
  );
}