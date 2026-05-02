import { useEffect, useState, CSSProperties } from "react";

interface AdminSummary {
  totalUsers: number;
  totalVehicles: number;
  activeRoutes: number;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  route: string;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary>({
    totalUsers: 0,
    totalVehicles: 0,
    activeRoutes: 0,
  });

  const [drivers] = useState<Driver[]>([
    { id: 1, name: "Kasun Silva", phone: "0771234567", vehicle: "NB-1234" },
    { id: 2, name: "Nimal Perera", phone: "0779876543", vehicle: "NC-4567" },
  ]);

  const [students] = useState<Student[]>([
    { id: 1, name: "Ayesha Fernando", grade: "Grade 5", route: "Route A" },
    { id: 2, name: "Dilan Peris", grade: "Grade 3", route: "Route B" },
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/admin/summary`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin summary");
        }

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Error loading admin summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {summary.totalUsers}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Total Vehicles</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {summary.totalVehicles}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Active Routes</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {summary.activeRoutes}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Drivers</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "12px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Phone</th>
              <th style={tableHeaderStyle}>Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td style={tableCellStyle}>{driver.id}</td>
                <td style={tableCellStyle}>{driver.name}</td>
                <td style={tableCellStyle}>{driver.phone}</td>
                <td style={tableCellStyle}>{driver.vehicle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Students</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "12px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Grade</th>
              <th style={tableHeaderStyle}>Route</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={tableCellStyle}>{student.id}</td>
                <td style={tableCellStyle}>{student.name}</td>
                <td style={tableCellStyle}>{student.grade}</td>
                <td style={tableCellStyle}>{student.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeaderStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f1f1f1",
  textAlign: "left",
};

const tableCellStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};
