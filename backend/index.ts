import express from "express";
import { auth } from "firebase-admin";
import CookieParser from "cookie-parser";
import cors from "cors";

import { db } from "./firebase/db";
import { User } from "./types/models";

import AccountRouter from "./routes/account";
import GameRouter from "./routes/games";

const PORT = 3001;
const app = express();

app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(CookieParser());

app.use(async function(req, res, next) {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No authorization cookie found!" });

    try
    {
        req.client = await auth().verifyIdToken(token);
        req.user = db.get("users", () => {}, 1, req.client.uid)?.[0] as User;
    }
    catch (err)
    {
        if (req.method === "GET") next();

        console.error("Error verifying authorization cookie:", err);
        return res.status(401).json({ message: "Invalid authorization cookie." });
    }

    if (!req.client) return res.status(401).json({ message: "Invalid authorization cookie?" });
    next();
});

app.use("/account", AccountRouter);
app.use("/game", GameRouter);

app.listen(PORT, () => console.log("[SERVER] Listening on port", PORT));

export default app;
