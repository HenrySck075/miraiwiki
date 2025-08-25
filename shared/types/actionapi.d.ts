/**
 * A selection of MediaWiki response interfaces.
 */


import type { Spread } from "./objmerger";

export namespace API {
  export interface ResponseBase {
    batchcomplete: boolean;
    continue?: Record<string, string>;
  }
  export type Response<A extends readonly [...any]> = Spread<[ResponseBase, ...A]>;
}

namespace User {
  interface UserOptions {
    [key: string]: string | number | boolean;
    math: string;
    "math-popups": string;
    "visualeditor-autodisable": number;
    "visualeditor-betatempdisable": number;
    "visualeditor-collab": number;
    "visualeditor-editor": string;
    "visualeditor-enable": number;
    "visualeditor-hidebetawelcome": number;
    "visualeditor-hidetabdialog": number;
    "visualeditor-newwikitext": number;
    "visualeditor-tabs": string;
    "usebetatoolbar": boolean;
    "wikieditor-realtimepreview": number;
    "usecodeeditor": number;
    "usecodemirror": number;
    "usecodemirror-colorblind": number;
    "codemirror-preferences": string;
    "mobile-editor": string;
    "reverb-email-frequency": number;
    "echo-subscriptions-web-edit-thank": boolean;
    "echo-subscriptions-email-edit-thank": boolean;
    "disablesuggest": number;
    "editfont": string;
    "editsection": number;
    "enotifdiscussionsfollows": number;
    "enotifdiscussionsvotes": number;
    "enotifdiscussionsmentions": number;
    "enotifminoredits": number;
    "enotifthanks": number;
    "enotifwallthread": number;
    "extendwatchlist": number;
    "externaldiff": number;
    "externaleditor": number;
    "global-keyboard-shortcuts": number;
    "highlightbroken": number;
    "htmlemails": number;
    "justify": number;
    "nocache": number;
    "noconvertlink": number;
    "onsite-thanks": number;
    "quickbar": number;
    "rememberpassword": number;
    "reverb-user-interest-email-thanks": number;
    "reverb-user-interest-web-thanks": number;
    "searchlimit": number;
    "showjumplinks": number;
    "showtoc": number;
    "showtoolbar": number;
    "thumbsize": number;
    "walldelete": number;
    "wallshowsource": number;
    "watchdeletion": number;
    "watchlistdays": number;
    "watchlistdigest": number;
    "watchuploads": number;
    "ccmeonemails": number;
    "date": string;
    "diffonly": number;
    "diff-type": string;
    "disablemail": number;
    "editondblclick": number;
    "editrecovery": number;
    "editsectiononrightclick": number;
    "email-allow-new-users": number;
    "enotifrevealaddr": number;
    "enotifusertalkpages": number;
    "enotifwatchlistpages": number;
    "fancysig": number;
    "forceeditsummary": number;
    "forcesafemode": number;
    "gender": string;
    "hidecategorization": number;
    "hideminor": number;
    "hidepatrolled": number;
    "imagesize": number;
    "minordefault": number;
    "newpageshidepatrolled": number;
    "nickname": string;
    "norollbackdiff": number;
    "prefershttps": number;
    "previewonfirst": number;
    "previewontop": number;
    "pst-cssjs": number;
    "rcdays": number;
    "rcenhancedfilters-disable": number;
    "rclimit": number;
    "requireemail": number;
    "search-match-redirect": boolean;
    "search-special-page": string;
    "search-thumbnail-extra-namespaces": boolean;
    "showhiddencats": number;
    "shownumberswatching": number;
    "showrollbackconfirmation": number;
    "skin": string;
    "skin-responsive": number;
    "underline": number;
    "useeditwarning": number;
    "uselivepreview": number;
    "usenewrc": number;
    "watchcreations": number;
    "watchdefault": number;
    "watchlisthideanons": number;
    "watchlisthidebots": number;
    "watchlisthidecategorization": number;
    "watchlisthideliu": number;
    "watchlisthideminor": number;
    "watchlisthideown": number;
    "watchlisthidepatrolled": number;
    "watchlistreloadautomatically": number;
    "watchlistunwatchlinks": number;
    "watchmoves": number;
    "watchrollback": number;
    "wlenhancedfilters-disable": number;
    "wllimit": number;
    "timecorrection": string;
    "language": string;
    "variant": string;
    "variant-ban": string;
    "variant-en": string;
    "variant-crh": string;
    "variant-gan": string;
    "variant-iu": string;
    "variant-ku": string;
    "variant-mni": string;
    "variant-sh": string;
    "variant-shi": string;
    "variant-sr": string;
    "variant-tg": string;
    "variant-tly": string;
    "variant-uz": string;
    "variant-wuu": string;
    "variant-zgh": string;
    "variant-zh": string;
    "searchNs0": number;
    "searchNs1": number;
    "searchNs2": number;
    "searchNs3": number;
    "searchNs4": number;
    "searchNs5": number;
    "searchNs6": number;
    "searchNs7": number;
    "searchNs8": number;
    "searchNs9": number;
    "searchNs10": number;
    "searchNs11": number;
    "searchNs12": number;
    "searchNs13": number;
    "searchNs14": number;
    "searchNs15": number;
    "searchNs110": number;
    "searchNs111": number;
    "searchNs420": number;
    "searchNs421": number;
    "searchNs500": number;
    "searchNs501": number;
    "searchNs502": number;
    "searchNs503": number;
    "searchNs828": number;
    "searchNs829": number;
    "searchNs1200": number;
    "searchNs1201": number;
    "searchNs1202": number;
    "searchNs2000": number;
    "searchNs2001": number;
    "searchNs2002": number;
    "searchNs2900": number;
    "searchNs2901": number;
    "popups-reference-previews": string;
    "visualeditor-hidesourceswitchpopup": number;
    "visualeditor-hidevisualswitchpopup": number;
    "showAds": number;
    "enableGoSearch": boolean;
    "mf_amc_optin": number;
    "category-page-layout": string;
    "nav-collapsed": string;
    "rcfilters-limit": string;
    "avatar": string;
    "bio": string;
    "discordHandle": string;
    "fbPage": string;
    "name": string;
    "twitter": string;
    "website": string;
    "username": string;
    "editor": string;
    "editortype": string;
    "rcfilters-rc-collapsed": number;
    "rcfilters-saved-queries": string;
    "rightrailvisible": string;
    "theme": string;
    "userlandingpage": string;
  }
  interface InfoObj {
    id: number;
    name: string;
    options?: Options;
  }
}

export namespace Query {
  export type UserInfo = ({ userinfo: User.InfoObj });
  export type AllUsers = ({
    allusers: {
      userid: number;
      name: string;
    }[]
  });


  export namespace Pages {
    export type Pages<A extends readonly [...object] = []> = ({
      pages: objs.Page<A>[]
    });

    export namespace prop {
      export interface Info {
        contentmodel: string,
        pagelanguage: string,
        pagelanguagehtmlcode: string,
        pagelanguagedir: string,
        touched: string,
        lastrevid: number,
        length: number
      }

      interface PageImage_Info {
        source: string,
        width: number,
        height: number
      }

      export type PageImages<A extends readonly [...any] = [PageImages_name, PageImages_thumbnail]> = Spread<A>;
      
      export interface PageImages_name { pageimage: string }
      export interface PageImages_thumbnail { thumbnail: PageImage_Info }
      export interface PageImages_original { original: PageImage_Info }


      export type CategoryInfo = {
        categoryinfo: {
          size: number,
          pages: number,
          files: number,
          subcats: number,
          hidden: boolean
        }
      }

      export type ArticleSnippet = ({ extract: string });
    }
  }

  export namespace objs {
    export type Page<A extends readonly [...object] = []> = Spread<[{
      pageid: number,
      ns: number,
      title: string,
    }, ...A]>;
    export interface Namespace {
      id: number,
      case: string,
      name: string,
      subpages: boolean,
      canonical: string,
      content: boolean,
      nonincludable: boolean
    };
    export namespace LogEvent {
      export interface Base {
        logid: number;
        ns: number;
        title: string;
        pageid: number;
        logpage: number;
        revid: number;
        params: {};
        type: string;
        action: string;
        user: string;
        timestamp: string;
        parsedcomment: string;
      }
      export interface BaseTyped<T extends string, A extends string, PT extends object = {}> extends Base {
        params: PT;
        type: T;
        action: A;
      }
      export type LogEventParam<T> = T extends BaseTyped<string, string, infer U> ? U : never;

      export type Base2<T extends string, PT extends object = {}> = BaseTyped<T, T, PT>

      export type Block = BaseTyped<"block", "block" | "reblock", {
        duration: string,
        flags: string[],
        restrictions?: {
          namespaces?: number[],
          pages?: {
            page_ns: number,
            page_title: string
          }[]
        },
        sitewide: boolean,
        /// empty means indefinite (duration: infinity)
        expiry?: string
      }>;
      export type AFProtectedVars = BaseTyped<"abusefilter-protected-vars", string>;
      export type AFCreate = BaseTyped<"abusefilter", "create">;
      export type AFHit = BaseTyped<"abusefilter", "hit">;
      export type AFModify = BaseTyped<"abusefilter", "hit">;
      export type Unblock = BaseTyped<"block", "unblock">;
      export type Create = Base2<"create">;
      export type Delete = Base2<"delete">;
      export type Move = Base2<"move", {
        target_ns: number,
        target_title: string,
        // no redirect
        suppressredirect: boolean
      }>;
      export type Protect = Base2<"protect", {
        description: string;
        cascade: boolean;
        details: {
          type: string;
          level: string;
          expiry: string;
          cascade: boolean;
        }[];
      }>;
      export type Patrol = Base2<"patrol", {
        curid: number,
        previd: 0, // seemingly unused?
        auto: boolean
      }>;
      export type Thank = BaseTyped<"thanks", "thank">;
      export type Upload = Base2<"upload", {
        img_sha1: string,
        img_timestamp: string
      }>;
      export type NewUser = BaseTyped<"newusers", "create">;

      export type Everything = (
        Create |
        Upload |
        Move |
        Delete |
        Protect |
        Patrol |
        Thank |
        Block |
        Unblock |
        NewUser |
        AFCreate |
        AFHit |
        AFModify |
        AFProtectedVars
      )
    }
    export interface HistoryEntry {
      type: "edit" | "new" | "external" | "categorize";
      ns: number;
      title: string;
      pageid: number;
      revid: number;
      old_revid: number;
      rcid: number;
      bot: boolean;
      new: boolean;
      minor: boolean;
      oldlen: number;
      newlen: number;
      timestamp: string;
      comment: string;
      parsedcomment: string;
      user: string;
    }
    export interface LogHistoryEntry extends HistoryEntry {
      type: "log",
      logid: number,
      logtype: string,
      logaction: string,
      logparams: object,
    }
  }

  export namespace meta {
    export namespace SiteInfo {
      /// ???????????????????
      export type namespace = ({ namespaces: Record<string, objs.Namespace> });
    };
  }

  export namespace list {
    export interface AllPages {
      allpages: objs.Page[]
    };
    export interface QueryPage {
      querypage: {
        name: string;
        cached: boolean;
        // presumably nonexistent if cached is false
        cachedtimestamp: string;
        maxresults: number;
        results: {
          value: string;
          ns: number;
          title: string;
        }[];
      }
    };
    export interface LogEvents {
      logevents: objs.LogEvent.Everything[]
    }
    export interface RecentChanges {
      recentchanges: objs.HistoryEntry[];
    }
  }

  export type Query<A extends readonly [...any]> = ({ query: Spread<A> });
}

export namespace Parse {
  export namespace prop {
    export type DisplayTitle = ({ displaytitle: string });
    export type Wikitext = ({ wikitext: string });
    export type IWLinks = ({ iwlinks: {title: string, url: string}[] });
  };
  export interface Obj { title: string; pageid: number }
  export type Parse<A extends readonly [...any]> = ({ parse: Spread<[Obj, ...A]> });
}