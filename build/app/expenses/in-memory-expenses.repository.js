"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryExpensesRepository = void 0;
const in_memory_categories_repository_1 = require("../settings/categories/in-memory-categories.repository");
const period_1 = require("../../models/period");
const expense_1 = require("../../models/expense");
class InMemoryExpensesRepository {
    getExpense(id) {
        let expense = EXPENSES.find(expense => expense.id === id);
        this.attachCategory(expense);
        return new Promise((resolve, reject) => {
            expense ? resolve(expense) : reject();
        });
    }
    getExpenses(accountId, period) {
        const expenses = EXPENSES.filter(expense => period.equals(expense.period) && expense.accountId === accountId);
        expenses.forEach(e => this.attachCategory(e));
        return new Promise((resolve, reject) => {
            expenses ? resolve(expenses) : reject();
        });
    }
    getExpensesByCategory(accountId, period, category) {
        const expenses = EXPENSES.filter(expense => period.equals(expense.period) &&
            expense.accountId === accountId &&
            expense.category && expense.category.name.toLowerCase().includes(category));
        return new Promise((resolve, reject) => {
            expenses ? resolve(expenses) : reject();
        });
    }
    createExpense(expense) {
        expense.id = (EXPENSES.length + 1).toString();
        EXPENSES.push(expense);
        return Promise.resolve();
    }
    updateExpense(expense) {
        return this.getExpense(expense.id)
            .then(expenseToUpdate => {
            Object.assign(expenseToUpdate, expense);
        });
    }
    deleteExpense(id) {
        EXPENSES = EXPENSES.filter(expense => expense.id !== id);
        return Promise.resolve();
    }
    attachCategory(expense) {
        if (expense) {
            expense.category = in_memory_categories_repository_1.CATEGORIES.find(category => category.id === expense.categoryId);
            ;
        }
    }
}
exports.InMemoryExpensesRepository = InMemoryExpensesRepository;
const period = new period_1.Period(3, 2020);
const date1 = new Date('2020-03-02');
const date2 = new Date('2020-03-11');
let EXPENSES = [
    new expense_1.Expense('1', '1', 21.4, date1, period, '1', 'McDonalds'),
    new expense_1.Expense('2', '1', 31.9, date2, period, '3', 'CinemaCity'),
    new expense_1.Expense('3', '2', 21.5, date2, period, '8', 'CinemaX'),
    new expense_1.Expense('4', '2', 11.5, date1, period, '6', 'KFC'),
];
