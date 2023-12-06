"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORIES = exports.InMemoryCategoriesRepository = void 0;
const category_1 = require("../../../models/category");
class InMemoryCategoriesRepository {
    getCategory(id) {
        const category = exports.CATEGORIES.find(c => c.id === id);
        return new Promise((resolve, reject) => {
            category ? resolve(category) : reject();
        });
    }
    getCategories(accountId) {
        const categories = exports.CATEGORIES.filter(category => category.accountId === accountId);
        return new Promise((resolve, reject) => {
            categories ? resolve(categories) : reject();
        });
    }
    createDefaultCategories(accountId) {
        let nextId = exports.CATEGORIES.length + 1;
        const newCategories = DEFAULT_CATEGORIES_NAMES.map(name => new category_1.Category((nextId++).toString(), accountId, name));
        exports.CATEGORIES.push(...newCategories);
        return Promise.resolve();
    }
}
exports.InMemoryCategoriesRepository = InMemoryCategoriesRepository;
exports.CATEGORIES = [
    new category_1.Category('1', '1', 'Food', ['mcdonalds']),
    new category_1.Category('2', '1', 'Shopping'),
    new category_1.Category('3', '1', 'Entertainment'),
    new category_1.Category('4', '1', 'Transport'),
    new category_1.Category('5', '1', 'Cloths'),
    new category_1.Category('6', '2', 'Food'),
    new category_1.Category('7', '2', 'Shopping'),
    new category_1.Category('8', '2', 'Entertainment'),
];
const DEFAULT_CATEGORIES_NAMES = [
    'Food', 'Shopping', 'Entertainment'
];
