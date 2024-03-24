const totalIncomeRouter = require('express').Router();

const {getTotalIncomeByUserId} = require('../controllers/totalIncome.controllers');

totalIncomeRouter.route("/:userid")
.get(getTotalIncomeByUserId)

// totalIncomeRouter.route("/:userid/total")
// .get(getTotalCardIncomeByUserId)

module.exports = totalIncomeRouter;