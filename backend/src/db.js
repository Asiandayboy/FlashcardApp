const mysql = require("mysql2/promise");

const config = {
	host: "localhost",
    user: "cf_user",
    port: "3306",
    password: "password",
    database: "cardflash",
};

async function connectToDatabase() {
	try {
		const connection = await mysql.createConnection(config);
		console.log("Connected to database");
		return connection;
	} catch (err) {
		console.error(err);
	}
}

async function endDatabaseConnection(connection) {
	try {
		await connection.end();
		console.log("Disconnected from database");
	} catch (err) {
		console.error(err);
	}
}


module.exports = { connectToDatabase, endDatabaseConnection };