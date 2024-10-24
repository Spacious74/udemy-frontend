export class UserList {
    username: string;
    headline?: string;
    email: string;
    password: string;
    role: 'student' | 'instructor' | 'admin';
    profileImage: string;
    bio: string;
    coursesCreated: string[];  // Assuming these are ObjectIds, use string for simplicity
    coursesEnrolled: string[];
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

    constructor() {
        this.username = '';
        this.headline = '';
        this.email = '';
        this.password = '';
        this.role = 'student';
        this.profileImage = '';
        this.bio = '';
        this.coursesCreated = [];
        this.coursesEnrolled = [];
        this.wishlist = [];
        this.progress = [];
        this.socialLinks = {
            linkedin: '',
            portfolio: '',
            github: ''
        };
        this.isActive = true;
        this.lastLogin = undefined;
        this.notifications = [];
        this.resetPasswordToken = undefined;
        this.resetPasswordExpires = undefined;
        this.isInstructor = false;
        this.earnings = 0;
        this.payoutMethod = '';
        this.certifications = [];
        this.bookmarkedCourses = [];
    }
}
