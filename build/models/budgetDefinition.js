"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetDefinition = void 0;
class BudgetDefinition {
    constructor(id, period, category, maxExpenses) {
        this.id = id;
        this.period = period;
        this.category = category;
        this.maxExpenses = maxExpenses;
    }
}
exports.BudgetDefinition = BudgetDefinition;
