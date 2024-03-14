const userRouter = require('express').Router();
const {getAllUsers, getUserById, postNewUser, patchUserData, deleteUserById} = require('../controllers/users.controllers')

userRouter.route('/')
.get(getAllUsers)
.post(postNewUser)

userRouter.route("/:id")
.get(getUserById)
.patch(patchUserData)
.delete(deleteUserById)

module.exports = userRouter;