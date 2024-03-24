const cardIncomeRouter = require('express').Router();

const {getCardIncomeByUserId, getTotalCardIncomeByUserId} = require('../controllers/cardIncome.controllers');

cardIncomeRouter.route("/:userid")
.get(getCardIncomeByUserId)

cardIncomeRouter.route("/:userid/total")
.get(getTotalCardIncomeByUserId)

module.exports = cardIncomeRouter;