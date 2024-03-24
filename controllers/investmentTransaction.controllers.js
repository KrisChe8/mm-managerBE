const {fetchAllInvestmentTransaction, deleteInvestTransactionById, insertInvestTransaction, removeInvestTransactionByUSERid, updateInvestTransaction} = require('../models/investmentTransaction.models');

const {checkUserExistById, checkTransactionExistence} = require('../utils/checkExistence')

module.exports.getAllInvestmentTransaction = (req, res, next)=>{
    fetchAllInvestmentTransaction()
    .then((investmentTransaction)=>{
        res.status(200).send({investmentTransaction});
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports.postNewInvestTransaction = (req, res, next) =>{
    const {transaction_type, amountPence,category, date, user_id} = req.body;

    const userExistenceQuery = checkUserExistById(user_id);

    const insertInvestTransactionQuery = insertInvestTransaction(transaction_type, amountPence,category, date, user_id);

    const queries = [insertInvestTransactionQuery, userExistenceQuery]
    Promise.all(queries)
    .then((response)=>{
        const investTransaction = response[0];
        res.status(201).send({investTransaction})
    })
    .catch((err)=>{
        next(err)
    })

}


module.exports.deleteInvestTransactionById = (req,res,next)=>{
    const {id} = req.params;

    const tableName = "investmentTransaction";
    const rowname = "investmentTransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const deleteInvestTransactionByIdQuery = deleteInvestTransactionById(id);
    const queries = [deleteInvestTransactionByIdQuery, checkTransactionExistenceQuery]

    Promise.all(queries)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.deleteInvestTransactionByUSERId = (req, res, next) => {

    const {userid} = req.params;

    const checkUserExistenceQuery = checkUserExistById(userid);

    const removeInvestTransactionByUSERidQuery = removeInvestTransactionByUSERid(userid);

    const queries = [removeInvestTransactionByUSERidQuery, checkUserExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports.patchInvestTransaction = (req, res, next) =>{
    const {id} = req.params;
    const {transaction_type, amountPence,category, date, user_id} = req.body;

    const tableName = "investmentTransaction";
    const rowname = "investmentTransaction_id";
    const checkTransactionExistenceQuery = checkTransactionExistence(id, tableName, rowname);

    const updateInvestTransactionQuery = updateInvestTransaction(id, transaction_type, amountPence,category, date, user_id)

    const queries = [updateInvestTransactionQuery,checkTransactionExistenceQuery ];
    Promise.all(queries)
    .then((response)=>{
        const investTransaction = response[0]
        res.status(200).send({investTransaction})
    })
    .catch((err)=>{
        next(err)
    })
}