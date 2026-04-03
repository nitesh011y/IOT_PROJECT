import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // save user & token
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // alert("Logged in Successfully ✅");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Email or Password ❌");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleLogin} className="auth-section">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn">LOG IN</button>
        </form>

        <p className="auth-small">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
