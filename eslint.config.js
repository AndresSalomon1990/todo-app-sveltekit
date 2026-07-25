import path from 'node:path';

import js from '@eslint/js';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

const eslintIgnore = [
  '.git/',
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  '*.min.js',
  '*.config.js',
  '*.d.ts',
  'router.d.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'svelte.config.js',
  'vite.config.js',
]

export default defineConfig(
	includeIgnoreFile(gitignorePath),
  { ignores: eslintIgnore },
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	eslintPluginImport.flatConfigs.recommended,
	eslintPluginUnicorn.configs['recommended'],
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
			'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {
			'prettier/prettier': 'off',
			'react/prop-types': 'off',
			'no-console': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
			'space-before-function-paren': 'off',
			'no-irregular-whitespace': ['error'],
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'one-var': ['error', 'never'],
			'no-cond-assign': ['error', 'except-parens'],
			eqeqeq: ['error', 'always'],
			'eol-last': ['error', 'always'],
			'new-parens': ['error', 'always'],
			'no-caller': ['error'],
			'no-constant-condition': ['error'],
			'no-control-regex': ['error'],
			'no-debugger': ['error'],
			'no-duplicate-case': ['error'],
			'no-eval': ['error'],
			'no-ex-assign': ['error'],
			'no-extra-boolean-cast': ['error'],
			'no-fallthrough': ['error'],
			'no-inner-declarations': ['error'],
			'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
			'no-proto': ['error'],
			'no-shadow': ['off'],
			'@typescript-eslint/no-shadow': 'error',
			'no-regex-spaces': ['error'],
			'no-self-compare': ['error'],
			'no-sparse-arrays': ['error'],
			'no-mixed-spaces-and-tabs': ['error'],
			'no-unsafe-negation': ['error'],
			'no-new-wrappers': ['error'],
			'no-self-assign': ['error'],
			'no-this-before-super': ['error'],
			'no-with': ['error'],
			'rest-spread-spacing': ['error', 'never'],
			'no-trailing-spaces': ['error', { ignoreComments: true }],
			'no-undef-init': ['error'],
			'no-unsafe-finally': ['error'],
			'padded-blocks': ['error', 'never'],
			'space-in-parens': ['error', 'never'],
			'use-isnan': ['error'],
			'valid-typeof': ['error', { requireStringLiterals: true }],
			'brace-style': ['error', '1tbs'],
			curly: ['error', 'all'],
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase']
				},
				{
					selector: 'typeLike',
					format: ['PascalCase']
				},
				{
					selector: 'class',
					format: ['PascalCase']
				},
				{
					selector: 'interface',
					format: ['PascalCase'],
					custom: {
						regex: '^I[A-Z]',
						match: false
					}
				}
			],
			'handle-callback-err': ['error', '^(err|error)$'],
			'max-len': [
				'error',
				{
					code: 100,
					comments: 120,
					ignoreUrls: true,
					ignoreTemplateLiterals: true,
					// For TailwindCSS classes
					ignorePattern: '(className|cva)|["\'][^"\']*["\']'
				}
			],
			'no-array-constructor': ['error'],
			'no-unreachable': ['error'],
			'no-multi-spaces': ['error'],
			'unicorn/prefer-module': 'error',
			'unicorn/prefer-node-protocol': 'error',
			'unicorn/filename-case': [
				'error',
				{
					case: 'kebabCase',
					ignore: [
						'babel.config.js',
						'global.d.ts',
						'metro.config.js',
						'nativewind-env.d.ts',
						'tailwind.config.js'
					]
				}
			],
			'unicorn/no-await-expression-member': 'error',
			'unicorn/no-for-loop': 'error',
			'unicorn/no-instanceof-array': 'error',
			'unicorn/prefer-number-properties': 'error',
			'unicorn/no-null': 'off'
		}
	}
);
