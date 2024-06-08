const { v4: uuidv4 } = require("uuid");




async function createSessionId(accountId, databaseConnection) {
    const sessionId = uuidv4();

    const [rows, fields] = await databaseConnection.execute(
        `select * from sessions where accountId=?`,
        [accountId]
    );

    if (rows.length == 0) {
        const [rows, fields] = await databaseConnection.execute(
            `insert into sessions (accountId, sessionId) values (?, ?)`,
            [accountId, sessionId]
        );
    } else {
        const [rows, fields] = await databaseConnection.execute(
            `update sessions set sessionId=? where accountId=?`,
            [sessionId, accountId]
        );
    }

    return sessionId;
}

async function getUserIdBySessionId(sessionId, databaseConnection) {
    const [rows, fields] = await databaseConnection.execute(
        `select accountId from sessions where sessionId=?`,
        [sessionId]
    );

    if (rows.length == 1) {
        return rows[0].accountId;
    } else {
        return -1;
    }
}

module.exports = {
    createSessionId,
    getUserIdBySessionId,
}