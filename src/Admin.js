import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Load users
  const loadUsers = () => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add student
  const addStudent = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        role: "student"
      })
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      setUsername("");
      setPassword("");
      loadUsers();
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* ADD STUDENT */}
      <div className="card">
        <h3>Add Student</h3>
        <form onSubmit={addStudent}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Add Student</button>
        </form>
      </div>

      {/* USERS LIST */}
      <div className="card">
        <h3>Registered Users</h3>

        {loading && <p>Loading...</p>}

        {!loading && users.length === 0 && <p>No users found</p>}

        {!loading && users.map((u, i) => (
          <div key={i} className="user-row">
            <b>{u.username}</b>
            <span>{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
