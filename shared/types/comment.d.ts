export interface Post {
    id: string;
    creationDate: {
        nano: number;
        epochSecond: number;
    };
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
        contentImages: {
            id: number;
            position: number;
            url: string;
            width: number;
            height: number;
        }[];
        polls: any[];
        quizzes: any[];
        atMentions: any[];
    };
    createdBy: {
        id: string;
        avatarUrl: string;
        name: string;
        badgePermission: string;
    };
}

export interface Comment {
    id: string;
    creationDate: {
        nano: number;
        epochSecond: number;
    };
    postId: string;
    followed: boolean;
    containerId: string;
    firstPost: Post;
    posts: Post[];
}

interface _CommentModelBase {
    type: string;
}

interface _DocCommentModel extends _CommentModelBase {
    type: "doc";
    content: (_ParagraphCommentModel | _ImageCommentModel | _OpenGraphCommentModel)[];
}
interface _ParagraphCommentModel extends _CommentModelBase {
    type: "paragraph";
    content?: _ContentModel[]
}
interface _ImageCommentModel extends _CommentModelBase {
    type: "image";
    attrs: {
        id: number;
    }
}
interface _OpenGraphCommentModel extends _CommentModelBase {
    type: "openGraph";
    attrs: {
        id: number;
        url: string;
        wasAddedWithInlineLink: boolean
    }
}
interface _ContentModel extends _CommentModelBase {
    type: "text";
    marks: (_LinkContentMarker)[]
    text: string;
}
interface _ContentMarkerBase extends _CommentModelBase {}
interface _LinkContentMarker extends _ContentMarkerBase {
    type: "link"
}

export interface CommentContentModel extends _DocCommentModel {}

export interface CommentResponse {
    links: any[];
    threads: Comment[];
}