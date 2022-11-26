import { Expose } from 'class-transformer'
import { IsDefined } from 'class-validator';


export class registerDto {
    @IsDefined()
    @Expose()
    name: string;

    @IsDefined()
    @Expose()
    email: string;

    @IsDefined()
    @Expose()
    username: string;

    @IsDefined()
    @Expose()
    password: string;
}

export class loginDto {
    @IsDefined()
    @Expose()
    username: string;

    @IsDefined()
    @Expose()
    password: string;
}