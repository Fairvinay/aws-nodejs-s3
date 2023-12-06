"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const in_memory_categories_repository_1 = require("./in-memory-categories.repository");
const categories_middleware_1 = require("./categories.middleware");
const repository = new in_memory_categories_repository_1.InMemoryCategoriesRepository();
const router = express_1.Router();
router.get('/expense-categories/:id', categories_middleware_1.categoryBelongsToAccount(), function (req, res) {
    repository.getCategory(req.params.id)
        .then(category => res.json(category));
});
router.get('/expense-categories', function (req, res) {
    const user = req.user;
    repository.getCategories(user.accountId)
        .then(categories => res.json(categories));
});
exports.default = router;
