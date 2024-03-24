const totalExpensesRouter = require('express').Router();

const {getTotalExpensesByUserId} = require('../controllers/totalExpenses.controllers');

totalExpensesRouter.route("/:userid")
.get(getTotalExpensesByUserId)



module.exports = totalExpensesRouter;