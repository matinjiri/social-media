import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    // INTRACT WITH DB
    // inject typeorm repo into our class 
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
    ) { }

    findUsers(): Promise<User[]> {
        return this.userRepository.find({ relations: ['profile', 'posts'] }) // it shows profile and .. relations if they exist
    }

    createUser(userDetails: CreateUserParams): Promise<User> {
        const newUser = this.userRepository.create({
            ...userDetails,
            createAt: new Date(),
        });

        return this.userRepository.save(newUser);
    }

    updateUser(id: number, updateUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updateUserDetails })
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    async createUserProfile(id: number, createUserProfileDetails: CreateUserProfileParams): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new HttpException(
            "User not found. Cannot create Profile",
            HttpStatus.BAD_REQUEST
        );

        const newProfile = this.profileRepository.create({ ...createUserProfileDetails });
        const savedProfile = await this.profileRepository.save(newProfile);
        user.profile = savedProfile;
        return this.userRepository.save(user);
    }

    async createUserPost(id: number, createUserPostDetails: CreateUserPostParams): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new HttpException(
            "User not found. Cannot create Profile",
            HttpStatus.BAD_REQUEST
        );

        const newPost = this.postRepository.create({ ...createUserPostDetails , user});
        return this.postRepository.save(newPost);
    }
}
