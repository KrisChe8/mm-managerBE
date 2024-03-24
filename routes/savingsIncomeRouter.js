const savingsIncomeRouter = require('express').Router();

const {getSavingsIncomeByUserId, getTotalSavingsIncomeByUserId} = require('../controllers/savingsIncome.controllers');

savingsIncomeRouter.route("/:userid")
.get(getSavingsIncomeByUserId)

savingsIncomeRouter.route("/:userid/total")
.get(getTotalSavingsIncomeByUserId)

module.exports = savingsIncomeRouter;