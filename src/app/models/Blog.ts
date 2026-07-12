export interface Blog {
    _id?: string;
    title: string;
    content: string;
    author?: any; // Assuming it comes populated from backend
    coverImage?: any;
    tags?: string[];
    isPublished?: boolean;
    slug?: string;
    likes?:number;
    createdAt?: string;
    updatedAt?: string;
}
