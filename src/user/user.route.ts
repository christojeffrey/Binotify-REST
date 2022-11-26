import express from 'express'
const UserRouter = express.Router()
import { createUser, getAllSinger } from './user.controller'

UserRouter.get('/singer', getAllSinger)
UserRouter.post('/', createUser)

export default UserRouter