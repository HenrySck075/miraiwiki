import type { ContributorList } from "./contributor";
import type { Forum } from "./forum";
import type { Thread } from "./thread";

interface href {
  href: string;
}

export interface DiscussionThreads {
  _links: {
    first: href[],
    next?: href[],
    previous?: href[]
  },
  postCount: number,
  readOnlyMode: boolean,
  requesterId: string,
  siteId: number,
  threadCount: number,
  _embedded: {
    forums: Forum[],
    threads: Thread[],
    contributors: ContributorList[]
  }
}

export interface DiscussionForums extends Forum {
  _embedded: {
    "doc:forum"?: Forum[];
  }
}