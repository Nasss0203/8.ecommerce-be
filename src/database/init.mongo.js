const mongoose = require("mongoose");

const { countConnect } = require("../helpers/check.connect");
const {
	db: { host, name, port },
} = require("../configs/mongodb.config");

const connectString = `mongodb+srv://${host}@${port}/${name}`;

class Database {
	constructor() {
		this.connect();
	}

	connect(type = "mongodb") {
		if (1 === 1) {
			mongoose.set("debug", true);
			mongoose.set("debug", { color: true });
		}
		mongoose
			.connect(connectString)
			.then((_) => {
				console.log(`Connected MongoDB Success PRO`, countConnect());
			})
			.catch((err) => console.log(`Error Connect`));
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
