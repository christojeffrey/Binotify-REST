import prisma from '../../prisma/prisma-client';

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: {
            user_id : id
        }
    })
}

export async function getAllUsers() {
    return await prisma.user.findMany()
}