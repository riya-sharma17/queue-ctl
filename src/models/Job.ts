import { JobState } from "../enums/JobState";

export interface Job{
      id: string;
    command: string;
    state: JobState;
    attempts: number;
    priority: number;
    maxRetries: number;
    createdAt: Date;
    updatedAt: Date;
}