import { db as database } from "./config";
import { User, Game } from "../types/models";

/** A wrapper around Firestore. */
class Database
{
    private collections = ["users", "games"];
    private users: 
        Map<string, FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>> 
        = new Map();
    private games:
        Map<string, FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>>
        = new Map();

    constructor()
    {
        this.retreiveCollections();
        setInterval(() => this.retreiveCollections(), 1000 * 60 * 5);
    };

    /** Retreives the collections from Firestore. */
    private async retreiveCollections(): Promise<void>
    {
        for (const c of this.collections)
        {
            database.collection(c).get().then((snapshot) =>
                /** @ts-ignore */
                snapshot.forEach((doc) => this[c].set(doc.id, doc.data()))
            );
        };
    };

    /** Gets an entry from the database. */
    public get(
        collection: string, 
        filter: (entry: any) => any, 
        num = 1, 
        id?: string
    ): (User | Game)[]
    {
        /** @ts-ignore */
        if (id) return [this[collection].get(id)];
        else {
            // WARNING!!!! AN ATROCITY TO PERFORMANCE IS UNDERWAY
            // PLEASE AVOID LOOKING AT THIS CODE DUE TO POSSIBLE EYE BLEEDING
            // THANK YOU

            /** @ts-ignore */
            return [...this[collection].values()].filter(filter).slice(0, num) as (User | Game)[];
        }
    };

    /** Adds an entry to the database. */
    public async add(collection: string, id: string, data: User | Game): Promise<FirebaseFirestore.WriteResult>
    {
        /** @ts-ignore */
        this[collection].set(id, data);
        /** @ts-ignore */
        return await database.collection(collection).doc(id).set(data);
    };

    /** Updates an entry in the database. */
    public async update(collection: string, id: string, data: User | Game): Promise<FirebaseFirestore.WriteResult>
    {
        /** @ts-ignore */
        this[collection].set(id, data);
        /** @ts-ignore */
        return await database.collection(collection).doc(id).update(data);
    };

    /** Generates an ID for an entry. */
    public generateID(collection: string): string
    {
        return database.collection(collection).doc().id;
    }
};

const db = new Database();
export { db, Database };