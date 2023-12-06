"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(id, accountId, name = '', counterpartyPatterns = []) {
        this.id = id;
        this.accountId = accountId;
        this.name = name;
        this.counterpartyPatterns = counterpartyPatterns;
    }
}
exports.Category = Category;
