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
                  <template v-if="entry.type == 'packed' || entry.type == 'logpack'" v-for="checkboxid in gaming()">
                    <label class="mw-enhancedchanges-arrow mw-enhancedchanges-arrow-space"
                      :for="`mw-checkbox-${checkboxid}`"></label>
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
                  {{ pad + pad }}
                  <span>
                    {{
                      new Date(entry.timestamp).toISOString().slice(11, 16)
                    }}
                    {{ pad }}
                  </span>
                </td>
                <td class="mw-changeslist-line-inner">
                  <template v-if="entry.type != 'logpack'">
                    <span class="mw-changeslist-line-inner-articleLink">
                      <WikiPageLink :title="entry.title" />
                    </span>
                    {{ " " }}
                    <span class="mw-changeslist-line-inner-historyLink holyfuckshutup">
                      <span>
                        <ULink class="mw-changeslist-diff" v-if="entry.type != 'packed'"
                          :to="`./${entry.title.replaceAll(' ', '_')}?curid=${entry.pageid}&diff=${entry.revid}&oldid=${entry.old_revid}`"
                          >diff</ULink>
                        <span v-else-if="entry.type == 'packed'">{{ entry.entries.length }} changes</span>
                      </span>
                      |
                      <span>
                        <ULink class="mw-changeslist-history"
                          :to="`./${entry.title.replaceAll(' ', '_')}?curid=${entry.pageid}&action=history`">hist</ULink>
                      </span>
                    </span>
                    <span class="mw-changeslist-separator"></span>
                    <span class="mw-changeslist-line-inner-characterDiff">
                      <span
                        :class="[`mw-plusminus-${entry.diff > 0 ? 'pos' : entry.diff < 0 ? 'neg' : 'null'}`, 'mw-diff-bytes']"
                        dir="ltr">
                        {{ entry.diff > 0 ? "+" : "" }}{{ entry.diff }}
                      </span>
                    </span>
                  </template>
                  <span v-else class="holyfuckshutup">
                    <WikiPageLink :title="`Special:Log/${entry.logtype}`" :label="logTypeMap[entry.logtype]" />
                  </span>
                  <span class="mw-changeslist-separator"></span>
                  <span v-if="entry.type != 'packed' && entry.type != 'logpack'">
                    <WikiPageLogUserInfo :user="entry.user" />
                    <WikiPageLogDesc v-if="entry.type == 'log'" :log="{type: entry.logtype, action: entry.logaction, title: entry.title, params: entry.logparams}"/>
                    <span class="holyfuckshutup" style="font-style: italic" v-html="fixAnchorUrl(entry.parsedcomment)" v-if="entry.parsedcomment !== ''"></span>
                  </span>
                  <span class="changedby packed" v-else>
                    <template v-for="(c, idx) in entry.contributors">
                      <WikiPageLink :title="`User:${c.user}`" :label="c.user" />
                      <span v-if="c.edits != 1"> ({{ c.edits }}x)</span>
                      <span v-if="idx < entry.contributors.length - 1">; </span>
                    </template>
                  </span>
                </td>
              </tr>
              <tr class="mw-rcfilters-ui-highlights-enhanced-nested"
                v-if="entry.type == 'packed' || entry.type == 'logpack'" v-for="e in entry.entries">
                <td></td>
                <td></td>
                <td></td>
                <td class="mw-enhanced-rc"></td>
                <td></td>
                <td class="mw-enhanced-rc-nested">
                  <template v-if="entry.type == 'packed'">
                    <ULink :to="`./${e.title.replaceAll(' ', '_')}?curid=${e.pageid}&oldid=${e.old_revid}`">{{
                      new Date(e.timestamp).toISOString().slice(11, 16)
                      }}</ULink>
                    <span class="mw-changeslist-separator"></span>
                    <span class="mw-changeslist-line-inner-characterDiff">
                      <span
                        :class="[`mw-plusminus-${e.diff > 0 ? 'pos' : e.diff < 0 ? 'neg' : 'null'}`, 'mw-diff-bytes']"
                        dir="ltr">
                        {{ e.diff > 0 ? "+" : "" }}{{ e.diff }}
                      </span>
                    </span>
                  </template>
                  <span class="mw-enhanced-rc-time" v-else>{{
                      new Date(e.timestamp).toISOString().slice(11, 16)
                      }}</span>
                  <span class="mw-changeslist-separator"></span>
                  <span>
                    <span class="mw-changeslist-line-inner-userLink">
                      <WikiPageLink :title="`User:${e.user}`" :label="e.user" />
                    </span>
                    {{ " " }}
                    <span>
                      (<span>
                        <WikiPageLink :title="`Message_Wall:${e.user}`" label="Message Wall" />
                      </span>
                      |
                      <span>
                        <WikiPageLink :title="`Special:Contributions/${e.user}`" label="contribs" />
                      </span>)
                    </span>
                    <WikiPageLogDesc v-if="e.type == 'log'" :log="{type: e.logtype, action: e.logaction, title: e.title, params: e.logparams}"/>
                    <span class="holyfuckshutup" style="font-style: italic" v-html="fixAnchorUrl(e.parsedcomment)" v-if="e.parsedcomment !== ''"></span>
                  </span>
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
import { logTypeMap } from '~/composables/global_consts';
import type { Query } from '~~/shared/types/actionapi';
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const { entries: data } = defineProps<{
  entries: Query.objs.HistoryEntry[]
}>();

function fixAnchorUrl(html: string) {
  return html.replace(/<a\s+([^>]*?)href="\/wiki\/([^"]+)"([^>]*)>/g, (match, pre, path, post) => {
    // Add class 'miraiwiki-raw-link' to the anchor
    let classAttrMatch = pre.match(/class\s*=\s*["']([^"']*)["']/);
    if (classAttrMatch) {
      // Append to existing class
      const newClass = classAttrMatch[1] + ' miraiwiki-raw-link';
      pre = pre.replace(/class\s*=\s*["'][^"']*["']/, `class="${newClass}"`);
    } else {
      // Add new class attribute
      pre += ` class="miraiwiki-raw-link"`;
    }
    return `<a ${pre}href="./${path}"${post}>`;
  });
}

if (import.meta.client) {
  onMounted(() => {
    document.querySelectorAll('a.miraiwiki-raw-link').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (el as HTMLAnchorElement).getAttribute('href');
        if (href) {
          navigateTo(href);
        }
      });
    });
  });
}

const pad = " "

function gaming() {
  return [crypto.randomUUID().replace(/-/g, '').slice(0, 10)];
}

interface HistoryEntry2 extends Query.objs.HistoryEntry {
  diff: number;
}
interface LogHistoryEntry2 extends Query.objs.LogHistoryEntry {
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
  new: boolean,
  minor: false,
  bot: false,
  /// the timestamp of the latest change
  timestamp: string,
  /// the total size of the changes
  diff: number
  entries: HistoryEntry2[]
}
interface LogsPack {
  type: "logpack",
  logtype: string,
  /// The display name of the log type
  title: string,
  /// the timestamp of the latest change
  timestamp: string,
  contributors: {
    user: string,
    edits: number
  }[],
  new: false,
  minor: false,
  bot: false,
  entries: LogHistoryEntry2[]
}
type FourHorsemensOfLogs = HistoryEntry2 | LogHistoryEntry2 | PackedChanges | LogsPack;
const groupedEntries = computed(() => {
  const groups: Record<string, (FourHorsemensOfLogs)[]> = {};
  // first pass: group by date
  for (const entry of data) {
    const date = entry.timestamp.split('T')[0]!;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({ ...entry, diff: entry.newlen - entry.oldlen });
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
  for (const [date, entries] of Object.entries(groups as Record<string, (HistoryEntry2 | LogHistoryEntry2)[]>)) {
    const packed: (FourHorsemensOfLogs)[] = [];
    const used = new Array(entries.length).fill(false);

    // Helper to find next unused index
    function nextUnused(start: number) {
      for (let i = start; i < entries.length; i++) {
        if (!used[i]) return i;
      }
      return entries.length;
    }

    let i = 0;
    while (i < entries.length) {
      i = nextUnused(i);
      if (i >= entries.length) break;
      const start = i;
      const cur = entries[i]!;

      // Handle log grouping first
      if (cur.type === 'log') {
        const logtype = cur.logtype;
        const logEntries: LogHistoryEntry2[] = [];
        for (let j = 0; j < entries.length; j++) {
          if (
            !used[j] &&
            entries[j]!.type === 'log' &&
            (entries[j]! as LogHistoryEntry2).logtype === logtype
          ) {
            logEntries.push(entries[j] as LogHistoryEntry2);
            used[j] = true;
          }
        }
        if (logEntries.length) {
          packed.push({
            type: "logpack",
            logtype,
            title: (cur as any).title || logtype,
            timestamp: logEntries[0]!.timestamp,
            contributors: (() => {
              const map: Record<string, number> = {};
              for (const e of logEntries) {
                map[(e as any).user] = (map[(e as any).user] || 0) + 1;
              }
              return Object.entries(map).map(([user, edits]) => ({
                user,
                edits,
              }));
            })(),
            entries: logEntries,
            new: false,
            minor: false,
            bot: false
          });
        }
        continue;
      }

      // Pack all unused entries with same title and pageid
      const packedEntries: HistoryEntry2[] = [];
      for (let j = 0; j < entries.length; j++) {
        if (
          !used[j] &&
          entries[j]!.type !== 'log' &&
          entries[j]!.title === cur.title &&
          entries[j]!.pageid === cur.pageid
        ) {
          packedEntries.push(entries[j] as HistoryEntry2);
          used[j] = true;
        }
      }
      if (packedEntries.length > 1) {
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
          bot: false,
          timestamp: packedEntries[0]!.timestamp,
          diff: packedEntries.reduce((sum, e) => sum + e.diff, 0),
          entries: packedEntries,
        });
      } else if (packedEntries.length === 1) {
        packed.push(packedEntries[0]!);
      }
      // i will be incremented by nextUnused
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

.holyfuckshutup::before {
  content: "("
}

.holyfuckshutup::after {
  content: ")"
}

.mw-enhancedchanges-arrow {
  mask-image: url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"%23000000\"><path d=\"M10 15 2 5h16z\"/></svg>");
  mask-size: calc(max(0.75em, 12px));
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: #72777d;
  width: 15px;
  height: 15px;
}

.mw-enhancedchanges-arrow:has(+ .mw-enhancedchanges-checkbox:not(:checked)) {
  transform: rotate(-90deg);
}

/*this rule doesnt work anyway*/
.mw-enhancedchanges-checkbox:not(:checked)+* .mw-rcfilters-ui-highlights-enhanced-nested {
  display: unset !important;
}

.mw-changeslist-line>tbody:has(tr:first-child > td:nth-child(2) > .mw-enhancedchanges-checkbox:not(:checked))>tr.mw-rcfilters-ui-highlights-enhanced-nested {
  display: none;
}
</style>