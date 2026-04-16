import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { logoutUser } from "../services/authService";
import perfumes from "../data/perfume";

const ADMIN_EMAIL = "admin@perfumeshop.com"; // change this to your admin email

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminName, setAdminName] = useState("");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate("/admin/login"); return; }
      if (user.email !== ADMIN_EMAIL) { alert("Access denied. Admins only."); navigate("/"); return; }
      setAdminName(user.email);
      fetchData();
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const ratingsSnap = await getDocs(collection(db, "ratings"));
      setRatings(ratingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await logoutUser(); navigate("/login"); };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : "—";

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "placed": return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "processing": return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "delivered": return { backgroundColor: "#dcfce7", color: "#166534" };
      default: return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle} />
        <p style={{ color: "#c9a84c", marginTop: "16px" }}>Loading dashboard...</p>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "perfumes", icon: "🧴", label: "Perfumes" },
    { id: "ratings", icon: "⭐", label: "Ratings" },
  ];

  const pageTitles = {
    dashboard: ["Dashboard", "Welcome back, Admin"],
    orders: ["Orders", orders.length + " total orders"],
    users: ["Users", users.length + " registered users"],
    perfumes: ["Perfumes", perfumes.length + " perfumes in catalogue"],
    ratings: ["Ratings", ratings.length + " total ratings"],
  };

  return (
    <div style={layoutStyle}>

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={logoSectionStyle}>
          <span style={{ fontSize: "2rem" }}>🌸</span>
          <div>
            <div style={logoTitleStyle}>Perfume Shop</div>
            <div style={logoSubStyle}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                ...navItemStyle,
                backgroundColor: activeTab === id ? "rgba(201,168,76,0.12)" : "transparent",
                color: activeTab === id ? "#c9a84c" : "#9ca3af",
                borderLeft: activeTab === id ? "3px solid #c9a84c" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div style={sidebarFooterStyle}>
          <div style={{ fontSize: "11px", color: "#4b5563" }}>Logged in as</div>
          <div style={{ fontSize: "12px", color: "#c9a84c", marginTop: "2px" }}>{adminName}</div>
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={mainStyle}>

        {/* Top Bar */}
        <div style={topBarStyle}>
          <div>
            <h1 style={pageTitleStyle}>{pageTitles[activeTab][0]}</h1>
            <p style={pageSubStyle}>{pageTitles[activeTab][1]}</p>
          </div>
          <div style={adminBadgeStyle}>Admin</div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div style={statsGridStyle}>
              {[
                { label: "Total Orders", value: orders.length, sub: "All time" },
                { label: "Total Users", value: users.length, sub: "Registered" },
                { label: "Revenue", value: "£" + totalRevenue.toFixed(2), sub: "All time" },
                { label: "Avg Rating", value: avgRating, sub: ratings.length + " ratings" },
              ].map(({ label, value, sub }) => (
                <div key={label} style={statCardStyle}>
                  <div style={statLabelStyle}>{label}</div>
                  <div style={statValueStyle}>{value}</div>
                  <div style={statSubStyle}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={grid2Style}>
              <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Recent Orders</h3>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td style={tdStyle}>{order.customerName || "—"}</td>
                        <td style={tdStyle}>£{order.total || 0}</td>
                        <td style={tdStyle}>
                          <span style={{ ...badgeStyle, ...getStatusStyle(order.status) }}>
                            {order.status || "Placed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ ...tdStyle, color: "#9ca3af", textAlign: "center" }}>
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={cardStyle}>
                <h3 style={cardTitleStyle}>Recent Users</h3>
                {users.slice(0, 5).map(user => (
                  <div key={user.id} style={userRowStyle}>
                    <div style={avatarStyle}>{getInitials(user.fullName)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={userNameStyle}>{user.fullName || "Unknown"}</div>
                      <div style={userEmailStyle}>{user.email}</div>
                    </div>
                    <div style={userDateStyle}>{formatDate(user.createdAt)}</div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "13px" }}>No users yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>All Orders</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ ...tableStyle, minWidth: "700px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Items</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ ...tdStyle, fontSize: "11px", color: "#9ca3af" }}>#{order.id.slice(0, 8)}</td>
                      <td style={tdStyle}>{order.customerName || "—"}</td>
                      <td style={{ ...tdStyle, color: "#6b7280", fontSize: "12px" }}>{order.customerEmail || "—"}</td>
                      <td style={{ ...tdStyle, color: "#6b7280", fontSize: "12px" }}>
                        {order.items?.map(i => i.name + " x" + i.quantity).join(", ") || "—"}
                      </td>
                      <td style={tdStyle}>£{order.total || 0}</td>
                      <td style={{ ...tdStyle, color: "#6b7280", fontSize: "12px" }}>{formatDate(order.createdAt)}</td>
                      <td style={tdStyle}>
                        <span style={{ ...badgeStyle, ...getStatusStyle(order.status) }}>
                          {order.status || "Placed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ ...tdStyle, color: "#9ca3af", textAlign: "center" }}>
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>All Users</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>MBTI Type</th>
                  <th style={thStyle}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={avatarStyle}>{getInitials(user.fullName)}</div>
                        {user.fullName || "—"}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: "#6b7280" }}>{user.email}</td>
                    <td style={tdStyle}>
                      {user.mbtiType ? (
                        <span style={{ ...badgeStyle, backgroundColor: "#fef3c7", color: "#92400e" }}>
                          {user.mbtiType}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ ...tdStyle, color: "#6b7280" }}>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...tdStyle, color: "#9ca3af", textAlign: "center" }}>
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Perfumes Tab */}
        {activeTab === "perfumes" && (
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>All Perfumes</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Brand</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>MBTI Types</th>
                </tr>
              </thead>
              <tbody>
                {perfumes.map(perfume => (
                  <tr key={perfume.id}>
                    <td style={tdStyle}>{perfume.name}</td>
                    <td style={{ ...tdStyle, color: "#6b7280" }}>{perfume.brand}</td>
                    <td style={tdStyle}>
                      <span style={{ ...badgeStyle, backgroundColor: "#f3f4f6", color: "#374151" }}>
                        {perfume.category}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        backgroundColor: perfume.gender === "Male" ? "#dbeafe" : perfume.gender === "Female" ? "#fce7f3" : "#fef3c7",
                        color: perfume.gender === "Male" ? "#1e40af" : perfume.gender === "Female" ? "#9d174d" : "#92400e",
                      }}>
                        {perfume.gender}
                      </span>
                    </td>
                    <td style={tdStyle}>£{perfume.price}</td>
                    <td style={{ ...tdStyle, fontSize: "11px", color: "#6b7280" }}>
                      {perfume.mbtiTypes?.join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === "ratings" && (
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>All Ratings</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Perfume</th>
                  <th style={thStyle}>Rating</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>MBTI</th>
                  <th style={thStyle}>Mood</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(r => (
                  <tr key={r.id}>
                    <td style={tdStyle}>{r.perfumeName}</td>
                    <td style={tdStyle}>
                      <span style={{ color: "#c9a84c", fontWeight: "700", fontSize: "14px" }}>
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </span>
                      <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "6px" }}>
                        {r.rating}/5
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        ...badgeStyle,
                        backgroundColor: r.source === "quiz" ? "#dbeafe" : "#fce7f3",
                        color: r.source === "quiz" ? "#1e40af" : "#9d174d",
                      }}>
                        {r.source}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "#6b7280" }}>{r.mbtiType || "—"}</td>
                    <td style={{ ...tdStyle, color: "#6b7280", textTransform: "capitalize" }}>{r.moodSelected || "—"}</td>
                    <td style={{ ...tdStyle, color: "#6b7280", fontSize: "12px" }}>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ ...tdStyle, color: "#9ca3af", textAlign: "center" }}>
                      No ratings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
};

const layoutStyle = { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const sidebarStyle = { width: "220px", backgroundColor: "#0a0a0a", display: "flex", flexDirection: "column", padding: "24px 0", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 };
const logoSectionStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "0 20px 24px", borderBottom: "1px solid #1f2937", marginBottom: "12px" };
const logoTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "14px", fontWeight: "700", color: "#c9a84c" };
const logoSubStyle = { fontSize: "10px", color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase" };
const navItemStyle = { display: "flex", alignItems: "center", gap: "10px", padding: "11px 20px", fontSize: "13px", border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" };
const sidebarFooterStyle = { padding: "20px", borderTop: "1px solid #1f2937", marginTop: "auto" };
const logoutBtnStyle = { marginTop: "10px", width: "100%", padding: "8px", border: "1px solid #1f2937", borderRadius: "8px", backgroundColor: "transparent", color: "#9ca3af", cursor: "pointer", fontSize: "12px" };
const mainStyle = { marginLeft: "220px", padding: "32px 36px", flex: 1, backgroundColor: "#f9fafb", minHeight: "100vh" };
const topBarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" };
const pageTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 };
const pageSubStyle = { fontSize: "13px", color: "#6b7280", marginTop: "4px" };
const adminBadgeStyle = { backgroundColor: "rgba(201,168,76,0.12)", color: "#c9a84c", fontSize: "12px", padding: "6px 16px", borderRadius: "20px", border: "1px solid rgba(201,168,76,0.3)", fontWeight: "600" };
const statsGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" };
const statCardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
const statLabelStyle = { fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" };
const statValueStyle = { fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "#111827" };
const statSubStyle = { fontSize: "12px", color: "#c9a84c", marginTop: "6px", fontWeight: "500" };
const grid2Style = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const cardStyle = { backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" };
const cardTitleStyle = { fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "13px" };
const thStyle = { textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 0 10px" };
const tdStyle = { padding: "12px 0", color: "#111827", borderTop: "1px solid #f9fafb" };
const badgeStyle = { display: "inline-block", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" };
const userRowStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f9fafb" };
const avatarStyle = { width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", flexShrink: 0 };
const userNameStyle = { fontSize: "13px", fontWeight: "600", color: "#111827" };
const userEmailStyle = { fontSize: "12px", color: "#9ca3af" };
const userDateStyle = { fontSize: "12px", color: "#9ca3af", marginLeft: "auto" };
const loadingStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" };
const spinnerStyle = { width: "40px", height: "40px", border: "3px solid #1f2937", borderTop: "3px solid #c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" };

export default AdminDashboard;