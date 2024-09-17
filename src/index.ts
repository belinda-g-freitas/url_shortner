import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import favicon from "serve-favicon";
// import rateLimiter  from 'express-rate-limit';
import path from "path";

dotenv.config();
//
const server = express();
const port = process.env.PORT;

server.use(favicon(path.join(__dirname, "public", "pictures", "favicon.ico")));
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.disable("x-powered-by"); // less hackers know about our stack
const routers = require("./routes/index");

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
