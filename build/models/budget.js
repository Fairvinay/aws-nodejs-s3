"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
class Budget {
    constructor() {
        this.maxExpenses = 0;
        this.currentExpenses = 0;
    }
    get left() { return this.maxExpenses - this.currentExpenses; }
    get leftPercentage() { return 100 * this.currentExpenses / this.maxExpenses + '%'; }
    static build(input) {
        const budget = new Budget();
        return Object.assign(budget, input);
    }
    static buildFromJson(json) {
        const budget = new Budget();
        return Object.assign(budget, json);
    }
    static buildFromDefinition(accountId, period, definition) {
        const budget = new Budget();
        budget.accountId = accountId;
        budget.period = period;
        budget.maxExpenses = definition.maxExpenses;
        budget.category = definition.category;
        return budget;
    }
}
exports.Budget = Budget;
