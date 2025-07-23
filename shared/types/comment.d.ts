import type { ContentImage, Timestamp, User } from "./wikia";
import type { Attachment, DocModel } from "./wikia_doc";

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
    attachments: Attachment;
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
