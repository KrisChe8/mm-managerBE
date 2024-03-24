const {fetchAllEndpoints} = require('../models/endpoints.models')
module.exports.getEnspoints = (req, res, next) =>{
    fetchAllEndpoints()
    .then((instructions)=>{
        res.status(200).send({instructions})
    })
    .catch((err)=>{
        next(err)
    })
}