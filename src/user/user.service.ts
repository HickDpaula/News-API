import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { Prisma, Users } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from "./dtos/updateUser.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(data: Prisma.UsersCreateInput): Promise<Users> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(data?.password, saltOrRounds);
        
        const userData: Prisma.UsersCreateInput = {
                ...data,
                password: passwordHashed,
            };
            

        const newUser = await this.prismaService.users.create({
            data: userData,
        });

        return newUser;
    }

    public async findByEmail(email: string): Promise<Users | null> {
        const user = await this.prismaService.users.findFirst({
            where: { email },
        });

        return user; 
    } 

    public async findById(id: string): Promise <Users | null> {
        const user = await this.prismaService.users.findFirst({
           where: {id} , 
        });
        return user;
     }

     public async update(params: {
        id: string,
        data: UpdateUserDto
     }): Promise<Users> {
        const {id, data} = params;
        const {email, name} = data;
        const updateUser = await this.prismaService.users.update({
            where: { id },
            data: { name, email },
        })
        
        return updateUser
     }
        
    }

