const {fetchAllAccountType, insertNewAccount, removeAccountType} = require('../models/accountType.models')

const {categoryDoesNotExist, checkCategoryExists} = require('../utils/checkExistence');

module.exports.getAllAccountType = (req, res, next)=>{
    fetchAllAccountType()
    .then((accounts)=>{
        res.status(200).send({accounts})
    })
}

module.exports.postNewAccountType = (req, res, next)=>{
    const {accounttype_name} = req.body;

    const tableName = 'userAccountType';
    const rowName = 'accountType_name';
    let value = accounttype_name;

    const AccountExistenceQuery = categoryDoesNotExist(tableName, rowName, value);
    const insertNewAccountQuery = insertNewAccount(accounttype_name);
    const queries = [insertNewAccountQuery, AccountExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const account = response[0];
        res.status(201).send({account})
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.deleteAccountTypeById = (req, res, next)=>{
    const {id} = req.params;

    const tableName = 'userAccountType';
    const rowName = 'accountType_id';
    const categoryExistenceQuery = checkCategoryExists(tableName,rowName, id);
    const deleteAccountTypeQuery = removeAccountType(id);
    const queries = [deleteAccountTypeQuery, categoryExistenceQuery];

    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err);
    })
}