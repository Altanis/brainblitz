import dotenv from "dotenv";
dotenv.config();

export default JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString());