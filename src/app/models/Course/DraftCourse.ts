export interface DraftCourse {
    _id:string;
    title: string;
    subTitle: string;
    description: string;
    category: string;
    subCategory: string;
    price: Number;
    language: String;
    level: String;
    educator: {
        edId: string,
        edname: string,
    };
    coursePoster : {
        public_id :string,
        url : string
    },
    totalStudentsPurchased : number,
    courseModuleId : string,
}