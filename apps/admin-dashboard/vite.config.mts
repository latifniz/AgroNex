import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    outDir: join(__dirname, '../../dist/apps/dashboard'),
  },
  plugins: [
    {
      name: 'agronex-branding',
      transform(code: string, id: string) {
        // Title: match by content so it works regardless of filename (changed in 3.7)
        if (code.includes('DEFAULT_TITLE') && (code.includes('"Vendure"') || code.includes("'Vendure'"))) {
          return {
            code: code.replace(/DEFAULT_TITLE\s*=\s*["']Vendure["']/, 'DEFAULT_TITLE = "AgroNex"'),
            map: null,
          };
        }

        // Platform & Cloud: match by content so file renames don't matter
        if (code.includes('"Explore Platform & Cloud"')) {
          const groupMarker = 'jsx(DropdownMenuGroup,';
          const targetIdx = code.indexOf('"Explore Platform & Cloud"');
          const groupStart = code.lastIndexOf(groupMarker, targetIdx);
          if (groupStart === -1) return;

          let depth = 0;
          let closeIdx = -1;
          for (let i = groupStart; i < code.length; i++) {
            if (code[i] === '(') depth++;
            else if (code[i] === ')') {
              if (--depth === 0) { closeIdx = i; break; }
            }
          }
          if (closeIdx === -1) return;

          const after = code.slice(closeIdx + 1);
          const sepMatch = after.match(/^,?\s*\/\*\s*@__PURE__\s*\*\/\s*jsx\(DropdownMenuSeparator,\s*\{\}\)/);
          const removeUntil = closeIdx + 1 + (sepMatch ? sepMatch[0].length : 0);

          return {
            code: code.slice(0, groupStart) + 'null' + code.slice(removeUntil),
            map: null,
          };
        }
      },
      transformIndexHtml(html: string) {
        const favicon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PHJlY3Qgd2lkdGg9JzMyJyBoZWlnaHQ9JzMyJyByeD0nNycgZmlsbD0nIzBlYTVlOScvPjx0ZXh0IHg9JzE2JyB5PScyMicgZm9udC1mYW1pbHk9J0FyaWFsJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nd2hpdGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkFOPC90ZXh0Pjwvc3ZnPg==`;
        return html
          .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" type="image/svg+xml" href="${favicon}" />`)
          .replace(/content="Vendure Admin Dashboard"/, 'content="AgroNex Admin Dashboard"')
          .replace(/content="Vendure"/, 'content="AgroNex"')
          .replace('<head>', `<head><base href="/">`)
          .replace(
            '</head>',
            `<title>AgroNex</title>
<style>
  a[href="https://vendure.io/pricing"] { display: none !important; }
  *:has(> a[href="https://vendure.io/pricing"]) { display: none !important; }
</style>
<script>
(function() {
  // Intercept document.title so any JS setting it to "Vendure" gets overridden
  var _title = 'AgroNex';
  Object.defineProperty(document, 'title', {
    get: function() { return _title; },
    set: function(v) {
      _title = typeof v === 'string' ? v.replace(/\\bVendure\\b/g, 'AgroNex') : v;
      var t = document.querySelector('title');
      if (t) t.textContent = _title;
    },
    configurable: true,
  });

  function cleanup() {
    // Remove Vendure branding injected styles
    var s = document.getElementById('vendure-branding-style');
    if (s) s.remove();
    document.querySelectorAll('[data-vendure-branding]').forEach(function(el) {
      el.style.setProperty('display', 'none', 'important');
    });

    // Hide Platform & Cloud link and its container
    document.querySelectorAll('a[href="https://vendure.io/pricing"]').forEach(function(a) {
      var node = a;
      // Walk up until we find a node whose only meaningful child is this link
      while (node.parentElement) {
        var p = node.parentElement;
        if (p.children.length === 1) { node = p; } else { break; }
      }
      node.style.setProperty('display', 'none', 'important');
      // Hide adjacent separators to avoid visual gaps
      [node.previousElementSibling, node.nextElementSibling].forEach(function(sib) {
        if (sib && (sib.getAttribute('role') === 'separator' || sib.tagName === 'HR')) {
          sib.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }

  new MutationObserver(cleanup).observe(document.documentElement, { childList: true, subtree: true });
})();
</script></head>`,
          );
      },
    },
    vendureDashboardPlugin({
      tempCompilationDir: join(__dirname, './__vendure-dashboard-temp'),
      vendureConfigPath: pathToFileURL(
        join(__dirname, '../../libs/util-config/src/lib/vendure-config.ts'),
      ),
      // Points to the location of your Vendure server.
      api: {
        host: process.env.API_PUBLIC_URL ?? 'http://localhost',
        port: +((process.env.API_PUBLIC_PORT as string) ?? 3000),
      },
      gqlOutputPath: join(__dirname,'./src/gql'),
      pathAdapter: {
        sourceRoot: join(__dirname, '../../libs'),
        getCompiledConfigPath: ({
          inputRootDir,
          outputPath,
          configFileName,
        }) => {
          const projectName = inputRootDir.split('/libs/')[1].split('/')[0];
          const pathAfterProject = inputRootDir.split(
            `/libs/${projectName}`,
          )[1];
          const compiledConfigFilePath = `${outputPath}/${projectName}${pathAfterProject}`;
          return join(compiledConfigFilePath, configFileName);
        },
        transformTsConfigPathMappings: ({ phase, patterns }) => {
          if (phase === 'loading') {
            return patterns.map(p =>
              p.replace('libs/', '').replace(/.ts$/, '.js'),
            );
          }
          return patterns;
        },
      },
    }),
  ],
  resolve: {
    alias: {
      // This allows all plugins to reference a shared set of
      // GraphQL types.
      '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
    },
  },
});
