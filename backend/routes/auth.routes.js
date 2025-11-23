const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../models/db');
const authValidator = require('../utils/auth.validator.js');

const authRouter = express.Router();

const createToken = (email) => {
    const token = jwt.sign(
                    { email: email },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );
    return token;
}

authRouter.post("/auth/register", authValidator, (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {

        if (err) return res.status(500).json({ error: "Database error" });

        if (user) {
            return res.status(400).json({ error: "Email already registered" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: "Hashing error" });

            db.run(
                "INSERT INTO users (email, password) VALUES (?, ?)",
                [email, hash],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Insert failed" });
                    }

                    const token = createToken(email);

                    return res.json(
                        { 
                            message: "User created Successfully",
                            token: token
                        });
                }
            );
        });
    });
});


authRouter.post("/auth/login", authValidator, (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password, (err, valid) => {
            if (err) return res.status(500).json({ error: "Compare error" });

            if (!valid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = createToken(email)

            return res.json({ token });
        });
    });
});

module.exports = authRouter;
