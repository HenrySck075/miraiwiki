export interface User {
  id: string;
  avatarUrl: string;
  name: string;
  badgePermission: string;
}

export interface Timestamp {
  nano: number;
  epochSecond: number;
}

export interface ContentImage {
  height: number;
  id: number;
  mediaType?: string;
  position: number;
  url: string;
  width: number;
}

