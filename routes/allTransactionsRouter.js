const allTransactionsRouter = require('express').Router();

const {getAllTransactionsByUserId} = require('../controllers/allTransactions.controllers');

allTransactionsRouter.route("/:userid")
.get(getAllTransactionsByUserId)



module.exports = allTransactionsRouter;