<script setup lang="ts">
const r = useRoute().params;
await navigateTo(`${r['site']}/${(r['p'] as string[]).join('/')}`)
</script>