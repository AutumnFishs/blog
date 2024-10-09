<script setup lang="ts">
import confetti from 'canvas-confetti';
import { inBrowser } from 'vitepress';

if (inBrowser) {
    // confetti({
    //     particleCount: 100,
    //     spread: 500,
    //     origin: { y: 0.2 }
    // });
    var scalar = 2;// 放大倍数
    var pineapple = confetti.shapeFromText({ text: '🍍', scalar }); // 纸屑内容，默认是彩色碎屑

    confetti({
        shapes: [pineapple],
        particleCount: 100,
        spread: 500,
        origin: { y: 0.2 }
    });
}
</script>