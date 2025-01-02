"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../firebase/db");
const AccountRouter = (0, express_1.Router)();
AccountRouter.route("/login")
    .get(async function (req, res) {
    if (!req.client)
        return res.status(401).json({ message: "No authorization cookie found!!." });
    const { name, email, uid } = req.client;
    if (!req.user) {
        /** Save information about the user. */
        const user = {
            name: name,
            email: email,
            id: uid,
            games: []
        };
        await db_1.db.add("users", uid, user);
    }
    return res.status(200).json({ message: "Logged in successfully.", id: uid });
});
AccountRouter.route("/search/:name")
    .get(async function (req, res) {
    const { name } = req.params;
    let games = db_1.db.get("games", g => g.topic.toLowerCase().includes(name.toLowerCase()), 10)
        /** @ts-ignore */
        .map(g => (delete g.user.email, g));
    let users = db_1.db.get("users", u => u.name.toLowerCase().includes(name.toLowerCase()), 10)
        /** @ts-ignore */
        .map(u => (delete u.email, u));
    return res.status(200).json({ message: "Successfully retrieved users and games.", users, games });
});
AccountRouter.route("/profile/:id")
    .get(async function (req, res) {
    const { id } = req.params;
    const user = db_1.db.get("users", () => { }, 1, id)[0];
    if (!user)
        return res.status(404).json({ message: "Could not find user." });
    const games = user.games.map(g => db_1.db.get("games", () => { }, 1, g)[0])
        /** @ts-ignore */
        .map(g => (delete g.user.email, g));
    return res.status(200).json({
        message: "Successfully retrieved user.",
        name: user.name,
        games
    });
});
exports.default = AccountRouter;
