export interface CartItem {
  _id: string;
  coursePoster: CoursePoster;
  courseId: string;
  courseName: string;
  coursePrice: number;
  educatorName: string;
}

interface CoursePoster {
  public_id: string;
  url: string;
}