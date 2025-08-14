<script setup lang="ts">
import { defineProps, h } from 'vue';
import { z } from 'zod';
import Link from './Link.vue';

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

const props = defineProps<{
  log: {
    title: string;
    params: any;
    type: string;
  }
}>();

function renderLog() {
  const { log } = props;
  const params = log.params;
  switch (log.type) {
    case 'block':
    case 'reblock': {
      const parsed = BlockParams.safeParse(params);
      if (!parsed.success) return h('span', 'blocked (invalid params)');
      return [
        'blocked ',
        h(Link, { title: log.title }),
        ' with an expiration time of ',
        parsed.data.duration
      ];
    }
    case 'unblock':
      return [
        'unblocked ',
        h(Link, { title: log.title })
      ];
    case 'move': {
      const parsed = MoveParams.safeParse(params);
      if (!parsed.success) return h('span', 'moved (invalid params)');
      return [
        'moved ',
        h(Link, { title: log.title }),
        ' to ',
        h(Link, { title: parsed.data.target_title })
      ];
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
      const parsed = ProtectParams.safeParse(params);
      if (!parsed.success) return h('span', 'protected (invalid params)');
      return [
        'protected ',
        h(Link, { title: log.title }),
        parsed.data.cascade ? ' (cascading) ' : ' ',
        parsed.data.description,
        parsed.data.details?.length ? ` (${parsed.data.details.map(d => d.level).join(', ')})` : ''
      ];
    }
    case 'upload': {
      const parsed = UploadParams.safeParse(params);
      if (!parsed.success) return h('span', 'uploaded (invalid params)');
      return [
        'uploaded ',
        h(Link, { title: log.title })
      ];
    }
    case 'thanks':
      return [
        'thanked ',
        h(Link, { title: log.title })
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
    default:
      return [log.type, ' log on ', h(Link, { title: log.title })];
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
