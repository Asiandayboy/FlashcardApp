function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {
        "Content-Type": 'text/plain'
    });
    response.write("Hello upload");
    response.end();
}


exports.upload = upload;