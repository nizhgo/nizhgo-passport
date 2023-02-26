import pool from './database';

const greenColor = '\x1b[32m%s\x1b[0m';
const redColor = '\x1b[31m%s\x1b[0m';
const version = 'v0.0.2';

const consoleLog = (message: string, color?: string) => {
	color ? console.log(color, message) : console.log(message);
}

const errorLog = (message: string, color?: string) => {
	color ? console.error(color, message) : console.error(message);
}

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS public.users (
    uid TEXT COLLATE pg_catalog."default" NOT NULL,
    username TEXT COLLATE pg_catalog."default" NOT NULL,
    email TEXT COLLATE pg_catalog."default" NOT NULL,
    password_hash TEXT COLLATE pg_catalog."default" NOT NULL,
    salt TEXT COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_disabled BOOLEAN NOT NULL
  );
`;

const createRefreshTokensTable = `
  CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_uid CHARACTER VARYING(255) COLLATE pg_catalog."default" NOT NULL,
    token CHARACTER VARYING(255) COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    disabled_at TIMESTAMP WITHOUT TIME ZONE,
    browser CHARACTER VARYING(255) COLLATE pg_catalog."default" NOT NULL,
    device CHARACTER VARYING(255) COLLATE pg_catalog."default" NOT NULL,
    is_disabled BOOLEAN DEFAULT false,
    disable_reason CHARACTER VARYING(255) COLLATE pg_catalog."default",
    last_used_at TIMESTAMP WITHOUT TIME ZONE
  );
`;

const migrate = async () => {
	console.info(
		' ▄▀▀▄ ▀▄  ▄▀▀█▀▄   ▄▀▀▀▀▄   ▄▀▀▄ ▄▄   ▄▀▀▀▀▄    ▄▀▀▀▀▄  \n' +
		'█  █ █ █ █   █  █ █     ▄▀ █  █   ▄▀ █         █      █ \n' +
		'▐  █  ▀█ ▐   █  ▐ ▐ ▄▄▀▀   ▐  █▄▄▄█  █    ▀▄▄  █      █ \n' +
		'  █   █      █      █         █   █  █     █ █ ▀▄    ▄▀ \n' +
		'▄▀   █    ▄▀▀▀▀▀▄    ▀▄▄▄▄▀  ▄▀  ▄▀  ▐▀▄▄▄▄▀ ▐   ▀▀▀▀   \n' +
		'█    ▐   █       █       ▐  █   █    ▐                  \n' +
		'▐        ▐       ▐          ▐   ▐                       \n' +
		'AUTH-SERVICE DATABASE MIGRATION TOOL \n' +
		`Version: ${version} \n` +
		'==================================== \n'
	);

	consoleLog('[1/3] Connecting to database...');
	try {
		await pool.query('SELECT NOW()');
		consoleLog('Successfully connected to database!', greenColor);
	}
	catch (error) {
		errorLog('Failed to connect to database!', redColor);
		process.exit(1);
	}

	consoleLog('Creating tables...');
	consoleLog('[2/3] Creating users table...');
	try {
		await pool.query(createUsersTable);
		consoleLog('Users table created!', greenColor);
	}
	catch (error) {
		errorLog('Failed to create users table!', redColor);
		process.exit(1);
	}

	consoleLog('[3/3] Creating refresh_tokens table...');
	try {
		await pool.query(createRefreshTokensTable);
		consoleLog('Refresh tokens table created!', greenColor);
	}
	catch (error) {
		errorLog('Failed to create refresh tokens table!', redColor);
		process.exit(1);
	}

	consoleLog('='.repeat(32));
	consoleLog('\n｡◕‿‿◕｡ Mission complete! ｡◕‿‿◕｡\n', greenColor);
	consoleLog('='.repeat(32));
}

migrate().then(() => {
		process.exit(0);
	}
);






