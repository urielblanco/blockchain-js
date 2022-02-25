"use strict";

var _app = require("./app");

var _process$env$HTTP_POR = process.env.HTTP_PORT,
    HTTP_PORT = _process$env$HTTP_POR === void 0 ? 3000 : _process$env$HTTP_POR;

_app.app.listen(HTTP_PORT, function () {
  console.log("Service HTTP: ".concat(HTTP_PORT, " listening..."));

  _app.p2pservice.listen();
});