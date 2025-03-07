import js from '@eslint/js'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['**/node_modules/**', '**/dist/**', '.git/**', '**/cache/**', '**/deps/**']
    },
    js.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: true
        },
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-unused-vars': 'warn',
            // 'semi': ['error', 'never'],// 强制不能使用分号结尾
            // 'quotes': ['error', 'single'], 强制引号类型单引号，使用双引号报错
            // 'comma-dangle': ['error', 'never']// 强制末尾项不能有逗号
        }
    },
]
