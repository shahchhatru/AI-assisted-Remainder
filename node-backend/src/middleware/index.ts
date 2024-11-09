import express from "express"
import cookieParser from "cookie-parser"
import decodeAccessToken from "./decodeAccessToken"

const middleware = express()

middleware.use(express.json())
middleware.use(express.urlencoded({extended: false}))
middleware.use(cookieParser())
middleware.use(express.static("public"))
middleware.use(decodeAccessToken)


export default middleware