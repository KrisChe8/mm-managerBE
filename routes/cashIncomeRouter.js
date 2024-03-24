const cashIncomeRouter = require('express').Router();

const {getCashIncomeByUserId, getTotalCashIncomeByUserId} = require('../controllers/cashIncome.controllers');

cashIncomeRouter.route("/:userid")
.get(getCashIncomeByUserId)

cashIncomeRouter.route("/:userid/total")
.get(getTotalCashIncomeByUserId)

module.exports = cashIncomeRouter;