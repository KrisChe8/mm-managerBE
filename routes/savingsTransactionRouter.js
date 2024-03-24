const savingsTransactionRouter = require('express').Router();

const {getAllSavingsTransaction, postSavingsTransaction, deleteSavingsTransactionById, deleteSavingsTransactionByUSERId, patchSavingsTransaction} = require('../controllers/savingsTransaction.controllers')

savingsTransactionRouter.route('/')
.get(getAllSavingsTransaction)
.post(postSavingsTransaction)


savingsTransactionRouter.route("/:id")
.delete(deleteSavingsTransactionById)
.patch(patchSavingsTransaction)

savingsTransactionRouter.route("/user/:userid")
.delete(deleteSavingsTransactionByUSERId)

module.exports = savingsTransactionRouter;