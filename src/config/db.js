import mysql2 from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "sanjeev8825171882",
    database: process.env.DB_NAME || "ahar",
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true
});

export const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Database Connection Successful!");
        connection.release();
    } catch (error) {
        console.error("❌ Error Connecting to Database:", error);
        throw error;
    }
};

export const query = async (sql, params) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (error) {
        console.error("❌ Database Query Error:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// ✅ Ensure named exports are correct
export { pool };
