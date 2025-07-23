
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


