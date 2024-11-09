import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "../config/env";
import decodeAccessToken from "./decodeAccessToken";

const middleware = express()

middleware.use(express.json())
middleware.use(express.urlencoded({extended: false}))
middleware.use(cookieParser())
middleware.use(express.static("public"))
middleware.use(cors({
    origin: env.cors,  // Allow specific origin (frontend URL)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods
    credentials: true,  // If you're sending cookies or authentication headers
  }));
middleware.use(decodeAccessToken)


export default middleware