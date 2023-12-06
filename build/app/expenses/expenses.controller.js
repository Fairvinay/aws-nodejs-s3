"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const express_1 = require("express");
const controller_utils_1 = require("../../utils/controller.utils");
const expenses_middleware_1 = require("./expenses.middleware");
const role_middleware_1 = require("../auth/role.middleware");
const expenses_validator_1 = require("./expenses.validator");
class ExpensesController {
    constructor(repository) {
        this.repository = repository;
        this.router = express_1.Router();
        this.initRoutes();
    }
    getRouter() {
        return this.router;
    }
    initRoutes() {
        this.router.use('/expenses', role_middleware_1.readerOnlyReads());
        this.router.get('/expenses', (req, res) => {
            const user = req.user;
            const period = controller_utils_1.buildPeriodFromRequest(req);
            const categoryQuery = req.query.categoryName;
            if (!categoryQuery) {
                this.repository.getExpenses(user.accountId, period).then(expenses => res.json(expenses));
            }
            else {
                this.repository.getExpensesByCategory(user.accountId, period, categoryQuery)
                    .then(expenses => res.json(expenses));
            }
        });
        this.router.post('/expenses', expenses_validator_1.default, (req, res) => {
            const user = req.user;
            const expense = req.body;
            expense.accountId = user.accountId;
            this.repository.createExpense(expense)
                .then(() => res.status(201).json());
        });
        this.router.put('/expenses/:id', expenses_middleware_1.expenseBelongsToAccount(), expenses_validator_1.default, (req, res) => {
            const user = req.user;
            const expense = req.body;
            expense.id = req.params.id;
            expense.accountId = user.accountId;
            this.repository.updateExpense(expense)
                .then(() => res.status(200).json());
        });
        this.router.delete('/expenses/:id', expenses_middleware_1.expenseBelongsToAccount(), (req, res) => {
            const expenseId = req.params.id;
            this.repository.deleteExpense(expenseId)
                .then(() => res.sendStatus(204));
        });
    }
}
exports.ExpensesController = ExpensesController;
