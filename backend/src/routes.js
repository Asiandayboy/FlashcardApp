const start = require("./endpoints/start");
const upload = require("./endpoints/upload");
const signup = require("./endpoints/signup");
const login = require("./endpoints/login");
const user = require("./endpoints/user");

const routes = {
    "/": start.start,
    "/start": start.start,
    "/upload": upload.upload,
    "/signup": signup.signup,
    "/login": login.login,
    "/user": user.user,
};

module.exports = {
    routes
};