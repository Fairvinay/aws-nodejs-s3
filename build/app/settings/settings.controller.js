"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = require("./account/account.controller");
const categories_controller_1 = require("./categories/categories.controller");
const router = express_1.Router();
router.use(account_controller_1.default);
router.use(categories_controller_1.default);
exports.default = router;
