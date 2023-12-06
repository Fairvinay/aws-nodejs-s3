"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryBudgetRepository = void 0;
const in_memory_categories_repository_1 = require("../settings/categories/in-memory-categories.repository");
const period_1 = require("../../models/period");
const budget_1 = require("../../models/budget");
const budgetSummary_1 = require("../../models/budgetSummary");
class InMemoryBudgetRepository {
    getBugdets(accountId, period) {
        const budgets = BUDGETS.filter(budget => period.equals(budget.period) && budget.accountId === accountId);
        return Promise.resolve(budgets ? budgets : []);
    }
    getBudgetSummary(accountId, period) {
        const summary = BUDGET_SUMMARIES.find(summary => period.equals(summary.period) && summary.accountId === accountId);
        return new Promise((resolve, reject) => {
            summary ? resolve(summary) : reject();
        });
    }
}
exports.InMemoryBudgetRepository = InMemoryBudgetRepository;
const period = new period_1.Period(3, 2020);
const BUDGETS = [
    budget_1.Budget.build({
        id: '1',
        accountId: '1',
        period: period,
        category: in_memory_categories_repository_1.CATEGORIES[0],
        currentExpenses: 100,
        maxExpenses: 500
    }),
    budget_1.Budget.build({
        id: '2',
        accountId: '1',
        period: period,
        category: in_memory_categories_repository_1.CATEGORIES[1],
        currentExpenses: 100,
        maxExpenses: 300
    }),
    budget_1.Budget.build({
        id: '3',
        accountId: '2',
        period: period,
        category: in_memory_categories_repository_1.CATEGORIES[2],
        currentExpenses: 200,
        maxExpenses: 300
    })
];
const summary1 = new budgetSummary_1.BudgetSummary('1', period);
summary1.totalExpenses = 200;
summary1.totalBudget = 800;
const summary2 = new budgetSummary_1.BudgetSummary('2', period);
summary2.totalExpenses = 200;
summary2.totalBudget = 300;
const BUDGET_SUMMARIES = [summary1, summary2];
