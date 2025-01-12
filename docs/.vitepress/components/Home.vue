<template>
    <div class="home">
        <div class="bg" :style="{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }"></div>
        <header class="header">
            <img v-if="site.themeConfig.logo" class="logo" :src="site.themeConfig.logo"></img>
            <div class="title">{{ blog.name }}</div>
            <div class="description">{{ blog.desc }}</div>
            <ul class="banner">
                <li v-for="(item, index) in blog.inspiring" :key="index" v-show="isShowInspiring === index">{{ item }}
                </li>
            </ul>
            <img class="header-btn" src="../public/icon.svg" alt="鼠标滚动" @click="handleClick">
        </header>
        <main class="main relative" ref="mainRef">
            <slot name='main'></slot>
        </main>
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-item">{{ site.themeConfig.footer.copyright }}</div>
                <div class="footer-item">{{ site.themeConfig.footer.message }} </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref } from 'vue'

onMounted(() => {
    const VPNavBar = document.querySelector('.VPNavBar')
    if (VPNavBar) {
        VPNavBar.classList.add('.home')
    }
})
const { site, frontmatter } = useData()
const mainRef = ref()
const handleClick = () => {
    mainRef.value?.scrollIntoView({ behavior: 'smooth' })
}
const bg = frontmatter.value.bgImage ? site.value.base + 'public/' + frontmatter.value.bgImage : ''
const blog = frontmatter.value.blog
const inspiringTimeout = blog.inspiringTimeout || 10000
const isShowInspiring = ref(0)
setInterval(() => {
    if (isShowInspiring.value >= blog.inspiring.length - 1) {
        isShowInspiring.value = 0
    } else {
        isShowInspiring.value += 1
    }
}, inspiringTimeout)
</script>

<style scoped lang="scss">
.home {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    box-sizing: content-box;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;

    .bg {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -100;
    }

    .header {
        width: 100vw;
        height: 100vh;
        padding-top: 64px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        padding-bottom: 20%;

        .logo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .title {
            font-size: 32px;
        }

        .description {
            font-size: 14px;
            font-weight: 400;
            opacity: 0.7;
            color: #999;
            padding: 10px 0;
        }

        .banner {
            width: 100%;

            li {
                text-align: center;
                margin: auto;
                font-size: 16px;
            }
        }

        .header-btn {
            position: absolute;
            bottom: 20px;
            width: 50px;
            height: 50px;
        }
    }

    .main {
        width: 100vw;
        min-height: 100vh;
        padding-top: 64px;
    }

    .footer {
        width: 100vw;
        height: 80px;
        background: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;

        .footer-content {
            display: flex;
            justify-content: center;
            align-items: center;

            .footer-item {
                margin: 0 10px;
                font-size: 12px;
                font-weight: 400;
            }
        }
    }
}
</style>