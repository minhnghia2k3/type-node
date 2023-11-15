// Web framework for nodejs
import express from "express";
import http from "http";
// Parse incoming request `req.body`
import bodyParser from "body-parser";
// Parse cookie header and populate `req.cookies`
import cookieParse from "cookie-parser";
// Nodejs compression middleware: nén
import compression from "compression";
// Cross-origin resource sharing
import cors from "cors";
// Import mongoose -> ODM for mongodb
import mongoose, { Error } from "mongoose";
import router from "./router/index"

const app = express();
app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParse());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/")
})

const MONGODB_URL = "mongodb+srv://brozennvn:Ng26012003@type-node.fsywdbl.mongodb.net/?retryWrites=true&w=majority"

// init mongoose
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connected successfully to Mongodb")
    })
    .catch((error: Error) => {
        console.log("Connect to Mongodb failed with error: ", error)
    })

app.use('/', router());