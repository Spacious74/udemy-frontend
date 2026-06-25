export class CourseDetailDto {
    title : string;
    subTitle :string;
    description : string;
    subCategoryId : string;
    price : Number;
    language : String;
    level : String;
    educator : {
        edId :string,
        edname : string,
    }; 
}