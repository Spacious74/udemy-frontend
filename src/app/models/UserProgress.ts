import { SectionList } from "./Course/SectionList";

export interface UserProgress {
  _id?: string;  // optional if returned from MongoDB
  userId: string;  // ObjectId as string reference
  courseId: string;  // ObjectId as string reference

  currentWatchingVideo: {
    videoId: string,
    videoTitle: string,
    videoUrl: string,
    videoPublic_Id: string,
    globalVideoIdx: Number
  };

  videosCompleted: String[];

  startedAt?: Date;
  lastUpdated?: Date;

  createdAt?: Date;  // because timestamps: true
  updatedAt?: Date;
}
