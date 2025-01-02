import { Router } from "express";
import { Game, User } from "../types/models";
import { db } from "../firebase/db";
import { SYSTEM_INSTRUCTION, ai } from "../engine/ai";

const GameRouter = Router();

GameRouter.route("/create")
    .post(async function(req, res) {
        const { topic, difficulty, educationLevel, totalQuestions } = req.body;
        let { uid } = req.client!;

        if (!topic || ![0, 1, 2].includes(difficulty) || !totalQuestions) return res.status(400).json({ message: "Missing required fields." });
        if (totalQuestions < 1 || totalQuestions > 10) return res.status(400).json({ message: "Invalid number of questions." });
        if (topic.length > 50) return res.status(400).json({ message: "Topic is too long." });
        
        const gameID = db.generateID("games");

        const user = db.get("users", () => {}, 1, uid)[0] as User;
        if (!user) return res.status(404).json({ message: "Could not find user." });
        const existingGames = user.games.map(g => db.get("games", () => {}, 1, g)[0] as Game);
        console.log(existingGames);
        if (existingGames.filter(g => !g.finished).length) return res.status(400).json({ message: "You already have an unfinished game." });

        const instruction = SYSTEM_INSTRUCTION
            .replace("{{topic}}", topic)
            .replace("{{difficulty}}", difficulty == 0 ? "easy" : (difficulty == 1 ? "medium" : "hard"))
            .replace("{{education}}", educationLevel == 0 ? "middle school" : (educationLevel == 1 ? "high school" : (educationLevel == 2 ? "AP" : "college")))

        const game: Game = {
            topic,
            difficulty,
            education: educationLevel,
            totalQuestions,
            rating: 0,
            correctQuestions: 0,
            answeredQuestions: -1,
            finished: false,
            id: gameID,
            user,
            timestamp: Date.now(),
            interaction: [{ role: "system", content: instruction }]
        };

        await db.add("games", gameID, game);

        user.games.push(gameID);
        await db.update("users", uid, user);

        ai.generateResponse(game)
            .then(() => res.status(200).json({ message: "Successfully created game.", id: gameID }))
            .catch(err => console.error("Failed to generate response:", err));
    });

GameRouter.route("/info/:id")
    .get(async function(req, res) {
        const { id } = req.params;

        const game = db.get("games", () => {}, 1, id)[0] as Game;
        if (!game) return res.status(404).json({ message: "Could not find game." });

        return res.status(200).json({
            message: "Successfully retrieved game info.",
            game: {
                id: game.id,
                topic: game.topic,
                difficulty: game.difficulty,
                totalQuestions: game.totalQuestions,
                answeredQuestions: game.answeredQuestions,
                rating: game.rating,
                correctQuestions: game.correctQuestions,
                finished: game.finished,
                timestamp: game.timestamp,
                interaction: game.interaction.slice(1),
                user: {
                    id: game.user.id,
                    name: game.user.name,
                    games: game.user.games
                }
            }
        });
    });

GameRouter.route("/answer/:id")
    .post(async function(req, res) {
        const { id } = req.params;
        const { answer } = req.body;

        if (!answer) return res.status(400).json({ message: "Missing required fields." });

        const game = db.get("games", () => {}, 1, id)[0] as Game;
        if (!game) return res.status(404).json({ message: "Could not find game." });
        if (game.finished) return res.status(400).json({ message: "Game is already finished." });
        if (game.interaction[game.interaction.length - 1].role !== "assistant") return res.status(400).json({ message: "It is not your turn to answer." });
        if (req.user?.id !== game.user.id) return res.status(400).json({ message: "You are not the owner of this game." });
        if (answer.length > (200 * (game.difficulty + 1))) return res.status(400).json({ message: "The length of your answer is too long." });

        game.interaction.push({ role: "user", content: answer });

        ai.generateResponse(game)
            .then(reply => {
                const { rating, response, question } = 
                    (reply as { message: string, rating: number, response: string, question: string });

                return res.status(200).json({
                    message: "Successfully generated response.", 
                    rating, 
                    response,
                    question, 
                    finished: game.finished,
                    totalRating: game.rating,
                    correctQuestions: game.correctQuestions
                });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ message: "An error occurred while generating a response. Please try again later." });
            });
    });

export default GameRouter;