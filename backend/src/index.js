const server = require("./server");
const router = require("./router");
const { routes } = require("./routes")


server.start(router.route, routes, 8000);