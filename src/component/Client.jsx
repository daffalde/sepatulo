import { Account, Avatars, Client, Databases, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
const avatar = new Avatars(client);
export { client, databases, account, storage, avatar };
