import { PrismaClient } from '@prisma/client'
import express from 'express'
const port = process.env.PORT || 3000;
import UserRouter from './user/user.route'


const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
    res.json({ message: 'Hello World' })
})

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });