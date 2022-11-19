import express from 'express'
const UserRouter = express.Router()
import { createUser, getAll } from './user.controller'

UserRouter.get('/', getAll)
UserRouter.post('/', createUser)

export default UserRouter