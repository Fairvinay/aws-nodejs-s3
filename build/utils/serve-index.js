"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.default = () => (req, res, next) => {
    res.sendFile(path.resolve('../angular/dist/index.html'));
};
