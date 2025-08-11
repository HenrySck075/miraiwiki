<template>
  <div>
    <link rel="stylesheet" href="/rcinline.css">
    <div class="mw-changeslist oo-ui-widget oo-ui-widget-enabled mw-rcfilters-ui-changesListWrapperWidget">
      <template v-for="(entries, day) in groupedEntries">
        <h4>
          {{
            (() => {
              const [year, month, dayNum] = day.split('-');
              return `${dayNum} ${monthNames[parseInt(month!, 10) - 1]} ${year}`;
            })()
          }}
        </h4>
        <div>
          <table v-for="entry in entries"
            class="mw-changeslist-line mw-changeslist-edit mw-changeslist-line-not-watched mw-changeslist-ns-subject mw-changeslist-user-registered mw-changeslist-user-learner mw-changeslist-others mw-changeslist-human mw-changeslist-major mw-changeslist-last mw-changeslist-src-mw-edit mw-changeslist-notwatched mw-enhanced-rc mw-tag-visualeditor">
            <tbody>
              <tr>
                <td>
                  <div class="mw-rcfilters-ui-highlights">
                    <div class="mw-rcfilters-ui-highlights-color-none" data-color="none"></div>
                    <div class="mw-rcfilters-ui-highlights-color-c1" data-color="c1"></div>
                    <div class="mw-rcfilters-ui-highlights-color-c2" data-color="c2"></div>
                    <div class="mw-rcfilters-ui-highlights-color-c3" data-color="c3"></div>
                    <div class="mw-rcfilters-ui-highlights-color-c4" data-color="c4"></div>
                    <div class="mw-rcfilters-ui-highlights-color-c5" data-color="c5"></div>
                  </div>
                </td>
                <td>
                  <template v-if="entry.type=='packed'" v-for="checkboxid in gaming()">
                    <!---
                    <label class="mw-enhancedchanges-arrow-space-2 mw-enhancedchanges-arrow-space" :for="`mw-checkbox-${checkboxid}`"></label>
                    -->
                    <input type="checkbox" :id="`mw-checkbox-${checkboxid}`" class="mw-enhancedchanges-checkbox">
                  </template>
                  <span class="mw-enhancedchanges-arrow-space" v-else></span>
                </td>
                <td class="mw-changeslist-line-prefix"></td>
                <td class="mw-enhanced-rc" colspan="2">
                  <!--TODO: dont do this horrific shit-->
                  <template v-if="entry.new">
                    <abbr class="newpage">N</abbr>
                  </template>
                  <template v-else>{{ pad }}</template>
                  <template v-if="entry.minor">
                    <abbr class="minoredit">m</abbr>
                  </template>
                  <template v-else>{{ pad }}</template>
                  {{ pad+pad }}
                  <span>
                    {{
                      new Date(entry.timestamp).toISOString().slice(11, 16)
                    }}
                    {{ pad }}
                  </span>
                </td>
                <td class="mw-changeslist-line-inner">
                  <span class="mw-changeslist-line-inner-articleLink">
                    <WikiPageLink :title="entry.title" />
                  </span>
                  {{ " " }}
                  <span class="mw-changeslist-line-inner-historyLink">
                    (<span>
                      <ULink class="mw-changeslist-diff" v-if="entry.type != 'packed'"
                        :to="`./${entry.title.replaceAll(' ', '_')}?curid=${entry.pageid}&diff=${entry.revid}&oldid=${entry.old_revid}`">diff</ULink>
                      <span v-else-if="entry.type == 'packed'">{{ entry.entries.length }} changes</span>
                    </span>
                    |
                    <span>
                      <ULink class="mw-changeslist-history"
                        :to="`./${entry.title.replaceAll(' ', '_')}?curid=${entry.pageid}&action=history`">hist</ULink>
                    </span>)
                  </span>
                  <span class="mw-changeslist-separator"></span>
                  <span class="mw-changeslist-line-inner-characterDiff"><span
                      :class="[`mw-plusminus-${entry.diff > 0 ? 'pos' : entry.diff < 0 ? 'neg' : 'null'}`, 'mw-diff-bytes']"
                      dir="ltr">
                      {{ entry.diff > 0 ? "+" : "" }}{{ entry.diff }}
                    </span></span>
                  <span class="mw-changeslist-separator"></span>
                  <span v-if="entry.type != 'packed'">
                    <span class="mw-changeslist-line-inner-userLink">
                      <WikiPageLink :title="`User:${entry.user}`" :label="entry.user" />
                    </span>
                    {{ " " }}
                    <span>
                      (<span>
                      <WikiPageLink :title="`Message_Wall:${entry.user}`" label="Message Wall" />
                      </span>
                      |
                      <span>
                      <WikiPageLink :title="`Special:Contributions/${entry.user}`" label="contribs" />
                      </span>)
                    </span>
                  </span>
                  <span class="changedby packed" v-else>
                    <template v-for="(c, idx) in entry.contributors">
                      <WikiPageLink :title="`User:${c.user}`" :label="c.user" />
                      <span> ({{ c.edits }}x)</span>
                      <span v-if="idx < entry.contributors.length-1">, </span>
                    </template>
                  </span>
                </td>
              </tr>
              <tr class="mw-rcfilters-ui-highlights-enhanced-nested" v-if="entry.type == 'packed'" v-for="e in entry.entries">
                <td></td>
                <td></td>
                <td></td>
                <td class="mw-enhanced-rc"></td>
                <td></td>
                <td class="mw-enhanced-rc-nested">
                  <ULink>{{
                    new Date(e.timestamp).toISOString().slice(11, 16)
                  }}</ULink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { Query } from '~~/shared/types/actionapi';
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const { entries: data } = defineProps<{
  entries: Query.objs.HistoryEntry[]
}>();

const pad = " "

function gaming() {
  return [crypto.randomUUID().replace(/-/g, '').slice(0, 10)];
}

interface HistoryEntry2 extends Query.objs.HistoryEntry {
  diff: number;
}

type PackedChanges = {
  type: "packed",
  title: string,
  pageid: number,
  contributors: {
    user: string,
    edits: number
  }[],
  new:boolean,
  minor: false,
  /// the timestamp of the latest change
  timestamp: string,
  /// the total size of the changes
  diff: number
  entries: HistoryEntry2[]
}
const groupedEntries = computed(() => {
  const groups: Record<string, (HistoryEntry2 | PackedChanges)[]> = {};
  // first pass: group by date
  for (const entry of data) {
    const date = entry.timestamp.split('T')[0]!;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({...entry, diff: entry.newlen-entry.oldlen});
  }
  /** second pass: pack entries by the consecutive edits of a page
  e.g: 
  [
    HistoryEntry2 (title: "Komodo Dragon - Block Tales", pageid: 123456) ---
    HistoryEntry2 (title: "Komodo Dragon - Block Tales", pageid: 123456)   |
    HistoryEntry2 (title: "Komodo Dragon - Block Tales", pageid: 123456)   | - Packed into 1 PackedChanges object (preferably using id)
    HistoryEntry2 (title: "Komodo Dragon - Block Tales", pageid: 123456)   |
    HistoryEntry2 (title: "Komodo Dragon - Block Tales", pageid: 123456) ---
    HistoryEntry2 (title: "impostor - amogus", pageid: 123426) - standalone
  ]
  */
  for (const [date, entries] of Object.entries(groups)) {
    const packed: (HistoryEntry2 | PackedChanges)[] = [];
    let i = 0;
    while (i < entries.length) {
      const start = i;
      const cur = entries[i]!;
      // Find consecutive entries with same title and pageid
      let j = i + 1;
      while (
        j < entries.length &&
        entries[j]!.title === cur.title &&
        entries[j]!.pageid === cur.pageid
      ) {
        j++;
      }
      if (j - start > 1) {
        // Pack them
        const packedEntries = entries.slice(start, j) as HistoryEntry2[];
        packed.push({
          type: "packed",
          title: cur.title,
          pageid: cur.pageid,
          contributors: (() => {
            const map: Record<string, number> = {};
            for (const e of packedEntries) {
              map[e.user] = (map[e.user] || 0) + 1;
            }
            return Object.entries(map).map(([user, edits]) => ({
              user,
              edits,
            }));
          })(),
          new: packedEntries.some(e => e.new),
          minor: false,
          timestamp: packedEntries[0]!.timestamp,
          diff: packedEntries.reduce((sum, e) => sum + e.diff, 0),
          entries: packedEntries,
        });
        i = j;
      } else {
        packed.push(cur);
        i++;
      }
    }
    groups[date] = packed;
  }
  return groups;
});
</script>

<style>
.changedby.packed::before {
  content: "["
}
.changedby.packed::after {
  content: "]"
}
.mw-enhancedchanges-checkbox {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"%23000000\"><path d=\"M10 15 2 5h16z\"/></svg>");
  background-color: white;
  width: 15px;
  height: 15px;
}

[dir="ltr"] .mw-enhancedchanges-checkbox:not(:checked) + .mw-enhancedchanges-arrow {
	transform: rotate(-90deg);
}

/*this rule doesnt work anyway*/
.mw-enhancedchanges-checkbox:not(:checked) + * .mw-rcfilters-ui-highlights-enhanced-nested {
	display: unset !important;
}
.mw-changeslist-line > tbody:has(tr:first-child > td:nth-child(2) > .mw-enhancedchanges-checkbox:not(:checked)) > tr.mw-rcfilters-ui-highlights-enhanced-nested  {
  display: none;
}
</style>