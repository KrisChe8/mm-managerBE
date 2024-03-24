const plannedExpensesRouter = require('express').Router();

const {getPlannedExpensesByUserId, postNewPlannedExpenses, deletePlannedExpensesById, deletePlannedExpensesByUSERid} = require('../controllers/plannedExpenses.controllers');

plannedExpensesRouter.route("/")
.post(postNewPlannedExpenses)

plannedExpensesRouter.route("/:userid")
.get(getPlannedExpensesByUserId)
.delete(deletePlannedExpensesByUSERid)

plannedExpensesRouter.route("/remove/:id")
.delete(deletePlannedExpensesById)



module.exports = plannedExpensesRouter;