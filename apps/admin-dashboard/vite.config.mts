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
        // Patch the hardcoded DEFAULT_TITLE = 'Vendure' in the dashboard source
        if (id.includes('use-page-title') && code.includes("'Vendure'")) {
          return { code: code.replace("'Vendure'", "'AgroNex'"), map: null };
        }
      },
      transformIndexHtml(html: string) {
        const favicon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PHJlY3Qgd2lkdGg9JzMyJyBoZWlnaHQ9JzMyJyByeD0nNycgZmlsbD0nIzBlYTVlOScvPjx0ZXh0IHg9JzE2JyB5PScyMicgZm9udC1mYW1pbHk9J0FyaWFsJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nd2hpdGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkFOPC90ZXh0Pjwvc3ZnPg==`;
        return html
          .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" type="image/svg+xml" href="${favicon}" />`)
          .replace(/content="Vendure Admin Dashboard"/, 'content="AgroNex Admin Dashboard"')
          .replace(/content="Vendure"/, 'content="AgroNex"')
          .replace(
            '<head>',
            `<head><base href="/">`,
          )
          .replace(
            '</head>',
            `<title>AgroNex</title>
<style>
  a[href="https://vendure.io/pricing"] { display: none !important; }
</style>
<script>
  new MutationObserver(function() {
    var s = document.getElementById('vendure-branding-style');
    if (s) {
      s.remove();
      document.querySelectorAll('[data-vendure-branding]').forEach(function(el) {
        el.style.setProperty('display', 'none', 'important');
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
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
