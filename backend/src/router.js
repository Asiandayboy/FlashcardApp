function route(routes, pathname, response, request) {
    console.log(`About to route a request for ${pathname}`);

    if (typeof routes[pathname] === 'function') {
        routes[pathname](response, request);
    } else {
        console.log(`No request handler found for ${pathname}`);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();

    }
}

exports.route = route;