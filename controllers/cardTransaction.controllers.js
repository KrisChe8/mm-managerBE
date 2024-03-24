const {fetchAllCardTransactions, insertNewCardTransaction, removeCardTransactionById, removeAllCardTransactionsByUserId, updateCardTransaction} = require('../models/cardTransaction.models');
const {checkUserExistById, checkTransactionExistence} = require('../utils/checkExistence')
module.exports.getAllCardTransactions = (req,res,next)=>{
    fetchAllCardTransactions()
    .then((cardtransaction)=>{
        res.status(200).send({cardtransaction})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.addNewCardTransaction = (req, res, next) =>{
    const {transaction_type, amountPence, category, date, user_id} = req.body;
    const userExistenceQuery = checkUserExistById(user_id);

    const insertNewCardTransactionQuery = insertNewCardTransaction(transaction_type, amountPence, category, date, user_id);
   
    const queries = [insertNewCardTransactionQuery, userExistenceQuery]
    Promise.all(queries)
    .then((response)=>{
        const cardTransaction = response[0];
        res.status(201).send({cardTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteCardTransactionByid = (req, res, next) =>{
    const {id} = req.params;

    const tableName = "cardTransaction";
    const rowname = "cardtransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const deleteTransactionQuery = removeCardTransactionById(id);
    const queries = [deleteTransactionQuery, checkTransactionExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.deleteAllCardTransactionsByUSERid = (req, res, next) =>{
    const {userid} = req.params;

    const checkUserExistenceQuery = checkUserExistById(userid);

    const removeAllCardTransactionsByUserQuery = removeAllCardTransactionsByUserId(userid);

    const queries = [removeAllCardTransactionsByUserQuery, checkUserExistenceQuery];
    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        
        next(err);
    })

}

module.exports.patchCardTransactionById = (req, res, next) =>{
    const {id} = req.params;
    const {transaction_type, amountPence, category, date, user_id} = req.body;

    const tableName = "cardTransaction";
    const rowname = "cardtransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const updateCardTransactionQuery = updateCardTransaction(id, transaction_type, amountPence, category, date, user_id);

    const queries = [updateCardTransactionQuery, checkTransactionExistenceQuery]
    Promise.all(queries)
    .then((response)=>{
        const cardTransaction = response[0];
        res.status(200).send({cardTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}