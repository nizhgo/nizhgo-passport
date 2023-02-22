import dotenv from "dotenv";
import {Pool} from "pg";

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

console.log("DB_USER: " + process.env.DB_USER);

pool.query('SELECT NOW()', (err, res) => {
	if (err) {
		console.error(err);
	}
	else {
		console.log(res.rows[0]);
	}
});

export default pool;

