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
      transformIndexHtml(html: string) {
        return html
          .replace(/<title>.*?<\/title>/, '<title>AgroNex</title>')
          .replace(
            /<link rel="icon"[^>]*>/,
            `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%2316a34a'/><text x='16' y='22' font-family='Arial' font-size='13' font-weight='bold' fill='white' text-anchor='middle'>AN</text></svg>" />`,
          )
          .replace(/content="Vendure Admin Dashboard"/, 'content="AgroNex Admin Dashboard"')
          .replace(/content="Vendure"/, 'content="AgroNex"')
          .replace(
            '</head>',
            `<style>
  /* Hide "Explore Platform & Cloud" promo link in profile dropdown */
  a[href="https://vendure.io/pricing"] { display: none !important; }
</style>
<script>
  // Remove Vendure branding style tag to allow hiding the branding element
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
