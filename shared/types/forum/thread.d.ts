import type { ContentImage, Timestamp, User } from "../wikia";

export interface Tag {
  siteId: string;
  articleId: string;
  articleTitle: string;
  relativeUrl: string;
  image: string | null;
}

export interface Attachment {
  atMentions: any[]; // You might want to define a more specific type for atMentions if known
  contentImages: ContentImage[];
  openGraphs: any[]; // You might want to define a more specific type for openGraphs if known
  polls: any[]; // You might want to define a more specific type for polls if known
  quizzes: any[]; // You might want to define a more specific type for quizzes if known
}

export interface UserData {
  hasReported: boolean;
  hasUpvoted: boolean;
}

export interface Embedded {
  contentImages: ContentImage[];
  attachments: Attachment[];
  userData: UserData[];
}

export interface Poll {
  // Define the structure of the poll object if it's ever present
  // For example:
  // id: string;
  // question: string;
  // options: { id: string; text: string; votes: number; }[];
  // totalVotes: number;
}

export interface Thread {
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
  _embedded: Embedded;
}

