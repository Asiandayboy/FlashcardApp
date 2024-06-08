const { connectToDatabase, endDatabaseConnection } = require("../db");
const sessionManager = require("../sessionManager");


function writeResponse(response, statusCode, message, code, sessionId=-1) {
    if (sessionId !== -1 && statusCode === 200) {
        console.log("sessionId:", sessionId);
        response.setHeader("Set-Cookie", `sessionId=${sessionId}`);
    }
    response.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*"
    });
    
    response.write(JSON.stringify({ 
        message: message, 
        sessionId: sessionId,
        code: code
    }));
    response.end();
}


async function authorizeLoginInfo(username, password) {
    const validMessage = "Successfully logged In!";
    const invalidMessage = "Incorrect username or password!"

    try {
        const connection = await connectToDatabase();
        const [rows, fields] = await connection.execute(
            `select * from account where BINARY username=? and BINARY password=?`,
            [username, password]
        );

        // 1 = success
        // 0 = could not find account
        // -1 = server error
        if (rows.length == 1) {
            const accountId = rows[0].accountId;
            const sessionId = await sessionManager.createSessionId(accountId, connection);
            await endDatabaseConnection(connection);
            return [1, validMessage, sessionId];
        } else {
            await endDatabaseConnection(connection);
            return [0, invalidMessage, -1];
        }

    } catch(err) {
        return [-1, err, -1];
    }
}


function login(response, request) {
    console.log("Request handler for login was called.");

    let body = "";

    request.on("data", chunk => {
        body += chunk.toString();
    });

    request.on("end", async () => {
        const { username, password } = JSON.parse(body);
        console.log(JSON.parse(body));

        const [authorized, message, sessionId] = await authorizeLoginInfo(username, password);
        console.log("\x1b[36m", message, "\x1b[0m");

        switch(authorized) {
            case 1: 
                writeResponse(response, 200, message, authorized, sessionId);
                break;
            case 0: 
                writeResponse(response, 401, message, authorized);
                break;
            case -1: 
                writeResponse(response, 500, message. authorized);
                break;
        };

    });
}


exports.login = login;