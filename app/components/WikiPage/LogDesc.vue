<script setup lang="ts">
import { h } from 'vue';
import Link from './Link.vue';
import type { Query } from '~~/shared/types/actionapi';
import LogUserInfo from './LogUserInfo.vue';
/*
import { z } from 'zod';
// Zod schemas for log event params
const BlockParams = z.object({
  duration: z.string(),
  flags: z.array(z.string()),
  restrictions: z.object({
    namespaces: z.array(z.number()).optional(),
    pages: z.array(z.object({
      page_ns: z.number(),
      page_title: z.string()
    })).optional()
  }).optional(),
  sitewide: z.boolean(),
  expiry: z.string().optional()
});

const MoveParams = z.object({
  target_ns: z.number(),
  target_title: z.string(),
  suppressredirect: z.boolean()
});

const ProtectParams = z.object({
  description: z.string(),
  cascade: z.boolean(),
  details: z.array(z.object({
    type: z.string(),
    level: z.string(),
    expiry: z.string(),
    cascade: z.boolean()
  }))
});

const UploadParams = z.object({
  img_sha1: z.string(),
  img_timestamp: z.string()
});
*/

const props = defineProps<{
  log: {
    title: string;
    params: any;
    type: string;
    action: string;
  }
}>();
function renderLog() {
  const { log } = props as ({log: Query.objs.LogEvent.Everything});
  switch (log.type) {
    case 'block': {
      switch (log.action) {
        case 'block':
        case 'reblock': {
          //if (!parsed.success) return h('span', 'blocked (invalid params)');
          return [
            'blocked ',
            h(LogUserInfo, { user: log.title.replace("User:", "") }),
            ' with an expiration time of ',
            log.params.duration
          ];
        }
        case 'unblock':
          return [
            'unblocked ',
            h(LogUserInfo, { user: log.title.replace("User:", "") })
          ];
      }
    }
    case 'move': {
      // ok?????
      try {
        return [
          'moved ',
          h(Link, { title: log.title }),
          ' to ',
          h(Link, { title: log.params.target_title })
        ];
      } catch (e) {
        return h('span', 'moved (invalid params)');
      }
    }
    case 'delete':
      return [
        'deleted ',
        h(Link, { title: log.title })
      ];
    case 'create':
      return [
        'created ',
        h(Link, { title: log.title })
      ];
    case 'protect': {
      //const parsed = ProtectParams.safeParse(params);
      //if (!parsed.success) return h('span', 'protected (invalid params)');
      const params = log.params;
      return [
        'protected ',
        h(Link, { title: log.title }),
        params.cascade ? ' (cascading) ' : ' ',
        params.description,
        params.details?.length ? ` (${params.details.map(d => d.level).join(', ')})` : ''
      ];
    }
    case 'patrol': {
      //const parsed = PatrolParams.safeParse(params);
      //if (!parsed.success) return h('span', 'patrolled (invalid params)');
      return [
        log.params.auto ? 'automatically ' : '',
        'marked revision ',
        log.params.curid,
        ' of page ',
        h(Link, { title: log.title }),
        ' patrolled'
      ];
    }
    case 'upload': {
      //const parsed = UploadParams.safeParse(params);
      //if (!parsed.success) return h('span', 'uploaded (invalid params)');
      return [
        'uploaded ',
        h(Link, { title: log.title })
      ];
    }
    case 'thanks':
      return [
        'thanked ',
        h(LogUserInfo, { user: log.title.replace("User:", "") })
      ];
    case 'abusefilter':
      return [
        'abusefilter event on ',
        h(Link, { title: log.title })
      ];
    case 'abusefilter-protected-vars':
      return [
        'abusefilter protected vars event on ',
        h(Link, { title: log.title })
      ];
    case 'newusers':
      return ["was created"];
    default:
      return [log.type, '/', log.action, ' log on ', h(Link, { title: log.title })];
  }
}
</script>

<template>
  <span v-once>
    <template v-for="(part, i) in renderLog()" :key="i">
      <component v-if="typeof part === 'object' && part !== null" :is="part" />
      <template v-else>{{ part }}</template>
    </template>
  </span>
</template>
