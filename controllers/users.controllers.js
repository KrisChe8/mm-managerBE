const {fetchAllUsers, fetchUserById, insertNewUser, updateUserData, removeUserById} = require('../models/users.models')

const {checkEmailExist, checkEmailDoesNotExist, checkUserExistById} = require('../utils/checkExistence')

module.exports.getAllUsers = (req, res, next)=>{
    const {email} = req.query;

    const usersQuery = fetchAllUsers(email);

    const queries = [usersQuery]

    if(email){
        const emailExistenceQuery = checkEmailExist(email);
        queries.push(emailExistenceQuery)
    }

    Promise.all(queries)
    .then((response)=>{
        const users = response[0];
        res.status(200).send({users})
    })
    .catch((err)=>{
        next(err);
    })
}

module.exports.getUserById = (req, res, next)=>{
   const {id} = req.params
    fetchUserById(id)
    .then((user)=>{
        res.status(200).send({user})
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports.postNewUser = (req, res, next)=>{
    const {first_name, last_name, email, password, avatar} = req.body;

    const emailExistenceQuery = checkEmailDoesNotExist(email);
    const insertNewUserQuery = insertNewUser(first_name, last_name, email, password, avatar);
    const queries = [insertNewUserQuery, emailExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const user = response[0];
        res.status(201).send({user})
    })
    .catch((err)=>{
        next(err)
    })

}


module.exports.patchUserData = (req, res, next)=>{
    const {first_name, last_name, email, password, avatar} = req.body;
    const {id} = req.params;

    const userExistenceQuery = checkUserExistById(id);
    const updateUserQuery = updateUserData(id,first_name, last_name, email, password, avatar)
    const queries = [updateUserQuery, userExistenceQuery];

    Promise.all(queries)
    .then((response)=>{
        const user = response[0];
        res.status(200).send({user});
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports.deleteUserById = (req, res, next)=>{
    const {id} = req.params;

    const userExistenceQuery = checkUserExistById(id);
    const deleteUserQuery = removeUserById(id);
    const queries = [deleteUserQuery, userExistenceQuery];
    
    Promise.all(queries)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })
}