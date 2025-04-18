import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const uri = process.env.MONGODB_URI || "mongodb+srv://admin1:Grierson1979.@cluster0.ia9rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update the URI as needed
const dbName = "chippie";

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}