import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("LL");
  const [customers, setCustomers] = useState([]);

  // ✅ Your LIVE backend URL
  const API = "https://rto-backend-y943.onrender.com";

  // Add customer
  const addCustomer = async () => {
    if (!name || !phone) {
      alert("Enter name and phone");
      return;
    }

    await axios.post(`${API}/add`, {
      name,
      phone,
      service,
      status: "Pending"
    });

    setName("");
    setPhone("");
    fetchCustomers();
  };

  // Fetch customers
  const fetchCustomers = async () => {
    const res = await axios.get(`${API}/customers`);
    setCustomers(res.data);
  };

  // Update status
  const updateStatus = async (id) => {
    await axios.put(`${API}/update/${id}`, {
      status: "Completed"
    });
    fetchCustomers();
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    await axios.delete(`${API}/delete/${id}`);
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>RTO Dashboard</h2>

      <h3>Total: {customers.length}</h3>
      <h3>Pending: {customers.filter(c => c.status === "Pending").length}</h3>
      <h3>Completed: {customers.filter(c => c.status === "Completed").length}</h3>

      <br />

      <input
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Enter Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <select value={service} onChange={(e) => setService(e.target.value)}>
        <option value="LL">LL</option>
        <option value="DL">DL</option>
      </select>

      <button onClick={addCustomer}>Add</button>

      <h3>Customers</h3>

      {customers.map((c) => (
        <div key={c._id} style={{ marginBottom: 10 }}>
          {c.name} | {c.phone} | {c.service} |{" "}
          <span style={{ color: c.status === "Completed" ? "green" : "red" }}>
            {c.status}
          </span>

          {c.status === "Pending" && (
            <button onClick={() => updateStatus(c._id)}>
              Complete
            </button>
          )}

          <button onClick={() => deleteCustomer(c._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;