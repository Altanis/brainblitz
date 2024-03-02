"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.db = void 0;
const config_1 = require("./config");
/** A wrapper around Firestore. */
class Database {
    collections = ["users", "games"];
    users = new Map();
    games = new Map();
    constructor() {
        this.retreiveCollections();
        setInterval(() => this.retreiveCollections(), 1000 * 60 * 5);
    }
    ;
    /** Retreives the collections from Firestore. */
    async retreiveCollections() {
        for (const c of this.collections) {
            config_1.db.collection(c).get().then((snapshot) => 
            /** @ts-ignore */
            snapshot.forEach((doc) => this[c].set(doc.id, doc.data())));
        }
        ;
    }
    ;
    /** Gets an entry from the database. */
    get(collection, filter, num = 1, id) {
        /** @ts-ignore */
        if (id)
            return [this[collection].get(id)];
        else {
            // WARNING!!!! AN ATROCITY TO PERFORMANCE IS UNDERWAY
            // PLEASE AVOID LOOKING AT THIS CODE DUE TO POSSIBLE EYE BLEEDING
            // THANK YOU
            /** @ts-ignore */
            return [...this[collection].values()].filter(filter).slice(0, num);
        }
    }
    ;
    /** Adds an entry to the database. */
    async add(collection, id, data) {
        /** @ts-ignore */
        this[collection].set(id, data);
        /** @ts-ignore */
        return await config_1.db.collection(collection).doc(id).set(data);
    }
    ;
    /** Updates an entry in the database. */
    async update(collection, id, data) {
        /** @ts-ignore */
        this[collection].set(id, data);
        /** @ts-ignore */
        return await config_1.db.collection(collection).doc(id).update(data);
    }
    ;
    /** Generates an ID for an entry. */
    generateID(collection) {
        return config_1.db.collection(collection).doc().id;
    }
}
exports.Database = Database;
;
const db = new Database();
exports.db = db;
