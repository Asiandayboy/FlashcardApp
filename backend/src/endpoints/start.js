function start(response, request) {
    console.log("Request handler 'start' was called.");

    const body = `
        <div>
            <h1>START</>
        </div
    
    `;

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}


exports.start = start;