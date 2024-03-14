const db = require('../db/db');

module.exports.checkEmailExist = (email)=>{
    return db.query("SELECT * FROM users WHERE email = $1", [email])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Email does not exist"})
        }
    })
}


module.exports.checkEmailDoesNotExist = (email)=>{
    return db.query("SELECT * FROM users WHERE email = $1", [email])
    .then(({rows})=>{
        if(rows.length != 0){
            return Promise.reject({status: 406, msg: "User already exists"})
        }
    })
}

module.exports.checkUserExistById = (id) =>{
    return db.query("SELECT * FROM users WHERE user_id = $1", [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "User does not exist"})
        }
    })
}

module.exports.categoryDoesNotExist = (tableName, rowName, value) =>{
    return db.query(`SELECT * FROM ${tableName} WHERE ${rowName} = $1`, [value])
    .then(({rows})=>{
        if(rows.length != 0){
            return Promise.reject({status: 406, msg: "Category already exists"})
        }
    })
}

module.exports.checkCategoryExists = (tableName, rowName, id) =>{
    return db.query(`SELECT * FROM ${tableName} WHERE ${rowName} = $1 `, [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Category does not exist"})
        }
    })
}