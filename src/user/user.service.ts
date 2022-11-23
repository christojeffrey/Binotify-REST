import prisma from '../../prisma/prisma-client';
import { registerDto, loginDto } from './user.dto';

export async function getUserById(id: number) {
    try{
        return await prisma.user.findUnique({
            where: {
                user_id : id
            }
        })
    } catch (error) {
        throw new Error("Error fetching user data")
    }
    
}

export async function getUserByUsername(username: string) {
    try{
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        })
    } catch (error) {
        throw new Error("Error fetching user data")
    }
    
}

export async function getUserByUsernameEmail(username: string, email: string) {
    try{
        return await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: username
    
                    },
                    {
                        email: email
                    }
                ]
            }
        })
    } catch (error) {
        throw new Error("Error fetching user data")
    }
}



export async function getAllUsersService() {
    return await prisma.user.findMany()
}

export async function createUserService(register_body: registerDto) {
    try {
       return await prisma.user.create({
            data: register_body
        })
    } catch (error) {
        throw new Error("Error creating user")
    }
}

