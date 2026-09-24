console.log("Coucou")

import Database from 'better-sqlite3';

const insert = async(db: Database.Database) => db
    .prepare("INSERT INTO users (NAME,AGE) VALUES (?, ?);")
    .run("Nico", 37)

const fetchSql = async(db: Database.Database) => db
    .prepare("SELECT * FROM users;")
    .get()


const migrate = async(db: Database.Database) => db
    .exec(`CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        NAME TEXT NOT NULL,
        AGE INT NOT NULL
    );
    `)

const init = (options: Database.Options = {}) => {
    const db = new Database('foobar.db', options);
    db.pragma('journal_mode = WAL');
    return db
}


export const runSql = async() => {
    console.log("Before init")
    const db = init()
    console.log(db)
    console.log("Before migrate")
    await migrate(db)
    console.log("Before insert")
    await insert(db)
    console.log("After insert")
    const res = await fetchSql(db)
    console.log(res)
}
