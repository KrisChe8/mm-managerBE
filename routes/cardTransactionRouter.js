const cardTransactionRouter = require('express').Router();
const {getAllCardTransactions, addNewCardTransaction, deleteCardTransactionByid, deleteAllCardTransactionsByUSERid, patchCardTransactionById} = require('../controllers/cardTransaction.controllers')


cardTransactionRouter.route('/')
.get(getAllCardTransactions)
.post(addNewCardTransaction)

cardTransactionRouter.route('/:id')
.delete(deleteCardTransactionByid)
.patch(patchCardTransactionById)

cardTransactionRouter.route('/user/:userid')
.delete(deleteAllCardTransactionsByUSERid)

module.exports = cardTransactionRouter;