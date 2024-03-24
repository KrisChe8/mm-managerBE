const express = require("express");
const cors = require("cors");

const {
    psqlErrorHandler,
    customErrorHandler,
    serverErrorHandler
} = require("./error-handler");


require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

const indexRouter = require("./routes/indexRoute");
app.use('/api', indexRouter)

// app.listen(process.env.PORT || 4000, ()=>{
//     console.log("Server listening on PORT 4000")
// })


app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);


module.exports = app;