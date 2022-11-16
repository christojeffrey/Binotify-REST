import express from 'express'
const UserRouter = express.Router()
import { getAll } from './user.controller'

UserRouter.get('/', getAll)

export default UserRouter