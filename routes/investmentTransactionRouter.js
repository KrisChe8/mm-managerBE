const investmentTransactionRouter = require('express').Router();

const {getAllInvestmentTransaction, deleteInvestTransactionById, postNewInvestTransaction, deleteInvestTransactionByUSERId, patchInvestTransaction} = require('../controllers/investmentTransaction.controllers')

investmentTransactionRouter.route('/')
.get(getAllInvestmentTransaction)
.post(postNewInvestTransaction)


investmentTransactionRouter.route("/:id")
.delete(deleteInvestTransactionById)
.patch(patchInvestTransaction)

investmentTransactionRouter.route("/user/:userid")
.delete(deleteInvestTransactionByUSERId)

module.exports = investmentTransactionRouter;