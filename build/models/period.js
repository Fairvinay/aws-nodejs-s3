"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Period = void 0;
class Period {
    constructor(month, year) {
        this.month = month;
        this.year = year;
    }
    equals(period) {
        if (period == null) {
            return false;
        }
        return this.month === period.month &&
            this.year === period.year;
    }
}
exports.Period = Period;
