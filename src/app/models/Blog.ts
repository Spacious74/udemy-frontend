export interface Blog {
    _id?: string;
    title: string;
    content: string;
    author?: any; // Assuming it comes populated from backend
    coverImage?: string;
    tags?: string[];
    isPublished?: boolean;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
}
