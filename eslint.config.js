import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    {
        ignores: ["**/node_modules/**", "**/dist/**", ".git/**", "**/cache/**", "**/deps/**"]
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
            "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
            "no-unused-vars": "warn",
            "comma-dangle": ["error", "never"],// 强制末尾项不能有逗号
            "semi": ["error", "always"],
            "quotes": ["error", "double"] // 强制使用一致的反勾号、双引号或单引号
        }
    }
];
