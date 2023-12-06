"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
class Expense {
    constructor(id, accountId = '', value = 0, datetime = new Date(), period = null, categoryId = '', counterparty = '') {
        this.id = id;
        this.accountId = accountId;
        this.value = value;
        this.datetime = datetime;
        this.period = period;
        this.categoryId = categoryId;
        this.counterparty = counterparty;
    }
}
exports.Expense = Expense;
