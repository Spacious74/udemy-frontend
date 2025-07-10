export interface DraftCourse {
    _id:string;
    title: string;
    subTitle: string;
    description: string;
    category: string;
    subCategory: string;
    price: number;
    language: string;
    level: string;
    totalLectures : number,
    educator: {
        edId: {
            _id : string,
            username: string,
            profileImage : string
        },
        edname: string,
    };
    coursePoster : {
        public_id :string,
        url : string
    },
    totalStudentsPurchased : number,
    courseModuleId : string,
    isReleased : boolean,
    updatedAt : Date,
    createdAt : Date
}