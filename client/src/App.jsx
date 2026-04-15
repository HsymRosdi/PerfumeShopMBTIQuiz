import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import Cart from "./pages/Cart";
import Receipt from "./pages/Receipt";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import Mood from "./pages/Mood";
import AdminDashboard from "./admin/dashboard";
import AdminLogin from "./admin/login";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/unisex" element={<Unisex />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/receipt" element={<Receipt />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/results" element={<QuizResults />} />
      <Route path="/mood" element={<Mood />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;