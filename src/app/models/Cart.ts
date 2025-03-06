export interface Cart {
    _id? : string,
    courseId: string,
    coursePoster: {
        public_id: string,
        url: string,
    },
    courseName: string,
    coursePrice: number,
    educatorName:string,
    level : string,
    language : string,
    subTitle : string
}