---
hidden: true
---
# 平时用到的CSS样式块

1. 单行文本溢出隐藏省略号
```css
div {
    	word-break: keep-all;/*保证单词完整性*/
    	white-space: nowrap; /* 不折行 */
    	overflow: hidden;    /* 隐藏溢出部分 */
    	text-overflow: ellipsis; /* 显示为省略号 */
    	max-width: 200px; /* 添加一个宽度限制 */
}
```

2. 多行文本溢出隐藏省略号(遇到数字可能会没有省略号)
```css
{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;/* webkit 的支持 */
    display: -moz-box;
    -moz-box-orient: vertical;
    -moz-line-clamp: 2; /* Firefox 的支持 */
    max-width: 200px;
}
```

3. flex实现多行文本溢出隐藏省略号
```css
.ellipsis {
    display: flex;
    flex-direction: column;
    max-height: 4em; /* 根据字体大小设置高度 */
    overflow: hidden;
}
.ellipsis > span {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 指定显示的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.ellipsis > span::after {
    content: '...';
    position: relative;
    white-space: nowrap;
    width: 100%;
    display: block;
    overflow: hidden;
}
```
