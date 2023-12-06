"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryBelongsToAccount = void 0;
const in_memory_categories_repository_1 = require("./in-memory-categories.repository");
const repository = new in_memory_categories_repository_1.InMemoryCategoriesRepository();
function categoryBelongsToAccount() {
    return function (req, res, next) {
        const user = req.user;
        const categoryId = req.params.id;
        if (!categoryId) {
            return next();
        }
        repository.getCategory(categoryId).then(category => {
            if (category.accountId === user.accountId) {
                return next();
            }
            else {
                res.status(401).json({ error: 'You are not authorized to perform this operation' });
                return next('Unauthorized');
            }
        }).catch(() => res.sendStatus(404));
    };
}
exports.categoryBelongsToAccount = categoryBelongsToAccount;
