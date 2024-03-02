/** An interface representing a conversation between AI and the user. */
export interface Conversation
{
    role: "system" | "user" | "assistant";
    content: string;
    parsed?: {
        rating: number;
        response: string;
        question: string;
    };
}

/** An enum representing the difficulties of a game. */
export enum Difficulties
{
    Easy,
    Medium,
    Hard
};

/** An enum representing the education levels of a game. */
export enum EducationLevel
{
    MiddleSchool,
    HighSchool,
    AP,
    College
};

/** A registered user within the database. */
export interface User
{
    /** The name of the user. */
    name: string;
    /** The user's email address. */
    email: string;
    /** The ID of the user. */
    id: string;
    /** The different games they have played. */
    games: string[];
};

/** A game that a user has played. */
export interface Game
{
    /** The ID of the game. */
    id: string;
    /** The topic of the game. */
    topic: string;
    /** The difficulty of the game. */
    difficulty: Difficulties;
    /** The education level. */
    education: EducationLevel;
    /** The number of questions in total to be asked by the AI. */
    totalQuestions: number;
    /** The number of questions the user has answered correctly. */
    correctQuestions: number;
    /** The total rating the user has gotten. */
    rating: number;
    /** The number of questions answered. */
    answeredQuestions: number;
    /** Whether or not the game is finished. */
    finished: boolean;
    /** The user who initiated the game. */
    user: User;
    /** The timestamp the game was created. */
    timestamp: number;
    /** The interaction between the AI and the chatbot. */
    interaction: Conversation[];
};