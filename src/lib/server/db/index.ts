import Database from "better-sqlite3";
import { DB_PATH } from '$env/static/private'

const db = new Database(DB_PATH, { verbose: console.log })
