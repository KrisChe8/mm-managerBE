const {fetchAllSavingsTransaction, addSavingsTransaction, removeSavingsTransaction, removeSavingsTransactionByUSERId, updateSavingsTransaction} = require('../models/savingsTransaction.models');

const {checkUserExistById, checkTransactionExistence} = require('../utils/checkExistence')

module.exports.getAllSavingsTransaction = (req, res, next)=>{
    fetchAllSavingsTransaction()
    .then((savingsTransaction)=>{
        res.status(200).send({savingsTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.postSavingsTransaction = (req, res, next) =>{
    const {transaction_type, amountPence,category, date, user_id} = req.body;

    const userExistenceQuery = checkUserExistById(user_id);

    const addSavingsTransactionQuery = addSavingsTransaction(transaction_type, amountPence,category, date, user_id)
    const queries = [addSavingsTransactionQuery, userExistenceQuery];
    Promise.all(queries)
    .then((response)=>{
        const savingsTransaction = response[0];
        res.status(201).send({savingsTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteSavingsTransactionById = (req, res, next) =>{
    const {id} = req.params;

    const tableName = "savingsTransaction";
    const rowname = "savingsTransaction_id";
    const chackTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const removeSavingsTransactionQuery = removeSavingsTransaction(id);

    const queries = [removeSavingsTransactionQuery, chackTransactionExistenceQuery]
    Promise.all(queries)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.deleteSavingsTransactionByUSERId = (req, res, next) =>{
    const {userid} = req.params;

    const checkUserExistenceQuery = checkUserExistById(userid);

    const removeSavingsTransactionByUSERIdQuery = removeSavingsTransactionByUSERId(userid);
    const queries = [removeSavingsTransactionByUSERIdQuery, checkUserExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{

        next(err)
    })
}

module.exports.patchSavingsTransaction = (req, res, next) =>{
    const {id} = req.params;
    const {transaction_type, amountPence,category, date, user_id} = req.body;

    const tableName = "savingsTransaction";
    const rowname = "savingsTransaction_id";
    const chackTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const updateSavingsTransactionQuery = updateSavingsTransaction(id, transaction_type, amountPence,category, date, user_id);

    const queries = [updateSavingsTransactionQuery, chackTransactionExistenceQuery]

    Promise.all(queries)
    .then((response)=>{
        const savingsTransaction = response[0];
        res.status(200).send({savingsTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}