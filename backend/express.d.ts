import { auth } from "firebase-admin";
import { User } from "./types/models";

interface Client extends auth.DecodedIdToken 
{};

declare global
{
    namespace Express
    {
        interface Request
        {
            /** The client as authorized by Firebase. */
            client?: Client;
            /** The user stored and associated with the client. */
            user?: User;
        };
    };
};