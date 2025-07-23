
interface ModelBase {
    type: string;
}

export interface DocModel extends ModelBase {
    type: "doc";
    content: (ParagraphModel | ImageModel | OpenGraphModel)[];
}
interface ParagraphModel extends ModelBase {
    type: "paragraph";
    content?: ContentModel[]
}
interface ImageModel extends ModelBase {
    type: "image";
    attrs: {
        id: number;
    }
}
interface OpenGraphModel extends ModelBase {
    type: "openGraph";
    attrs: {
        id: number;
        url: string;
        wasAddedWithInlineLink: boolean
    }
}
interface ContentModel extends ModelBase {
    type: "text";
    marks: (LinkContentMarker)[]
    text: string;
}
interface ContentMarkerBase extends ModelBase {}
interface LinkContentMarker extends ContentMarkerBase {
    type: "link"
}








export interface OpenGraph {
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
};
export interface Attachment {
  atMentions: any[]; // You might want to define a more specific type for atMentions if known
  contentImages: ContentImage[];
  openGraphs: OpenGraph[]; // You might want to define a more specific type for openGraphs if known
  polls: any[]; // You might want to define a more specific type for polls if known
  quizzes: any[]; // You might want to define a more specific type for quizzes if known
}


export interface Attachments {
  contentImages: ContentImage[];
  attachments: Attachment[];
  userData: UserData[];
}