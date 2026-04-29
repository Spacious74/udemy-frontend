import { DraftCourse } from "./Course/DraftCourse";

export class UserList {
    _id : string;
    username: string;
    headline?: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin';
    profileImage: string;
    bio: string;
    coursesCreated: string[];  // Assuming these are ObjectIds, use string for simplicity
    coursesEnrolled: DraftCourse[];
    wishlist: string[];
    progress: {
        courseId: string;
        completedLectures: number;
        totalLectures: number;
    }[];
    socialLinks: {
        linkedin?: string;
        portfolio?: string;
        github?: string;
    };
    isActive: boolean;
    lastLogin?: Date;
    notifications: {
        type: string;
        message: string;
        read: boolean;
        createdAt: Date;
    }[];
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    isInstructor: boolean;
    earnings: number;
    payoutMethod: string;
    certifications: {
        courseId: string;
        certificateUrl: string;
    }[];
    bookmarkedCourses: string[];


}
