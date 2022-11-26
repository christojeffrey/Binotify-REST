import { createUserService, getAllSingerService } from './user.service';
import { Request, Response } from 'express';
import { CreateUserDto } from './user.dto';
import {plainToClass} from 'class-transformer';
import { validate } from 'class-validator';


export async function getAllSinger(req: Request, res: Response) {
    try {
        const singers = await getAllSingerService()
        res.status(200).json(singers)
    } catch (err){
        res.status(500).json(err)
    }
}

export async function createUser(req: Request, res: Response) {
    const user = plainToClass(CreateUserDto, req.body)
    validate(user, {skipMissingProperties: true}).then(errors => {
        if (errors.length > 0) {
            res.status(400).send(errors)
        }
    }) 
    try {
        const newUser = await createUserService(user)
        res.status(201).send(newUser)
    } catch (err) {
        res.status(500).send(err)
    }
}
 
