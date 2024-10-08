const dev = {
	app: {
		port: process.env.DEV_APP_PORT,
	},
	db: {
		host: process.env.DEV_DB_HOST, //localhost
		port: process.env.DEV_DB_PORT, //
		name: process.env.DEV_DB_NAME,
	},
};

const pro = {
	app: {
		port: process.env.PRO_APP_PORT,
	},
	db: {
		host: process.env.PRO_DB_HOST, //localhost
		port: process.env.PRO_DB_PORT, //
		name: process.env.PRO_DB_NAME,
	},
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
console.log("Environment: ", env);
console.log("Configuration: ", config[env]);

if (!config[env]) {
	throw new Error(`Configuration for environment ${env} is not defined.`);
}

module.exports = config[env];
