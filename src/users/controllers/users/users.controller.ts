import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    findUsers(): Promise<User[]> {
        return this.usersService.findUsers();
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        const { confirmPassword, ...userDetails } = createUserDto;
        return this.usersService.createUser(userDetails);
    }

    @Patch('/:id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        await this.usersService.updateUser(id, updateUserDto);
    }

    @Delete('/:id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.deleteUser(id);
    }

    @Post('/:id/profiles')
    createUserProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserProfileDto: CreateUserProfileDto
    ): Promise<User> {
        return this.usersService.createUserProfile(id, createUserProfileDto);
    }

    @Post('/:id/posts')
    createUserPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() createUserPostDto: CreateUserPostDto
        ) {
            return this.usersService.createUserPost(id, createUserPostDto);
        }

}
