import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Auth() {
  const navigate = useNavigate();

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      /*
        EXPECTED BACKEND RESPONSE:
        {
          message: "Login success",
          user: { name, email, id },
          token: "xxxxx"
        }
      */

      // ✅ SAVE ONLY USER OBJECT
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // optional token save
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("Logged in Successfully ✅");

      // redirect
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Email or Password ❌");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Account Created ✅ Please Login");

      // clear register fields
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">System Access & Registration</h2>

        <div className="auth-grid">
          {/* LOGIN */}
          <div className="auth-section">
            <h3>Login</h3>
            <p>Access your dashboard and historical data.</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button className="auth-btn">LOG IN</button>
            </form>

            <div className="auth-small">Forgot Password?</div>
          </div>

          {/* REGISTER */}
          <div className="auth-section">
            <h3>Register</h3>
            <p>New to SmartCane? Create your account.</p>

            <form onSubmit={handleRegister}>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Desired Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="auth-btn">CREATE ACCOUNT</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
