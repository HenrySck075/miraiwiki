import type { ContributorList } from "./contributor";
import type { Forum } from "./forum";
import type { Thread } from "./thread";

interface href {
  href: string;
}

/// /wikia.php?controller=DiscussionThread&method=getThreads&responseGroup=small&sortDirection=descending&sortKey=trending&viewableOnly=true&limit=20&pivot=4400000000000273078&page=1
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
    "doc:forum": Forum[];
  }
}