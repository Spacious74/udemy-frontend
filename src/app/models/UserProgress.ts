import { SectionList } from "./Course/SectionList";

export interface UserProgress {
  _id?: string;  // optional if returned from MongoDB
  userId: string;  // ObjectId as string reference
  courseId: string;  // ObjectId as string reference
  lastWatchedVideo?: string;  // optional ObjectId

  sectionArr: SectionList[];

  startedAt?: Date;
  lastUpdated?: Date;

  createdAt?: Date;  // because timestamps: true
  updatedAt?: Date;
}
