<template>
    <div class="blog-tags">
        <ul ref="list" class="tag-cloud">
            <li v-for="tag in tags" :key="tag">
                <a @click="onTagClick(tag)">{{ tag }}</a>
            </li>
        </ul>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { data } from '../theme/post.data'

const { tagMap } = data
const tags = Object.keys(tagMap)

function onTagClick(newTag) {
    let baseUrl = window.location.href.split(/[?#]/)[0]; // 移除hash和查询参数部分
    window.location.href = `${baseUrl}?tag=${newTag}`;
}
const list = ref()

// 添加接口定义
interface Position {
    top: number;
    left: number;
}

const randomizeStyles = () => {
    const container = list.value;
    const lis = container.querySelectorAll('li');
    const positions: Position[] = [];
    const width = container.offsetWidth;
    const height = width * 0.6; // 高度为宽度的3/5
    
    const minDistance = width * 0.07; // 动态计算最小距离
    const radiusX = width * 0.46; // 横向半径
    const radiusY = height * 0.425; // 纵向半径
    const centerX = width * 0.5; // 中心点X
    const centerY = height * 0.5; // 中心点Y
    const padding = width * 0.04; // 动态边距

    lis.forEach(li => {
        let validPosition = false;
        let attempts = 0;
        let top, left;

        while (!validPosition && attempts < 150) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.sqrt(Math.random());
            left = centerX + radiusX * distance * Math.cos(angle);
            top = centerY + radiusY * distance * Math.sin(angle);
            
            if (top < padding || top > height - padding || left < padding || left > width - padding) {
                attempts++;
                continue;
            }
            
            validPosition = true;
            for (const pos of positions) {
                const dist = Math.sqrt(
                    Math.pow(top - pos.top, 2) + 
                    Math.pow(left - pos.left, 2)
                );
                const fontSize = Math.min(width * 0.05, Math.max(width * 0.015, Math.random() * (width * 0.04 - width * 0.015) + width * 0.015));
                const requiredDistance = minDistance + fontSize / 2;
                if (dist < requiredDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        if (validPosition) {
            positions.push({ top, left });
            const fontSize = Math.min(width * 0.05, Math.max(width * 0.015, Math.random() * (width * 0.04 - width * 0.015) + width * 0.015));
            li.style.color = `hsl(${Math.random() * 360}, 80%, 65%)`;
            li.style.fontSize = `${fontSize}px`;
            li.style.top = `${top}px`;
            li.style.left = `${left}px`;
            li.style.transition = 'all 0.3s ease';
        } else {
            const angle = (positions.length * Math.PI * 2) / lis.length;
            left = centerX + radiusX * Math.cos(angle);
            top = centerY + radiusY * Math.sin(angle);
            positions.push({ top, left });
            li.style.color = `hsl(${Math.random() * 360}, 80%, 65%)`;
            li.style.fontSize = `${width * 0.015}px`; // 最小字体大小
            li.style.top = `${top}px`;
            li.style.left = `${left}px`;
            li.style.transition = 'all 0.3s ease';
        }
    });
}
onMounted(() => {
    randomizeStyles()
})

</script>

<style scoped lang="scss">
.blog-tags {
    max-width: 1024px;
    width: 100%;
    padding: 24px 32px;
    margin: 0 auto;

    .tag-cloud {
        width: 100%; // 撑满父元素
        aspect-ratio: 5/3; // 设置宽高比为5:3
        position: relative;
        list-style: none;
        padding: 0;
        margin: 0 auto;
        border-radius: 50% / 30%;
        border: 1px solid var(--vp-c-divider-light);
    }

    li {
        position: absolute;
        cursor: pointer;
        padding: 8px;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;

        &:hover {
            transform: translate(-50%, -50%) scale(1.1);
            filter: brightness(1.1);
        }

        a {
            color: inherit;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .tags, .current-tag, .card, .article-list {
        display: none;
    }
}
</style>