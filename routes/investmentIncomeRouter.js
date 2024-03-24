const investmentIncomeRouter = require('express').Router();

const {getInvestmentIncomeByUserId, getTotalInvestmentIncomeByUserId} = require('../controllers/investmentIncome.controllers');

investmentIncomeRouter.route("/:userid")
.get(getInvestmentIncomeByUserId)

investmentIncomeRouter.route("/:userid/total")
.get(getTotalInvestmentIncomeByUserId)

module.exports = investmentIncomeRouter;