<template>
  <div id="userProfileApp"> <!--User page-->
    <template v-if="meta">
      <div class="user-identity-box__wrapper">
        <section class="user-identity-box" itemtype="http://schema.org/Person">
          <div class="user-identity-avatar">
            <img :src="meta.userData.avatar" alt="" class="user-identity-avatar__image">
          </div>
          <div class="user-identity-box__info">
            <div class="user-identity-header">
              <div class="user-identity-header__attributes">
                <h1 itemprop="name">{{ meta.userData.username }}</h1>
                <h2 v-if="meta.userData.name.length != 0">
                  <span>aka</span>
                  {{ meta.userData.name }}
                </h2>
                <span v-for="tag in meta.userData.tags" class="user-identity-header__tag">
                  {{ tag }}
                </span>
              </div>
              <div class="user-identity-header__actions"></div>
            </div>
            <ul class="user-identity-stats">
              <li><a :href="`/${site}/wiki/Special:Contributions/${meta.userData.username}`">
                  <strong>{{ meta.userData.edits }}</strong> edits</a>
              </li>
              <li><a
                  :href="`/${site}/wiki/Special:UserProfileActivity/${meta.userData.username}?tab=posts`">
                  <strong>{{ meta.userData.posts }}</strong> posts</a>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <ul class="user-profile-navigation">
        <li class="user-profile-navigation__link is-active"><a
            :href="`/${site}/wiki/User:${meta.userData.username}`">About</a></li>
        <li class="user-profile-navigation__link "><a :href="`/${site}${meta.userData.messageWallUrl}`">Message Wall</a></li>
        <li class="user-profile-navigation__link "><a :href="`/${site}${meta.userData.userBlogUrl}`">Blog</a></li>
        <li class="user-profile-navigation__link "><a :href="`/${site}${meta.userData.contributionsUrl}`">Contributions</a></li>
        <li class="user-profile-navigation__link "><a :href="`/${site}${meta.userData.userProfileActivityUrl}`">Activity</a>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { API, Query } from '~~/shared/types/actionapi';
///{"userData":{"id":4403388,"username":"Fandom","avatar":"https:\/\/static.wikia.nocookie.net\/84586f7d-1103-4bbe-b69a-08de7e6ccb4c\/thumbnail\/width\/400\/height\/400","name":"","bio":"","website":"","twitter":"","fbPage":"","discordHandle":"","hideEditsWikis":0,"edits":"20","registration":"9 August 2017","userPage":"https:\/\/love-live.fandom.com\/wiki\/User:Fandom","contributionsUrl":"\/wiki\/Special:Contributions\/Fandom","userProfileActivityUrl":"\/wiki\/Special:UserProfileActivity\/Fandom","messageWallUrl":"\/wiki\/Message_Wall:Fandom","messageWallNewMessageUrl":"\/wiki\/Message_Wall:Fandom?wall-editor=new","userBlogUrl":"\/wiki\/User_blog:Fandom","showZeroStates":true,"tags":["Staff"],"posts":2,"discussionUserUrl":"\/f\/u\/4403388","isUserPageOwner":false,"canEditProfile":false,"canRemoveAvatar":false,"isBlocked":false,"isMessageWallBlocked":false,"localEdits":20},"isReadOnly":false}
const currentTheme = useCookie("theme", { "default": () => "Dark", watch: "shallow" });
const {user, site} = defineProps<{
  site: string,
  user: string
}>();
///https://love-live.fandom.com/wikia.php?controller=UserProfile&method=getUserData&format=json&userId=25708385
const userid = await useFetch<API.Response<[Query.Query<[Query.AllUsers]>]>>(`/api/${site}/query`, {
  query: {
    "list": "allusers",
    "aufrom": user,
    "aulimit": "1"
  }
}).then(data => data.data.value!.query.allusers[0]!.userid);

useSheets().addSheet("modules=ext.fandom.UserProfile.css");

interface UserData {
  id: number;
  username: string;
  avatar: string;
  name: string;
  bio: string;
  website: string;
  twitter: string;
  fbPage: string;
  discordHandle: string;
  hideEditsWikis: number;
  edits: string;
  registration: string;
  userPage: string;
  contributionsUrl: string;
  userProfileActivityUrl: string;
  messageWallUrl: string;
  messageWallNewMessageUrl: string;
  userBlogUrl: string;
  showZeroStates: boolean;
  tags: string[];
  posts: number;
  discussionUserUrl: string;
  isUserPageOwner: boolean;
  canEditProfile: boolean;
  canRemoveAvatar: boolean;
  isBlocked: boolean;
  isMessageWallBlocked: boolean;
  localEdits: number;
}

interface UserProfileResponse {
  userData: UserData;
  isReadOnly: boolean;
}

const { data: meta } = await useFetch<UserProfileResponse>(`/api/${site}/UserProfile/getUserData`, {
  query: {
    format: "json",
    userId: userid
  }
});


</script>