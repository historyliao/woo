import { build } from 'esbuild'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const buildSupportDir = path.join(rootDir, 'scripts', 'build-support')
const emptyModulePath = path.join(buildSupportDir, 'empty-module.ts')
const emptyTextModulePath = path.join(buildSupportDir, 'empty-text-module.ts')

const privateModuleStubs = new Map([
  ['bun:bundle', path.join(buildSupportDir, 'bun-bundle-shim.ts')],
  ['bun:ffi', path.join(buildSupportDir, 'bun-ffi-shim.ts')],
  [
    '@ant/claude-for-chrome-mcp',
    path.join(buildSupportDir, 'stubs', 'claude-for-chrome-mcp.ts'),
  ],
  [
    '@ant/computer-use-mcp',
    path.join(buildSupportDir, 'stubs', 'computer-use-mcp.ts'),
  ],
  [
    '@ant/computer-use-mcp/types',
    path.join(buildSupportDir, 'stubs', 'computer-use-mcp-types.ts'),
  ],
  [
    '@ant/computer-use-mcp/sentinelApps',
    path.join(buildSupportDir, 'stubs', 'computer-use-mcp-sentinel-apps.ts'),
  ],
  [
    '@ant/computer-use-input',
    path.join(buildSupportDir, 'stubs', 'computer-use-input.ts'),
  ],
  [
    '@ant/computer-use-swift',
    path.join(buildSupportDir, 'stubs', 'computer-use-swift.ts'),
  ],
])

const packageAliases = new Map([
  [
    'color-diff-napi',
    path.join(rootDir, 'src', 'native-ts', 'color-diff', 'index.ts'),
  ],
  [
    'jsonc-parser/lib/esm/main.js',
    path.join(rootDir, 'node_modules', 'jsonc-parser', 'lib', 'esm', 'main.js'),
  ],
])

function resolveSourceFile(candidate) {
  const directCandidates = [candidate]
  if (candidate.endsWith('.js')) {
    directCandidates.unshift(candidate.slice(0, -3) + '.ts')
    directCandidates.unshift(candidate.slice(0, -3) + '.tsx')
    directCandidates.unshift(candidate.slice(0, -3) + '.mts')
  } else if (candidate.endsWith('.jsx')) {
    directCandidates.unshift(candidate.slice(0, -4) + '.ts')
    directCandidates.unshift(candidate.slice(0, -4) + '.tsx')
  } else if (path.extname(candidate) === '') {
    directCandidates.unshift(candidate + '.ts')
    directCandidates.unshift(candidate + '.tsx')
    directCandidates.unshift(candidate + '.mts')
    directCandidates.unshift(candidate + '.js')
    directCandidates.unshift(candidate + '.jsx')
    directCandidates.unshift(candidate + '.mjs')
  }

  for (const file of directCandidates) {
    if (existsSync(file)) {
      return file
    }
  }

  return candidate
}

const localSourceResolver = {
  name: 'local-source-resolver',
  setup(buildContext) {
    buildContext.onResolve({ filter: /.*/ }, args => {
      const stub = privateModuleStubs.get(args.path)
      if (stub) {
        return { path: stub }
      }

      const packageAlias = packageAliases.get(args.path)
      if (packageAlias) {
        return { path: packageAlias }
      }

      if (args.path.endsWith('.d.ts')) {
        return { path: emptyModulePath }
      }

      if (args.path.startsWith('src/')) {
        const resolved = resolveSourceFile(path.join(rootDir, args.path))
        if (
          !existsSync(resolved) &&
          (args.path.endsWith('.md') || args.path.endsWith('.txt'))
        ) {
          return { path: emptyTextModulePath }
        }
        return {
          path: existsSync(resolved) ? resolved : args.path,
          ...(existsSync(resolved) ? {} : { external: true }),
        }
      }

      if (args.path.startsWith('./') || args.path.startsWith('../')) {
        const resolved = resolveSourceFile(path.resolve(args.resolveDir, args.path))
        if (
          !existsSync(resolved) &&
          (args.path.endsWith('.md') || args.path.endsWith('.txt'))
        ) {
          return { path: emptyTextModulePath }
        }
        return {
          path: existsSync(resolved) ? resolved : args.path,
          ...(existsSync(resolved) ? {} : { external: true }),
        }
      }

      return undefined
    })
  },
}

const version = process.env.npm_package_version ?? '0.1.0'
const buildTime = new Date().toISOString()

await build({
  absWorkingDir: rootDir,
  bundle: true,
  entryPoints: ['src/entrypoints/cli.tsx'],
  outdir: 'dist',
  entryNames: '[dir]/[name]',
  chunkNames: 'chunks/[name]-[hash]',
  format: 'esm',
  splitting: true,
  platform: 'node',
  target: 'node20',
  packages: 'external',
  sourcemap: true,
  plugins: [localSourceResolver],
  banner: {
    js: '#!/usr/bin/env node',
  },
  loader: {
    '.txt': 'text',
    '.md': 'text',
  },
  define: {
    'MACRO.VERSION': JSON.stringify(version),
    'MACRO.BUILD_TIME': JSON.stringify(buildTime),
    'MACRO.FEEDBACK_CHANNEL': JSON.stringify('https://github.com/historyliao/woo/issues'),
    'MACRO.ISSUES_EXPLAINER': JSON.stringify('open an issue at https://github.com/historyliao/woo/issues'),
    'MACRO.PACKAGE_URL': JSON.stringify('woo'),
    'MACRO.NATIVE_PACKAGE_URL': 'undefined',
    'MACRO.VERSION_CHANGELOG': JSON.stringify(''),
    'process.env.USER_TYPE': JSON.stringify('external'),
    'process.env.CLAUDE_CODE_VERIFY_PLAN': JSON.stringify('false'),
  },
  logLevel: 'info',
})
