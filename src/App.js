import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function App() {
  const API = "https://rto-backend-y943.onrender.com";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("LL");
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("All");
  const [customers, setCustomers] = useState([]);

  const authHeaders = {
    headers: {
      Authorization: token
    }
  };

  const registerUser = async () => {
    try {
      const res = await axios.post(`${API}/register`, { email, password });
      alert(res.data);
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Registration failed");
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Login failed");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    setCustomers([]);
  };

  const fetchCustomers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API}/customers`, {
        headers: {
          Authorization: token
        }
      });
      setCustomers(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Fetch failed");
    }
  }, [token, API]);

  const addCustomer = async () => {
    if (!name || !phone) {
      alert("Enter name and phone");
      return;
    }

    try {
      await axios.post(
        `${API}/add`,
        { name, phone, service, status: "Pending" },
        authHeaders
      );

      setName("");
      setPhone("");
      setService("LL");
      fetchCustomers();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Add failed");
    }
  };

  const updateStatus = async (id) => {
    try {
      await axios.put(
        `${API}/update/${id}`,
        { status: "Completed" },
        authHeaders
      );
      fetchCustomers();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Update failed");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`, authHeaders);
      fetchCustomers();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert(err.response?.data || "Delete failed");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);

    const matchesService =
      filterService === "All" ? true : c.service === filterService;

    return matchesSearch && matchesService;
  });

  const pendingCount = customers.filter((c) => c.status === "Pending").length;
  const completedCount = customers.filter(
    (c) => c.status === "Completed"
  ).length;

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f7fb",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            width: "350px",
            background: "#fff",
            padding: "30px",
            borderRadius: "14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>RTO Login</h2>

          <input
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button onClick={loginUser} style={primaryButton}>
            Login
          </button>

          <button onClick={registerUser} style={secondaryButton}>
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <h1 style={{ color: "#1f2937" }}>RTO Management Dashboard</h1>
          <button onClick={logoutUser} style={secondaryButtonTop}>
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "30px"
          }}
        >
          <div style={cardBlue}>
            <h3>Total</h3>
            <h2>{customers.length}</h2>
          </div>
          <div style={cardRed}>
            <h3>Pending</h3>
            <h2>{pendingCount}</h2>
          </div>
          <div style={cardGreen}>
            <h3>Completed</h3>
            <h2>{completedCount}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Enter Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={inputStyle}
          >
            <option value="LL">LL</option>
            <option value="DL">DL</option>
          </select>

          <button onClick={addCustomer} style={primaryButton}>
            Add
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Services</option>
            <option value="LL">LL</option>
            <option value="DL">DL</option>
          </select>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c._id}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.phone}</td>
                <td style={tdStyle}>{c.service}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      color: c.status === "Completed" ? "green" : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {c.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(c._id)}
                      style={{ ...completeButton, marginRight: "8px" }}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteCustomer(c._id)}
                    style={dangerButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="5" style={tdStyle}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  width: "100%",
  boxSizing: "border-box"
};

const primaryButton = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
};

const secondaryButton = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
  marginTop: "10px"
};

const secondaryButtonTop = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold"
};

const completeButton = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold"
};

const dangerButton = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold"
};

const cardBlue = {
  background: "#e0f2fe",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center"
};

const cardRed = {
  background: "#fee2e2",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center"
};

const cardGreen = {
  background: "#dcfce7",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center"
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e5e7eb"
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb"
};

export default App;