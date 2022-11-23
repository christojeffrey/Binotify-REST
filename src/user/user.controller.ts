import { createUserService,  getUserByUsername, getUserByUsernameEmail } from './user.service';
import { Request, Response } from 'express';
import { registerDto, loginDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { generateToken } from '../common/token';


export async function getAll(req: Request, res: Response) {
    try {

    } catch (err){
        
    }
}

export async function register(req: Request, res: Response) {
    const register_body = plainToClass(registerDto, req.body)
    validate(register_body, {skipMissingProperties: false
    }).then(errors => {
        if (errors.length > 0) {
            res.status(400).send(errors)
        }
    }) 
    try {
        const user_with_same_username_email = await getUserByUsernameEmail(register_body.username, register_body.email)

        if (user_with_same_username_email) {
            res.status(400).send("Username or email already exists")
        } else {
            const newUser = await createUserService(register_body)
            const token_payload = {
                user_id: newUser.user_id,
                username: newUser.username,
                is_admin: newUser.is_admin
            }
    
            const token = generateToken(token_payload)
            res.status(200).send({token: token})
        }

    } catch (err) {
        res.status(500).send(err)
    }
}

export async function login(req: Request, res: Response) {
    const login_body = plainToClass(loginDto, req.body)
    validate(login_body, {skipMissingProperties: false
    }).then(errors => {
        if (errors.length > 0) {
            res.status(400).send(errors)
        }
    }) 
    try {
        const user = await getUserByUsername(login_body.username)
        if (user && user.password == login_body.password) {
            const token_payload = {
                user_id: user.user_id,
                username: user.username,
                is_admin: user.is_admin
            }
            const token = generateToken(token_payload)
            res.status(200).send({token: token})
        } else {
            res.status(400).send("Invalid username or password")
        }
        
    } catch (err) {
        res.status(500).send(err)
    }
}
// create register api and setup jwt
