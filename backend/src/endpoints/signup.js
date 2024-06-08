const { connectToDatabase, endDatabaseConnection } = require("../db");
const sessionManager = require("../sessionManager");


async function insertIntoDatabase(response, signUpData) {
    const { username, password, email } = signUpData;

    try {
        const connection = await connectToDatabase();
        const [results, fields] = await connection.execute(
            `INSERT INTO account (username, password, email) VALUES (?, ?, ?)`,
        [username, password, email]
        );

        const [rows, columns] = await connection.execute(
            `select * from account where BINARY username=? and BINARY password=?`,
            [username, password]
        );

        const accountId = rows[0].accountId;
        const sessionId = await sessionManager.createSessionId(accountId, connection);

        await endDatabaseConnection(connection);

        console.log("New account added into database successfully:", rows);

        response.writeHead(200, {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*"
            
        });
        response.write(JSON.stringify({ 
            message: "You have successfully signed up!",
            sessionId: sessionId, 
        }));
        response.end();


    } catch (err) {
        console.error(err);
        response.writeHead(500, {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*"
            
        });
        response.write(JSON.stringify({ message: "Could not insert into database successfully" }));
        response.end();
    }

}

async function checkIfUsernameAvaiable(username) {
    const connection = await connectToDatabase();

    // check if the username already exists
    const [rows] = await connection.execute(
        `select * from account where username="${username}"`
    );

    if (rows.length > 0)
        return false;
    return true;
}




function collectRequestData(response, request) {
    let body = ""

    request.on("data", chunk => {
        body += chunk.toString();
    })

    request.on("end", async () => {
        let signupData;

        try {
            if (body) {
                signupData = JSON.parse(body);
            }
        } catch (err) {
            console.error(err);
            response.writeHead(400, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "*"
            });
            response.write(JSON.stringify({ message: "Invalid JSON input" }));
            response.end();
            return;
        }


        const usernameAvailable = await checkIfUsernameAvaiable(signupData.username);

        if (usernameAvailable) {
            console.log("Signup data", signupData);
            insertIntoDatabase(response, signupData);
        } else {
            response.writeHead(409, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "*"
            });
            response.write(JSON.stringify({ message: "Username already taken" }));
            response.end();
        }

    })
}


function signup(response, request) {
    console.log("Request handler 'signup' was called.");


    collectRequestData(response, request);


}


exports.signup = signup;