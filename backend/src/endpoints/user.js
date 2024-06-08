const url = require("url");
const { connectToDatabase, endDatabaseConnection } = require("../db");
const { readStreamData } = require("../utility/readStreamData");


/* How saving works

    - when a user saves a new deck, 
        - insert the deck into database
        - insert all the cards into database
    - when a user adds more cards to a deck
        - select the row with the highest cardOrder to determine the new cards that should be added
        - add the all the new cards starting at the next highest cardOrder
    - when a user updates a card in a deck
        - get the current data stored in the db and compare it to the new data
          and determine which are different, in which case, update with the new data


*/

function identifyChangedRecords(oldData, newData){
    const addedRecords = [];
    const changedRecords = [];
    const deletedRecords = [];

    // console.log("old:", oldData, "new:", newData);


    // optimize later

    oldData.forEach((card, i) => { // O(n)
        const index = newData.findIndex((obj) => { // O(n)
            return obj.cardId == card.cardId;
        })

        if (index == -1) { // deleted cards
            deletedRecords.push(oldData[i].cardId);
        } else { // updated cards
            if (card.frontText != newData[index].frontText
            || card.backText != newData[index].backText) {
                changedRecords.push(newData[index]);
            }
        }   
    })

    newData.forEach((card) => { // O(n)
        if (card.cardId == null) {
            addedRecords.push(card);
        }
    })


    return {
        addedRecords: Array.from(addedRecords),
        changedRecords,
        deletedRecords
    };
}


async function getAccountIdFromSessionId(sessionId, connection) {
    const [rows] = await connection.execute(
        `select accountId from sessions where sessionId=?`,
        [sessionId]
    );

    if (rows.length === 0) {
        throw new Error("Session not found");
    }   

    return rows[0].accountId;
}


async function getMostRecentDeckId(connection) {
    const [rows] = await connection.execute(
        `select max(deckId) from decks`
    );

    return rows[0]["max(deckId)"];
}


async function getMostRecentRow(connection) {
    const [rows] = await connection.execute(
        `select * from decks where `
    );
}


function formatGetUserData(deckRows, cardRows) {
    const formattedData = [];
    deckRows.map((deck) => {
        const deckObj = {
            deckId: deck.deckId,
            deckName: deck.deckName,
            cards: [],
        };

        formattedData[deck.deckId - 1] = deckObj;
    })
    cardRows.map((card) => {
        const cardObj = {
            cardId: card.cardId,
            frontText: card.frontText,
            backText: card.backText,
            deckId: card.deckId,
            cardOrder: card.cardOrder
        };

        formattedData[card.deckId - 1].cards.push(cardObj);

    })

    return formattedData;
}


async function getFormattedUserData(connection, sessionId) {
    const [deckRows] = await connection.execute(
        `select decks.deckId, deckName from decks join sessions
        where sessions.sessionid="${sessionId}" and sessions.accountid=decks.accountid`
    );

    const [cardRows] = await connection.execute(
        `select cards.cardId, cards.deckId, frontText, backText, cardOrder from cards join sessions join account
        where sessions.sessionid="${sessionId}" and sessions.accountid=account.accountid`
    );

    return formatGetUserData(deckRows, cardRows);
}


async function saveNewDeck(response, requestBody, sessionId) {
    const connection = await connectToDatabase();
    const accountId = await getAccountIdFromSessionId(sessionId, connection);

    const newDeckData = requestBody.deckData;
    console.log("Save method: NEW", newDeckData);

    // insert new deck to decks table
    await connection.execute(
        `insert into decks (deckName, accountId) values (?, ?)`,
        [newDeckData.deckName, accountId]
    );

    // the most recent deckId will the most recently added deck
    const deckId = await getMostRecentDeckId(connection);


    // insert each card in the deck into the cards table
    newDeckData.cards.forEach(async (card) => {
        await connection.execute(
            `insert into cards (frontText, backText, deckId, cardOrder) values (?, ?, ?, ?)`,
            [card.frontText, card.backText, deckId, card.cardOrder]
        );
    })

    endDatabaseConnection(connection);

    response.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*"
    });
    response.write("Inserted into database successfully");
    response.end();
}


async function updateExistingDeck(response, requestBody, sessionId) {
    const connection = await connectToDatabase();
    const accountId = await getAccountIdFromSessionId(sessionId, connection);

    const newDeckData = requestBody.deckData;

    console.log("USER-PASSED DATA:", newDeckData);

    const [oldCards] = await connection.execute(
        `select * from cards where deckid=${newDeckData.deckId}`
    );


    console.log("BEFORE-UPDATE DATA:", oldCards);

    const changedRecords = identifyChangedRecords(oldCards, newDeckData.cards);

    console.log("\n", "\x1b[36mCHANGED RECORDS:\x1b[0m", changedRecords, "\n");

    // update deckName, regardless if there are any changes
    await connection.execute(
        `update decks set deckName="${newDeckData.deckName}" 
        where deckid=(${newDeckData.deckId}) and accountId=${accountId} 
        `
    );


    // add records
    if (changedRecords.addedRecords.length > 0) {
        console.log("adding");
        changedRecords.addedRecords.forEach(async (card) => {
            await connection.execute(
                `insert into cards (frontText, backText, deckId, cardOrder) values (?, ?, ?, ?)`,
                [card.frontText, card.backText, newDeckData.deckId, card.cardOrder]
            );
        });
    } 
    
    // change records
    if (changedRecords.changedRecords.length > 0) {
        console.log("changing");
        changedRecords.changedRecords.forEach(async (card) => {
            await connection.execute(
                `update cards set frontText="${card.frontText}", backText="${card.backText}"
                where cardId=${card.cardId}`
            );
        });
    }
    
    // delete records
    if (changedRecords.deletedRecords.length > 0) {
        console.log("deleting");

        changedRecords.deletedRecords.forEach(async (cardId) => {
            await connection.execute(
                `delete from cards where cardId=${cardId}`
            );
        })

        // update the card orderings after deletion
        newDeckData.cards.forEach(async (card) => {
            await connection.execute(
                `update cards set cardOrder=${card.cardOrder} where cardId=${card.cardId}`
            );
        })
    } 

    const [updatedCards] = await connection.execute(
        `select * from cards where deckid=${newDeckData.deckId}`
    ); 

    const [deck] = await connection.execute(
        `select * from decks where accountId=${accountId} and deckId=${newDeckData.deckId}`
    );

    console.log("UPDATED DATA:", {
        deckName: deck[0].deckName,
        deckId: newDeckData.deckId,
        cards: updatedCards
    });
    

    // no changes to records
    if (changedRecords.deletedRecords.length == 0 
        && changedRecords.addedRecords.length == 0
        && changedRecords.changedRecords.length == 0) {
        console.log("no changes");
    }

    // write response

    response.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*"
    });
    response.write(JSON.stringify({
        updatedCards,
    }));
    response.end();

    await endDatabaseConnection(connection);
}




async function handlePostRequest(response, request) {
    const requestBody = await readStreamData(request);
    const queryObject = url.parse(request.url, true)
    const sessionId = queryObject.query.sessionId;

    switch (requestBody.saveMethod) {
        case "new": {
            saveNewDeck(response, requestBody, sessionId);
            break;
        }
        case "update": {
            updateExistingDeck(response, requestBody, sessionId)
            break;
        }
    }
}


async function handleGetRequest(response, request) {
    const queryObject = url.parse(request.url, true)
    const sessionId = queryObject.query.sessionId;

    const connection = await connectToDatabase();

    const userDecks = await getFormattedUserData(connection, sessionId);

    await endDatabaseConnection(connection);


    response.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*"
    });
    response.write(JSON.stringify(userDecks));
    response.end();
}




async function user(response, request) {
    console.log("Request handler for user called");

    switch (request.method) {
        case "POST": {
            handlePostRequest(response, request);
            break;
        }
        case "GET": {
            handleGetRequest(response, request)
            break;
        }
    }
}

exports.user = user;