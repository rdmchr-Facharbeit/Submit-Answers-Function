import { RSA_NO_PADDING } from 'constants';
import { Client, Database } from 'node-appwrite';
import {Data, User} from './types'

// initialise the client SDK
let client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

//initialise the database SDK
const db = new Database(client);

const data = JSON.parse(process.env.APPWRITE_FUNCTION_DATA);
const dataCollection = process.env.APPWRITE_DATA_COLLECTION;
const usersCollection = process.env.APPWRITE_USERS_COLLECTION;

const userId = process.env.APPWRITE_FUNCTION_USER_ID;
let rating = data.rating;


async function run() {
    // get user doc
    const userDoc: User = await db.listDocuments(usersCollection, [`userId=${userId}`]).then((res) => {
        return res.documents[0] as User;
    });

    if (!userDoc) {
        console.error(`User ${userId} does not have a user document.`);
        process.exit(2);
        return;
    }

    // check if user has already finished the survey
    if (userDoc.finished) {
        console.error(`User already locked their answers.`);
        process.exit(3)
        return;
    }

    rating = parseInt(rating);
    if (rating ) {
    }

    // set rating
    await db.updateDocument(usersCollection, userDoc.$id, {
        finished: true,
        finishedAt: new Date().getDate,
        rating,
    }).catch((err) => {
        console.error(`Could not update users doc for user ${userId}`);
        console.error(err);
        process.exit(5);
    });

    // lock data document
    await db.updateDocument(dataCollection, userDoc.data, {}, [`userId=${userId}`], []).catch((err) => {
        console.error(`Could not lock data document.`);
        console.error(err);
        process.exit(5);
    });

}

run();
