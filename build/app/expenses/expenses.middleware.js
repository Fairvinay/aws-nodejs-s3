"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseBelongsToAccount = void 0;
const in_memory_expenses_repository_1 = require("./in-memory-expenses.repository");
const expensesRepository = new in_memory_expenses_repository_1.InMemoryExpensesRepository();
function expenseBelongsToAccount() {
    return function (req, res, next) {
        const user = req.user;
        const expenseId = req.params.id;
        if (!expenseId) {
            return next();
        }
        expensesRepository.getExpense(expenseId).then(expense => {
            if (expense.accountId === user.accountId) {
                return next();
            }
            else {
                res.status(403).json({ msg: 'You are not authorized to perform this operation' });
                return next('Unauthorized');
            }
        }).catch(() => res.sendStatus(404));
    };
}
exports.expenseBelongsToAccount = expenseBelongsToAccount;
