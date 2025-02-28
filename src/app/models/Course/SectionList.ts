import { VideoList } from "./VideoList";

export interface SectionList {
    _id : string;
    sectionName: string;
    videos : VideoList[];
}