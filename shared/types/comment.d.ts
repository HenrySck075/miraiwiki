import type { ContentImage, Timestamp, User } from "./wikia";
import type { DocModel } from "./wikia_doc";

export interface Post {
    id: string;
    creationDate: Timestamp;
    upvoteCount: number;
    userData: {
        postId: number;
        hasUpvoted: boolean;
        permissions: {
            canEdit: boolean;
            canDelete: boolean;
        };
        isReported: boolean;
    };
    jsonModel: string;
    attachments: {
        openGraphs: {
            id: string;
            postRevisionId: number;
            siteId: number;
            url: string;
            siteName: string;
            title: string;
            type: string;
            imageUrl: string;
            description: string;
            originalUrl: string;
            imageHeight: number;
            imageWidth: number;
            dateRetrieved: {
                nano: number;
                epochSecond: number;
            };
        }[];
        contentImages: ContentImage[];
        polls: any[];
        quizzes: any[];
        atMentions: any[];
    };
    createdBy: User;
}

export interface Comment {
    id: string;
    creationDate: Timestamp;
    postId: string;
    followed: boolean;
    containerId: string;
    firstPost: Post;
    posts: Post[];
}

export interface CommentContentModel extends DocModel {}

export interface CommentResponse {
    links: any[];
    threads: Comment[];
}
