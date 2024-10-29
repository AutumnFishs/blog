# Svg 矢量图练习

## 示例

1. 示例：画一个圆

:::demo

```vue
<template>
  <!-- svg 画布 width 画布宽 height画布高 circle  cx cy 圆心  r半径 fill填充色 -->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="orange" />
  </svg>
</template>
```

:::

2. 示例：画一个矩形

:::demo

```vue
<template>
  <!-- rect 矩形标签： width矩形宽 height矩形高 x，y 起始点 rx ry 圆角半径-->
  <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" x="0" y="0" rx="10" ry="10" fill="orange" />
  </svg>
</template>
```

:::

3. 示例：画一个椭圆

:::demo

```vue
<template>
  <!-- ellipse 椭圆标签： width矩形宽 height矩形高 x，y 起始点 rx ry 圆角半径-->
  <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="25" ry="25" rx="50" fill="orange" />
  </svg>
</template>
```

:::

4. 示例：画一个线段

:::demo

```vue
<template>
  <!-- line 直线标签： x1 y1起点坐标 x2 y2终点坐标 stroke：线颜色 stroke-width 线宽-->
  <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="25" x2="100" y2="25" stroke="orange" stroke-width="2" />
  </svg>
</template>
```

:::

5. 示例：画一个多边形

:::demo

```vue
<template>
  <!-- polygon 多边形标签：points 多个顶点坐标用空格隔开，xy用 , 隔开 fill填充色-->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,0 50,0 100,50 50,100 0,100" fill="orange" />
  </svg>
</template>
```

:::

6. 示例：画一个折线

:::demo

```vue
<template>
  <!-- polyline 折线标签：points 多个顶点坐标用空格隔开，xy用 , 隔开 fill填充色 stroke折线颜色 stroke-width折线宽-->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <polyline
      points="0,0 50,0 100,50 50,100 0,100"
      fill="none"
      stroke="green"
      stroke-width="2"
    />
  </svg>
</template>
```

:::

6. 示例：画一个路径

:::demo

```vue
<template>
  <!-- path 路径标签：d 路径 M(移动) L(直线) H(水平线) V(垂直线) C(三次贝塞尔曲线) Z(闭合) S(光滑曲线) Q(二次贝塞尔曲线) T(光滑二次贝塞尔曲线) A(弧线)等，xy用 , 隔开 fill填充色 stroke折线颜色 stroke-width折线宽-->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 10 20 L 50 10 L 90 20 H 40 V50 C 50 60 70 80 90 20  S10 20 50 10 Z"
      fill="none"
      stroke="green"
      stroke-width="2"
    />
  </svg>
</template>
```

:::

7. 示例：画一个线性渐变

:::demo

```vue
<template>
  <!-- linearGradient 线性渐变标签：-->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <linearGradient id="linearColor" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="red" />
      <stop offset="100%" stop-color="blue" />
    </linearGradient>
  </svg>
</template>
```

:::

8. 示例：画一个径向渐变

:::demo

```vue
<template></template>
```

:::
