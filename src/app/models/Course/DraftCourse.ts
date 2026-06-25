export class DraftCourse {
    _id:string;
    title: string;
    subTitle: string;
    description: any;
    subCategoryId: any;
    price: number;
    language: string;
    level: string;
    totalLectures : number;
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
    };
    totalStudentsPurchased : number;
    courseModuleId : string;
    isReleased : boolean;
    updatedAt : Date;
    createdAt : Date;
}