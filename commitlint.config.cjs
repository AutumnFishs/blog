module.exports = {
  extends: ["@commitlint/config-conventional"],
  prompt: {
    questions: {
     type: {
      description: "选择你要提交的类型:",
      enum: {
       feat: {
        description: "新功能",
        title: "Features",
        emoji: "✨"
       },
       fix: {
        description: "修复相关bug",
        title: "Bug Fixes",
        emoji: "🐛"
       },
       docs: {
        description: "文档更改",
        title: "Documentation",
        emoji: "📚"
       },
       style: {
        description: "样式修改(空白、格式、缺少分号等)",
        title: "Styles"
        },
        refactor: {
          description: "既不修复bug也不添加新功能的更改",
          title: "Code Refactoring"
        },
        perf: {
          description: "性能优化",
          title: "Performance Improvements"
        },
        test: {
          description: "增加测试",
          title: "Tests"
        },
        build: {
          description: "影响构建系统或外部依赖项的更改(示例范围:gulp、broccoli、npm)",
          title: "Builds"
        },
        ci: {
          description: "对CI配置文件和脚本的更改(示例范围:Travis, Circle, BrowserStack, SauceLabs)",
          title: "Continuous Integrations"
        },
        chore: {
          description: "除src目录或测试文件以外的修改",
          title: "Chores"
        },
        revert: {
          description: "回退历史版本",
          title: "Reverts"
        }
      }
     }
    }
   },
  rules: {
    "subject-case": [0] // 关闭大小写校验
  }
};