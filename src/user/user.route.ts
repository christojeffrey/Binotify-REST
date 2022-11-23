import express from 'express'
const UserRouter = express.Router()
import { register, getAll, login } from './user.controller'

UserRouter.get('/user', getAll)
UserRouter.post('/register', register)
UserRouter.post('/login', login)

export default UserRouter