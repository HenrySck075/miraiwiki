import type { Timestamp, User } from "../wikia";
import type { Attachments } from "../wikia_doc";

interface ThreadPost {
  _links: {
    permalink: {
      href: string;
    }[];
  };
  createdBy: User;
  creationDate: Timestamp;
  creatorId: string;
  /// WHAT
  creatorIp: string;
  id: string;
  isContentSuppressed: boolean;
  isDeleted: boolean;
  isEditable: boolean;
  isLocked: boolean;
  isReported: boolean;
  jsonModel: string;
  latestRevisionId: string;
  modificationDate: {
    nano: number;
    epochSecond: number;
  };
  position: number;
  rawContent: string;
  renderedContent: string | null;
  requesterId: string;
  siteId: string;
  threadId: string;
  /// Only a string if it is the first post
  title: string | null;
  upvoteCount: number;
  _embedded: {
    attachments: Attachment[];
    latestRevision: {
      creationDate: Timestamp;
      creatorId: string;
      creatorIp: string;
      id: string;
      jsonModel: string;
      postId: string;
      rawContent: string;
      renderedContent: string | null; 
    }[];
    userData?: {
      hasReported: boolean;
      hasUpvoted: boolean;
    }[]
  };
}