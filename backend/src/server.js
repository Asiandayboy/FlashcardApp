const http = require("http");
const url = require("url");

function handleOptionsRequest(request, response) {
    response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Max-Aage": "86400",
    });
    response.end();
}



function start(route, routes, portNumber) {
    http.createServer((request, response) => {
        if (request.method === "OPTIONS") {
            handleOptionsRequest(request, response);
            return;
        }


        const pathname = url.parse(request.url).pathname;
        console.log(`Request received for ${pathname}`);

        route(routes, pathname, response, request);

    }).listen(portNumber)

    console.log("Server has started");
}

exports.start = start;

