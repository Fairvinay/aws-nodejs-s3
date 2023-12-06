"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetSummary = void 0;
class BudgetSummary {
    constructor(accountId, period) {
        this.accountId = accountId;
        this.period = period;
        this.totalExpenses = 0;
        this.totalBudget = 0;
    }
    get totalLeft() { return this.totalBudget - this.totalExpenses; }
    ;
    static buildFromJson(json) {
        const budgetSummary = new BudgetSummary(json.accountId, json.period);
        return Object.assign(budgetSummary, json);
    }
}
exports.BudgetSummary = BudgetSummary;
