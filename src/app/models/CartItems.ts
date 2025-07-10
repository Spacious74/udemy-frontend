export interface CartItem {
  _id: string;
  coursePoster: CoursePoster;
  courseId: string;
  courseName: string;
  coursePrice: number;
  educatorName: string;
  lectures: Number;
  language: string;
  level: string;
}

interface CoursePoster {
  public_id: string;
  url: string;
}