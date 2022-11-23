const jwt = require("jsonwebtoken");

export function generateToken(payload: {user_id: number, username: string, is_admin: boolean}) {
    let jwt_secret_key = process.env.JWT_SECRET_KEY
    const token = jwt.sign(payload, jwt_secret_key)
    return token
}  

export function verifyToken(token: string) {
    let jwt_secret_key = process.env.JWT_SECRET_KEY
    const verified_user = jwt.verify(token, jwt_secret_key)

    return verified_user
}