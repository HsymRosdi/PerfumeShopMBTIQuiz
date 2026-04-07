import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import Cart from "./pages/Cart";

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
    </Routes>
  );
}

export default App;