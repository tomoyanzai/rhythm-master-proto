import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

let db = null;

export async function openDb() {
  if (!db) {
    try {
      const dbPath = path.resolve(process.cwd(), "rhythm_game.sqlite");
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      await db.exec(`
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          score INTEGER NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Database connected and initialized successfully");
    } catch (error) {
      console.error("Error opening database:", error);
      throw error;
    }
  }
  return db;
}
