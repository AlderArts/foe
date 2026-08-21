import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'dist/**',
			'coverage/**',
			'.nyc_output/**',
			'js/vendor/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.config.js'],
		languageOptions: {
			globals: { ...globals.node }
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				VERSION: 'readonly',
				VERSION_NAME: 'readonly'
			}
		}
	},
	{
		rules: {
			// Legacy codebase: keep the noisiest rules as warnings until a cleanup pass
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'no-empty': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-this-alias': 'warn',
			'no-useless-assignment': 'warn',
			'no-constant-condition': 'warn',
			'@typescript-eslint/no-duplicate-enum-values': 'warn',
			'no-constant-binary-expression': 'warn',
			'no-fallthrough': 'warn',
			'no-prototype-builtins': 'warn',
			'no-var': 'warn'
		}
	}
);
