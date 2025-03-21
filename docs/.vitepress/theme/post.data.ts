import { createContentLoader } from "vitepress";

interface Post {
  title: string;
  url: string;
  date: {
    time: number;
    string: string;
  };
  abstract?: string[];
}

interface RencentPost extends Post {
  tags?: string[];
}

interface data {
  yearMap: unknown;
  recentPosts: RencentPost[];
  postMap: unknown;
  tagMap: unknown;
  sidebarMap: unknown;
}

declare const data;
export { data };

// 将日期格式化为 {time: number, string: string} 类型
function formatDate(raw: string): Post["date"] {
  const date = new Date(raw);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从 0 开始，需要加 1
  const day = date.getDate().toString().padStart(2, "0");
  return {
    time: +date,
    string: `${year}-${month}-${day}`,
  };
}

export default createContentLoader("posts/*/*.md", {
  transform(raw): data {
    // post
    const postMap = {};
    // 归档数据映射
    const yearMap = {};
    // 标签数据映射
    const tagMap = {};
    // 侧边栏数据
    const sidebarMap = {};

    const posts = raw
      .map(({ url, frontmatter }) => {
        let tags = [url.split("/")[2]];
        if (frontmatter?.tags) {
          tags = [...tags, ...frontmatter.tags];
        }
        const result = {
          title: frontmatter.title,
          url,
          date: formatDate(frontmatter.date),
          abstract: frontmatter.abstract,
          tags,
        };
        const key = url.split("/")[2];
        if (!sidebarMap[key]) {
          sidebarMap[key] = [result];
        } else {
          sidebarMap[key].push(result);
        }
        postMap[result.url] = result;
        return result;
      })
      .sort((a, b) => b.date.time - a.date.time);

    const recentPosts = posts.slice(0, 10).map((item) => ({ ...item }));

    posts.forEach((item) => {
      const year = new Date(item.date.string).getFullYear();
      if (!yearMap[year]) {
        yearMap[year] = [];
      }
      yearMap[year].push(item.url);

      item.tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = [];
        }
        tagMap[tag].push(item.url);
      });
    });

    return {
      yearMap,
      recentPosts,
      postMap,
      tagMap,
      sidebarMap,
    };
  },
});
