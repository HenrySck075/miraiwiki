import type { Post } from "../comment";
import type { ContentImage, Timestamp, User } from "../wikia";
import type { Attachment, Attachments } from "../wikia_doc";
import type { ThreadPost } from "./thread_post";

export interface Tag {
  siteId: string;
  articleId: string;
  articleTitle: string;
  relativeUrl: string;
  image: string | null;
}

export interface UserData {
  hasReported: boolean;
  hasUpvoted: boolean;
}

export interface Poll {
  // Define the structure of the poll object if it's ever present
  // For example:
  // id: string;
  // question: string;
  // options: { id: string; text: string; votes: number; }[];
  // totalVotes: number;
}

interface ThreadInternal {
  createdBy: User;
  creationDate: Timestamp;
  firstPostId: string;
  forumId: string;
  forumName: string;
  funnel: string;
  id: string;
  isContentSuppressed: boolean;
  isDeleted: boolean;
  isEditable: boolean;
  isFollowed: boolean;
  isLocked: boolean;
  isReported: boolean;
  jsonModel: string;
  lastEditedBy: User;
  lastPostId: string;
  latestRevisionId: string;
  modificationDate: Timestamp;
  page: number;
  postCount: number;
  rawContent: string;
  renderedContent: string | null;
  requesterId: string;
  siteId: string;
  source: string;
  tags: Tag[];
  title: string;
  trendingScore: number;
  upvoteCount: number;
  poll?: Poll; // Optional poll object
}

export interface Thread extends ThreadInternal {
  _embedded: Attachments;
}

interface AttachmentsExtra extends Attachments {
  /// theres firstPost but its essentially Thread but represented as a Comment
  "doc:posts": ThreadPost[];
}

export interface ThreadExtra extends ThreadInternal {
  _embedded: AttachmentsExtra;
}