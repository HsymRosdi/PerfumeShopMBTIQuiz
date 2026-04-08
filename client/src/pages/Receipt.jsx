import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Receipt = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fffafc",
          color: "#111827",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Navbar loggedIn={false} userName="" onLogout={() => {}} />

        <section style={{ padding: "60px 20px", textAlign: "center" }}>
          <h1>Receipt not found</h1>
          <p style={{ color: "#6b7280" }}>
            No order information is available.
          </p>
          <Link to="/">
            <button style={buttonStyle}>Back to Home</button>
          </Link>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fffafc",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Navbar loggedIn={false} userName="" onLogout={() => {}} />

      <section
        style={{
          padding: "50px 40px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            marginBottom: "10px",
          }}
        >
          Order Receipt
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Thank you for your purchase.
        </p>

        <div style={cardStyle}>
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Name:</strong> {orderData.customerName}
          </p>
          <p>
            <strong>Email:</strong> {orderData.customerEmail}
          </p>
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
        </div>

        <h2 style={{ marginTop: "30px", marginBottom: "20px" }}>Items</h2>

        {orderData.items.map((item) => (
          <div key={item.id} style={itemStyle}>
            <img src={item.image} alt={item.name} style={imageStyle} />

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "8px" }}>{item.name}</h3>
              <p style={{ color: "#6b7280", marginBottom: "8px" }}>
                {item.brand}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>

            <div style={{ fontWeight: "700" }}>
              £{item.price * item.quantity}
            </div>
          </div>
        ))}

        <div style={{ textAlign: "right", marginTop: "30px" }}>
          <h2>Total: £{orderData.total}</h2>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/">
            <button style={buttonStyle}>Continue Shopping</button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  lineHeight: "1.8",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const imageStyle = {
  width: "90px",
  height: "90px",
  objectFit: "cover",
  borderRadius: "12px",
};

const buttonStyle = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#111827",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};

export default Receipt;