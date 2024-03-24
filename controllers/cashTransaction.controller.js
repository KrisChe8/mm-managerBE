const {fetchAllCashTransaction, insertCashTransaction, removeCashTransactionById, deleteAllCashTransactionBYUSERid, updateCashTransaction} = require('../models/cachTransaction.models');

const {checkUserExistById, checkTransactionExistence} = require('../utils/checkExistence')

module.exports.getAllCashTransaction = (req, res, next)=>{
    fetchAllCashTransaction()
    .then((cashTransaction)=>{
        res.status(200).send({cashTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.addNewCashTransaction = (req, res, next)=>{
    const {transaction_type, amountPence,category, date, user_id} = req.body;

    const userExistenceQuery = checkUserExistById(user_id);

    const insertCashTransactionQuery = insertCashTransaction(transaction_type, amountPence,category, date, user_id);

    const queries = [insertCashTransactionQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const cashTransaction = response[0];
        res.status(201).send({cashTransaction})
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports.deleteCashTransactionById = (req, res, next) =>{
    const {id} = req.params;

    const tableName = "cashTransaction";
    const rowname = "cashtransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const deleteCashTransactionQuery = removeCashTransactionById(id);
    const queries = [deleteCashTransactionQuery,checkTransactionExistenceQuery ];
    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports.deleteCashTransactionByUSERId = (req, res, next) =>{
    const {userid} = req.params;
    const checkUserExistenceQuery = checkUserExistById(userid);

    const deleteAllCashTransactionBYUserQuery = deleteAllCashTransactionBYUSERid(userid);

    const queries = [deleteAllCashTransactionBYUserQuery, checkUserExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports.patchCashTransaction = (req, res, next) =>{
    const {id} = req.params;
    const {transaction_type, amountPence,category, date, user_id} = req.body;


    const tableName = "cashTransaction";
    const rowname = "cashtransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const updateCashTransactionQuery = updateCashTransaction(id, transaction_type, amountPence,category, date, user_id);

    const queries = [updateCashTransactionQuery, checkTransactionExistenceQuery]

    Promise.all(queries)
    .then((response)=>{
        const cashTransaction = response[0];
        res.status(200).send({cashTransaction})
    })
    .catch((err)=>{
        next(err)
    })

  
}