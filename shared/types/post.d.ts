import type { Timestamp } from "./wikia";
import type { Attachment } from "./wikia_doc";

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