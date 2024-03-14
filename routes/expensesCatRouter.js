const expensesCatRouter = require('express').Router();
const {getAllExpensesCategories, deleteExpensesCategoryById, postNewExpensesCategory} = require('../controllers/expensesCat.controllers')


expensesCatRouter.route('/')
.get(getAllExpensesCategories)
.post(postNewExpensesCategory)

expensesCatRouter.route("/:id")
.delete(deleteExpensesCategoryById)

module.exports = expensesCatRouter;