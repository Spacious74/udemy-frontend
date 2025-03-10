export class UserDto {
    userId ?: string;
    username? : string = '';
    email ?: string = '';
    bio ?: string = '';
    profileImage?: string = '';
    role?:string;
    socialLinks?: {
        linkedin: string;
        portfolio: string;
        github: string;
    } = {
        linkedin  : '',
        portfolio : '',
        github : ''
    }
}