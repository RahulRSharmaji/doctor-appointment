import dotenv from 'dotenv';
dotenv.config();
import mysql from "mysql2";

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'doctor_appointment'
});

db.connect((err) => {
    if (err) {
        console.error("Databse connection failed:", err);
    } else {
        console.log("Databse connected successfully.");
    }
});

export default db;