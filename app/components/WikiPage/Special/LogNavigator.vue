<template>
  <p>
    (<span>newest</span>
    |
    <span>oldest</span>)
    View
    (<span>
      <span v-if="isBol">newer {{ limit }}</span>
      <a v-else @click.prevent.stop="$emit('view', first, true)" href="#">newer {{ limit }}</a>
      |
      <span v-if="isEol">older {{ limit }}</span>
      <a v-else @click.prevent.stop="$emit('view', last, false)" href="#">older {{ limit }}</a>
    </span>)
    (<span>
      <template v-for="(lim, idx) in [20,50,100,200,500]">
        <a
          v-if="lim !== limit"
          @click.prevent.stop="$emit('setLimit', lim)"
          href="#" 
          :key="idx">{{ lim }}</a>
        <span v-else>{{ lim }}</span>
        <span v-if="idx < 4"> | </span>
      </template>
    </span>)
  </p>
</template>

<script setup lang="ts">
import type { API } from '~~/shared/types/actionapi';

const {limit, type, first, last, reslen} = defineProps<{
  limit: number,
  type: string,
  first: string,
  last: string,
  reslen: number,
}>();

defineEmits<{
  (e: 'view', offset: string, prev: boolean): void;
  (e: 'setLimit', limit: number): void;
}>();
type coke = API.Response<[
  Query.Query<[
    Query.list.LogEvents
  ]>
]>;

const query = {
  "list": "logevents",
  ...(type !== "" && {"letype": type}),
  "lelimit": 2,
  "leprop": "ids"
}

// if reslen < limit or when useWikiFetch(`/query?list=logevents&lecontinue=${last}&lelimit=2&leprop=ids`).data.value.query.logevents only contains 1 element
const isEol = ref(reslen < limit);
if (!isEol.value && last != "") {
  const d = (await useWikiFetch<coke>(`/query`, {
    query: {
      "lecontinue": last,
      "ledir": "older",
      ...query
    }
  })).data;
  isEol.value = d.value.query.logevents.length <= 1;
}
// if and only if useWikiFetch(`/query?list=logevents&lecontinue=${first}&ledir=prev&lelimit=2&leprop=ids`).data.value.query.logevents only contains 1 element
const isBol = ref(false);
if (first != "") {
  const d = (await useWikiFetch<coke>(`/query`, {
    query: {
      "lecontinue": first,
      "ledir": "newer",
      ...query
    }
  })).data;
  isBol.value = d.value.query.logevents.length <= 1;
}
</script>