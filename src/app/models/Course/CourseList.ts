export interface CourseList {
    _id : string;
    title: string;
    subTitle: string;
    description: string;
    subCategoryId: string;
    price: Number;
    language: String;
    level: String;
    educator: {
        edId: string,
        edname: string,
    };
    reviewArr: [
        {
            userId: string,
            username: string,
            rating: string,
            desc: string,
        }
    ],

}