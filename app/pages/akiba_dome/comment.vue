<template>
  <Comment :data="data"></Comment>
</template>

<script setup lang="ts">
import type { Comment as WikiaComment } from '~~/shared/types/comment';

const data: WikiaComment = {
  "id": "4400000000000094477",
  "creationDate": {
    "nano": 0,
    "epochSecond": 1615317910
  },
  "postId": "4400000000000280032",
  "followed": false,
  "containerId": "15454",
  "firstPost": {
    "id": "4400000000000280032",
    "creationDate": {
      "nano": 0,
      "epochSecond": 1615317909
    },
    "upvoteCount": 0,
    "userData": {
      "postId": 4400000000000280032,
      "hasUpvoted": false,
      "permissions": {
        "canEdit": false,
        "canDelete": false
      },
      "isReported": false
    },
    "jsonModel": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"I can relate to Hanamaru.\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"We both like to read...\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"And we lacked tech stuff for years.\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"(I'm almost 16, and I didn't use tech until last year)\"}]}]}",
    "attachments": {
      "openGraphs": [],
      "contentImages": [],
      "polls": [],
      "quizzes": [],
      "atMentions": []
    },
    "createdBy": {
      "id": "47109046",
      "avatarUrl": "https:\/\/static.wikia.nocookie.net\/64237d96-4eee-4164-bd4a-f0ef5f6c0e04",
      "name": "MoonlarkSpirits",
      "badgePermission": ""
    }
  },
  "posts": [
    {
      "id": "4400000000000510362",
      "creationDate": {
        "nano": 0,
        "epochSecond": 1652208700
      },
      "upvoteCount": 0,
      "userData": {
        "postId": 4400000000000510362,
        "hasUpvoted": false,
        "permissions": {
          "canEdit": false,
          "canDelete": false
        },
        "isReported": false
      },
      "jsonModel": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"But are you able to eat 3 wheelbarrows of food every day like her?\"}]}]}",
      "attachments": {
        "openGraphs": [],
        "contentImages": [],
        "polls": [],
        "quizzes": [],
        "atMentions": []
      },
      "createdBy": {
        "id": "45216396",
        "avatarUrl": "https:\/\/static.wikia.nocookie.net\/7d7149ae-f5aa-4af0-b205-a29faee90a24",
        "name": "CavCave",
        "badgePermission": ""
      }
    },
    {
      "id": "4400000000000510548",
      "creationDate": {
        "nano": 0,
        "epochSecond": 1652220428
      },
      "upvoteCount": 0,
      "userData": {
        "postId": 4400000000000510548,
        "hasUpvoted": false,
        "permissions": {
          "canEdit": false,
          "canDelete": false
        },
        "isReported": false
      },
      "jsonModel": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Nope! That's my biggest difference! I can barely eat at all without getting sick.\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"(Man, to think that I'm now 17, I forgot I commented on this)\"}]}]}",
      "attachments": {
        "openGraphs": [],
        "contentImages": [],
        "polls": [],
        "quizzes": [],
        "atMentions": []
      },
      "createdBy": {
        "id": "47109046",
        "avatarUrl": "https:\/\/static.wikia.nocookie.net\/64237d96-4eee-4164-bd4a-f0ef5f6c0e04",
        "name": "MoonlarkSpirits",
        "badgePermission": ""
      }
    },
    {
      "id": "4400000000000510957",
      "creationDate": {
        "nano": 0,
        "epochSecond": 1652288409
      },
      "upvoteCount": 0,
      "userData": {
        "postId": 4400000000000510957,
        "hasUpvoted": false,
        "permissions": {
          "canEdit": false,
          "canDelete": false
        },
        "isReported": false
      },
      "jsonModel": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Wait, if you were 15 on October 2021, how can you be 17 on May 2022? It's not even been a year yet.\"}]}]}",
      "attachments": {
        "openGraphs": [],
        "contentImages": [],
        "polls": [],
        "quizzes": [],
        "atMentions": []
      },
      "createdBy": {
        "id": "45216396",
        "avatarUrl": "https:\/\/static.wikia.nocookie.net\/7d7149ae-f5aa-4af0-b205-a29faee90a24",
        "name": "CavCave",
        "badgePermission": ""
      }
    },
    {
      "id": "4400000000000511367",
      "creationDate": {
        "nano": 0,
        "epochSecond": 1652320515
      },
      "upvoteCount": 0,
      "userData": {
        "postId": 4400000000000511367,
        "hasUpvoted": false,
        "permissions": {
          "canEdit": false,
          "canDelete": false
        },
        "isReported": false
      },
      "jsonModel": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Damn, mistyped that. I am 17, it was supposed to say almost 17\"}]}]}",
      "attachments": {
        "openGraphs": [],
        "contentImages": [],
        "polls": [],
        "quizzes": [],
        "atMentions": []
      },
      "createdBy": {
        "id": "47109046",
        "avatarUrl": "https:\/\/static.wikia.nocookie.net\/64237d96-4eee-4164-bd4a-f0ef5f6c0e04",
        "name": "MoonlarkSpirits",
        "badgePermission": ""
      }
    }
  ]
}
</script>