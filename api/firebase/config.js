"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.app = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const service_1 = __importDefault(require("../service"));
const config = {
    credential: firebase_admin_1.default.credential.cert(service_1.default),
    apiKey: "AIzaSyCMbR5rMpr2fVjd7s4rEaauQMt-r7f4ISo",
    authDomain: "studybuddy-a6111.firebaseapp.com",
    projectId: "studybuddy-a6111",
    storageBucket: "studybuddy-a6111.appspot.com",
    messagingSenderId: "997772462483",
    appId: "1:997772462483:web:313fea796626ad0e49c066",
    measurementId: "G-BV2FQN8RDC"
};
const app = firebase_admin_1.default.initializeApp(config);
exports.app = app;
const db = app.firestore();
exports.db = db;
