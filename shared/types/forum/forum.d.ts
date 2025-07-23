import type { Timestamp, User } from "../wikia";

export interface LatestContribution {
    siteId: number|null;
    forumId: number|null;
    item: string|null;
    itemId: number|null;
    author: number|null;
    date?: Timestamp;
}

export interface Forum {
    allowsThreads: boolean;
    creationDate: Timestamp;
    creatorId: string;
    description: string;
    displayOrder: number;
    id: string;
    imageUrl: string | null;
    isDeleted: boolean;
    isEditable: boolean;
    isLocked: boolean;
    latestContribution: LatestContribution;
    name: string;
    parentId: string;
    postCount: number;
    recentContributors: User[];
    requesterId: string;
    siteId: string;
    threadCount: number;
}