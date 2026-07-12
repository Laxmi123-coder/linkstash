import { useState } from "react";

function AuthForm({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "login") {
      onLogin(email, password);
    } else {
      onRegister(email, password);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>LinkStash</h1>
        <p>{mode === "login" ? "Log in to your account" : "Create a new account"}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
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
            minLength={6}
          />
          <button type="submit">
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ marginTop: "12px", background: "transparent", border: "none", color: "#3d8b82", textDecoration: "underline" }}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;