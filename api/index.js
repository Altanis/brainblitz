"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = require("firebase-admin");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./firebase/db");
const account_1 = __importDefault(require("./routes/account"));
const games_1 = __importDefault(require("./routes/games"));
const PORT = 3001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(async function (req, res, next) {
    const { token } = req.cookies;
    if (!token)
        return res.status(401).json({ message: "No authorization cookie found!" });
    try {
        req.client = await (0, firebase_admin_1.auth)().verifyIdToken(token);
        req.user = db_1.db.get("users", () => { }, 1, req.client.uid)?.[0];
    }
    catch (err) {
        if (req.method === "GET")
            next();
        console.error("Error verifying authorization cookie:", err);
        return res.status(401).json({ message: "Invalid authorization cookie." });
    }
    if (!req.client)
        return res.status(401).json({ message: "Invalid authorization cookie?" });
    next();
});
app.use("/account", account_1.default);
app.use("/game", games_1.default);
app.listen(PORT, () => console.log("[SERVER] Listening on port", PORT));
exports.default = app;
