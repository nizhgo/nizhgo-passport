import pool from "./database";

/** Migrate the database tables */

const migrate = async () => {
	console.log(' ▄▀▀▄ ▀▄  ▄▀▀█▀▄   ▄▀▀▀▀▄   ▄▀▀▄ ▄▄   ▄▀▀▀▀▄    ▄▀▀▀▀▄  \n'
		+ '█  █ █ █ █   █  █ █     ▄▀ █  █   ▄▀ █         █      █ \n'
		+ '▐  █  ▀█ ▐   █  ▐ ▐ ▄▄▀▀   ▐  █▄▄▄█  █    ▀▄▄  █      █ \n'
		+ '  █   █      █      █         █   █  █     █ █ ▀▄    ▄▀ \n'
		+ '▄▀   █    ▄▀▀▀▀▀▄    ▀▄▄▄▄▀  ▄▀  ▄▀  ▐▀▄▄▄▄▀ ▐   ▀▀▀▀   \n'
		+ '█    ▐   █       █       ▐  █   █    ▐                  \n'
		+ '▐        ▐       ▐          ▐   ▐                       \n'
		+ 'DATABASE MIGRATION TOOL 0.0.1')


	console.log('\nMigrating database...');
	console.log('\n[1/2] Creating users table...');

	/** Create the users table */
	try {
		const result = await pool.query(
			`CREATE TABLE IF NOT EXISTS public.users
(
    uid text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    salt text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_disabled boolean NOT NULL
);`
		);
		//console.log(result);
	}
	catch (error) {
		console.error('\nError creating users table: ', error);
	}

	console.log('\n[2/2] Creating refresh_tokens table...');

	/** Create the refresh_tokens table */
	try {
		const result = await pool.query(`
		CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    id SERIAL PRIMARY KEY,
    user_uid character varying(255) COLLATE pg_catalog."default" NOT NULL,
    token character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    disabled_at timestamp without time zone,
    browser character varying(255) COLLATE pg_catalog."default" NOT NULL,
    device character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_disabled boolean DEFAULT false,
    disable_reason character varying(255) COLLATE pg_catalog."default",
    last_used_at timestamp without time zone
);

		`
		);
	}
	catch (error) {
		console.error('\x1b[31m%s\x1b[0m', '\nError creating refresh_tokens table: ', error);
		throw error;
	}
};

migrate()
	.then(r => console.log('\x1b[32m%s\x1b[0m', '\nMigration complete! :-))'))
	.catch(e => console.error('\x1b[31m%s\x1b[0m', '\nMigration failed: ', e));






