"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPeriodFromRequest = void 0;
const period_1 = require("../models/period");
function buildPeriodFromRequest(req) {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    return new period_1.Period(month, year);
}
exports.buildPeriodFromRequest = buildPeriodFromRequest;
