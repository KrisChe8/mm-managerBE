const db = require("../db/db");

module.exports.fetchAllUsers = (email) =>{

    let queryStr = `SELECT * FROM users`;

    const queryParams = [];
    if(email){
        queryStr +=" WHERE email = $1"
        queryParams.push(email)
    }

    return db.query(queryStr, queryParams)
    .then((result)=>{
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: "User does not exist"})
        }
        return result.rows;
    })
}

// module.exports.fetchUserByEmail = (email) =>{
//     return db.query("SELECT * FROM users WHERE email = $1", [email])
//     .then(({rows})=>{
//         if(rows.length === 0){
//             return Promise.reject({status: 400, msg: 'User does not exist'})
//         }
//         return rows[0];
//     })
// }

module.exports.fetchUserById = (id) =>{
    return db.query("SELECT * FROM users WHERE user_id = $1", [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'User does not exist'})
        }
        return rows[0];
    })
}

module.exports.insertNewUser = (first_name, last_name, email, password, avatar) =>{
    if(!first_name || !last_name || !email || !password){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }
    
    return db.query(`
    INSERT INTO users (first_name, last_name, email, password, avatar)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [first_name, last_name, email, password, avatar])
    .then((result)=>{
        return result.rows[0];
    })
}

module.exports.updateUserData = (id, first_name, last_name, email, password, avatar) =>{
    if(!first_name || !last_name || !email || !password){
        return Promise.reject(({status: 400, msg: 'Bad request: missing some properties'}))
    }
   
    return db.query(
        `UPDATE users 
        SET first_name = $1,
        last_name =$2,
        email = $3,
        password = $4,
        avatar = $5
        WHERE user_id = $6
        RETURNING *;`,
        [first_name, last_name, email, password, avatar, id]
    )
    .then((result)=>{
        return result.rows[0];
    })
}


module.exports.removeUserById = (id)=>{
   return  db.query(`DELETE FROM users WHERE user_id = $1`, [id])
}