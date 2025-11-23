import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Signup() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(email, password);
            window.location = "/";
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page center">
            <form className="card form" onSubmit={submit}>
                <h2>Create Account</h2>

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
                    {loading ? "Creating..." : "Signup"}
                </button>

                <p style={{ marginTop: "1rem" }}>
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </form>
        </div>
    );
}
