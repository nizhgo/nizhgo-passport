import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// Set up a new pool object using the environment variables
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

console.log("DB_USER: " + process.env.DB_USER);

// Test the connection to the database
pool.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error(err);
	} else {
		console.log(res.rows[0]);
	}
});

// Export the pool object so that it can be used to execute SQL queries
export default pool;
