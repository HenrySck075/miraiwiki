import type { User } from "./wikia";

/**
 * Interface for a single recent change or top article entry.
 */
interface ArticleEntry {
    title: string;
    url: string;
    image: string;
}

interface RecentlyChangedArticle extends ArticleEntry {
    id: number;
}

/**
 * Interface for RGB color values.
 */
interface RGBColor {
    r: number;
    g: number;
    b: number;
}

/**
 * Interface for the theme details.
 */
interface Theme {
    "color-body": RGBColor;
    "color-page": RGBColor;
    "color-buttons": RGBColor;
    "color-links": RGBColor;
    "color-body-middle": RGBColor;
    "color-community-header": RGBColor;
    "color-header": RGBColor;
    "background-dynamic": string;
    "page-opacity": string;
    "headings-font": string;
    "background-image": string;
    "background-image-width": string;
    "background-image-height": string;
    "logo-image": string;
    "logo-image-width": string;
    "logo-image-height": string;
    "wordmark-image": string;
    "wordmark-image-width": string;
    "wordmark-image-height": string;
    "community-header-background-image": string;
    "community-header-background-image-width": number;
    "community-header-background-image-height": number;
    "favicon-image": string;
    "background-image-style": string;
    "background-image-display": string;
    "use-logo-in-nav": string;
    "wordmark-image-name": string;
    "wordmark-text": string;
}

/**
 * Interface for language details within wiki variables.
 */
interface Language {
    content: string;
}

/**
 * Interface for discussion maintenance notification details.
 */
interface DiscussionMaintenanceNotification {
    enabled: boolean;
    lockedMessage: string;
    willBeLockedMessage: string;
}

/**
 * Interface for wiki variables.
 */
interface WikiVariables {
    wikiId: string;
    basePath: string;
    dbName: string;
    name: string;
    getStartedUrl: string;
    wikiDescription: string;
    openGraphImageUrl: string;
    language: Language;
    enableDiscussions: boolean;
    gamepediaRedirectUrl: string;
    enableArticleComments: boolean;
    enableMessageWall: boolean;
    isUCP: boolean;
    isMW143: boolean;
    enablePostHistory: boolean;
    directedAtChildren: boolean;
    discussionMaintenanceNotification: DiscussionMaintenanceNotification;
}

/**
 * Interface for wiki details.
 */
interface WikiDetails {
    topUsers: User[];
    pageCount: string;
    editCount: string;
    wordmark: string;
    favicon: string;
}

/**
 * Interface for grant rights details.
 */
interface GrantRights {
    add: any[]; // Assuming an array of any type based on the empty array in the JSON
    remove: any[];
    addSelf: any[];
    removeSelf: any[];
}

/**
 * The main interface for the FeedsAndPosts object.
 */
interface FeedsAndPosts {
    recentChanges: RecentlyChangedArticle[];
    topArticles: ArticleEntry[];
    theme: Theme;
    themeCSSPath: string;
    brandThemeCSSPath: string;
    wikiVariables: WikiVariables;
    wikiDetails: WikiDetails;
    rights: string[];
    grantRights: GrantRights;
    badge: string;
}
