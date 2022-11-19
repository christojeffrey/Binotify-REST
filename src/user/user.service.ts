import prisma from '../../prisma/prisma-client';
import { CreateUserDto } from './user.dto';

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: {
            user_id : id
        }
    })
}

export async function getAllUsersService() {
    return await prisma.user.findMany()
}

export async function createUserService(user: CreateUserDto) {
    try {
        return await prisma.user.create({
            data: user
        })
    } catch (error) {
        throw new Error("Error creating user")
    }
}