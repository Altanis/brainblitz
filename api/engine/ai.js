"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = exports.SYSTEM_INSTRUCTION = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = require("openai");
const db_1 = require("../firebase/db");
exports.SYSTEM_INSTRUCTION = `
Your name is Assistant. You are a chatbot that helps students study for their exams.
You are currently in a conversation with a student. Your goal is to help them study for their exam.
You can do this by asking them questions about the topic they are studying.

The topic they are studying is: {{topic}}.
They request for a {{difficulty}} difficulty exam, at an education level of {{education}}.
Generate a mix of conceptual and applied concepts.

Do not give generic questions, such as "what is the definition of <x>". Give sophisticated and thought out questions.

When you ask a question, make sure to precede the question with and only with "Question:".
When you say anything else, make sure to precede the response with and only with "Response:".
When you rate out of 10, make sure to precede the rating with "Rating:".

When the student replies to a question, rate their answer out of 10 points. Give a description as to what they did well and what they can improve on.
Be generous to answers which are generally correct, and harsh to answers which are not correct. 
If it is wrong or incomplete, make the rating between 0-2. If it is wrong but the reasoning is acceptable, vary it in between 2-8. If the answer is right, give it a 9-10.

Make each question worth 10 points.
Ensure that every message you make has a question in it, and every message after your first one has a rating and response and a question.

Ask a mix of conceptual and applied questions. Make sure to ask questions that are relevant to the topic and difficulty level.

This marks the start of the conversation.
Assistant [asks a question]:`;
/** A wrapper around GPT 3.5 to parse and analyze completion results. */
class AIEngine {
    /** The OpenAI model. */
    model = "gpt-3.5-turbo";
    /** The API to query for completions. */
    api = new openai_1.OpenAIApi(new openai_1.Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    }));
    /** The database to continuously store the conversation in. */
    db = db_1.db;
    /** Generate a response to the current conversation. */
    async generateResponse(game) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                rej("An error occured while generating a response. Please try again later.");
            }, 10_000);
            this.api.createChatCompletion({
                model: this.model,
                messages: game.interaction
                    .map(({ role, content }) => {
                    return { role, content };
                }),
                temperature: 1,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            })
                .then(async (reply) => {
                const { choices } = reply.data;
                let message = choices[0].message?.content;
                if (!message)
                    return rej("An error occurred while generating a response. Please try again later.");
                const { rating, response, question } = this.parseResponse(message, !game.answeredQuestions);
                if (rating >= 0)
                    game.rating += rating;
                if (rating >= 5)
                    game.correctQuestions++;
                game.finished = ++game.answeredQuestions >= game.totalQuestions;
                game.interaction.push({ role: "assistant", content: message, parsed: { rating, response, question: game.finished ? "" : question } });
                if (game.finished) {
                    game.interaction.push({ role: "assistant", content: "The game has finished. Thank you for playing." });
                    game.interaction.push({ role: "user", content: "Thank you for studying with me. Could you please give me recommendations on what I should study? Use our conversation to observe my weak points in my knowledge of this topic." });
                    const test = await this.api.createChatCompletion({
                        model: this.model,
                        messages: game.interaction
                            .map(({ role, content }) => {
                            return { role, content };
                        }),
                        temperature: 1,
                        max_tokens: 1000,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                    });
                    const { choices } = test.data;
                    let m = choices[0].message?.content;
                    if (m)
                        game.interaction.push({ role: "assistant", content: m });
                    console.log(m);
                }
                this.db.update("games", game.id, game);
                res({ message, rating, response, question: game.finished ? "" : question });
            })
                .catch(err => {
                console.error(err);
                rej("An error occurred while generating a response. Please try again later.");
            });
        });
    }
    ;
    /** Parses a response into a rating, response, and question. */
    parseResponse(reply, implicitQuestion = false) {
        let rating = -1;
        let response = "";
        let question = "";
        console.log(reply);
        const lines = reply.split("\n");
        for (const line of lines) {
            if (line.toLowerCase().startsWith("rating:")) {
                const ratingString = line.split(":")[1].trim();
                rating = parseInt(ratingString.split("/")[0]);
            }
            else if (line.toLowerCase().startsWith("question:")) {
                question = line.split(":")[1].trim();
            }
            else if (line.toLowerCase().startsWith("response:")) {
                response += line.split(":")[1].trim() + "\n";
            }
            else {
                if (implicitQuestion)
                    question += line.trim() + "\n";
                else
                    response += line.trim() + "\n";
            }
        }
        ;
        return { rating, response, question };
    }
    ;
}
;
exports.ai = new AIEngine();
