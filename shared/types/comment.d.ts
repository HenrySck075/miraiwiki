import type { ContentImage, Timestamp, User } from "./wikia";
import type { Attachment, DocModel } from "./wikia_doc";
import type { Post } from "./post";

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
