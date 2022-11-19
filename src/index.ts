import express from 'express'
import {Request, Response} from 'express'
const port = process.env.PORT || 3000;
import UserRouter from './user/user.route'
let morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('combined'))

app.get('/', async (req:Request, res: Response) => {
    res.json({ message: 'Hello World' })
})

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Binotify REST app listening at http://localhost:${port}`)
  });