const cashTransactionRouter = require('express').Router();

const {getAllCashTransaction, addNewCashTransaction, deleteCashTransactionById, deleteCashTransactionByUSERId, patchCashTransaction} = require('../controllers/cashTransaction.controller')

cashTransactionRouter.route('/')
.get(getAllCashTransaction)
.post(addNewCashTransaction)


cashTransactionRouter.route("/:id")
.delete(deleteCashTransactionById)
.patch(patchCashTransaction)

cashTransactionRouter.route("/user/:userid")
.delete(deleteCashTransactionByUSERId)

module.exports = cashTransactionRouter;