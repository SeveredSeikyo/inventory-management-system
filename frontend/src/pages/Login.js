import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            window.location = "/";
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page center">
            <form className="card form" onSubmit={submit}>
                <h2>Sign in</h2>

                {error && <div className="error">{error}</div>}

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <p style={{ marginTop: "1rem" }}>
                    Don’t have an account? <a href="/signup">Create one</a>
                </p>
            </form>
        </div>
    );
}
