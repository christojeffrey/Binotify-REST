import prisma from '../../prisma/prisma-client';
import { registerDto, loginDto } from './user.dto';

export async function getUserByIdService(id: number) {
    try{
        return prisma.user.findUnique({
            where: {
                user_id : id
            }
        })
    } catch (error) {
        throw new Error("Error fetching user data")
    }
    
}

export async function getUserByUsernameService(username: string) {
    try{
        return prisma.user.findUnique({
            where: {
                username: username
            }
        })
    } catch (error) {
        throw new Error("Error fetching user data")
    }
    
}

export async function getUserByUsernameEmailService(username: string, email: string) {
    try{
        return prisma.user.findFirst({
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



// export async function getAllUsersService() {
//     return await prisma.user.findMany()
// }

export async function createUserService(register_body: registerDto) {
    try {
       return prisma.user.create({
            data: register_body
        })
    } catch (error) {
        throw new Error("Error creating user")
    }
}

