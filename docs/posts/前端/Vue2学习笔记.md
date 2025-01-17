---
title: Vue2学习笔记
date: 2025-01-15
tags: ['Vue']
abstract: Vue2采用的组件化思想，
---
# Vue2学习笔记

## 安装
1. 使用@vue-cli创建项目
    ::: info  
    ``` shell
      # 安装全局脚手架
      npm install -g @vue/cli
      # 创建项目
      vue create 项目名称
      # 进入项目
      cd 项目名称
      # 运行项目
      npm run serve

      # 也可以直接使用图形界面去创建项目
      vue ui
    ```
    :::
## 食用
vue采用的是组件化思想，在一个项目中一般都会有一个入口文件，比如vue-cli脚手架创建的项目中main.js就是它的入口文件，在这里创建一个根组件，插件、全局组件、全局变量等都会在这里进行注册，然后挂载到根组件上，最后渲染到页面上。

除了这些外，其他的组件或者页面都是通过import引入的，然后挂载到根组件上，最后渲染到页面上。

在这些组件中，同样自己的状态、方法、生命周期等，需要注意是在这些组件中data必须是一个函数，返回一个对象，这样每个组件的状态才是独立的，如果直接写对象，那么它的状态会造成全局污染，覆盖其他组件的状态。

### 基本语法
1. 模板语法：{{变量}},使用模板字符串会自动转义
   ::: info 示例
   ``` html
   <div>{{msg}}</div>
   ```
   :::
2. 指令：
   - v-bind：绑定属性，简写：:属性名
      ::: info 示例
        ``` html
        <div v-bind:xxx="123"></div>
        <div :xxy="123"></div>
        <div :style="{display:none}"></div>
        ```
      :::
   - v-model：双向绑定
      ::: info 对表单做数据绑定 
        ``` html
        <input v-model="xxxx"/>
        <!-- 等价于 -->
        <input type="text" id="input" :value="msg" @input="handleInput" />
        ```
      :::  

      ::: info 父子组件双向绑定(vue3写法，v2不支持)
        ``` html
        <input v-model:xxx="xxxx"></input>
        ```
      :::
   - v-for：循环渲染，需要绑定key,可以做一些列表展示
      ::: info 示例
      ``` html 
      <div v-for="(o,i) in arr" :key="i">{{o}}</div>
      ```
      :::
   - v-if：条件渲染 v-else-if v-else；可以做一些条件判断渲染，比如数据为空的时候渲染logo，数据不为空的时候展示数据
      ::: info 示例
      ``` html
      <div v-if="msg === '测试1'">这是测试</div>
      <div v-else-if="msg === '测试2'">这是测试2</div>
      <div v-else>其他</div>
      ```
      :::
   - v-show：条件渲染，不同的是，v-show只是控制元素的display属性，而v-if是控制元素是否存在;可以对切换比较频繁的元素控制显隐，减小性能开销
      ::: info 示例
      ``` html
      <div v-show="msg === '测试1'">show</div>
      ```
      :::
   - v-on：事件绑定，简写：@事件名,绑定事件，比如 @click、@input...
   - v-text：文本渲染，会覆盖元素中的内容
      ::: info 示例
      ``` html
      <div v-text="msg">text</div><span v-html="htmlContent"></span>
      ```
      :::
   - v-html：html渲染，使用时需要确保html片段是安全的，避免出现安全漏洞;
      ::: info 示例
      ``` html
      <span v-html="htmlContent"></span>
      ```
      :::
   - v-cloak：防止闪烁，需要配合样式使用
   - v-once:只计算一次，可以用来渲染静态组件，不会随着数据更新而发生变化（慎用）
      ::: info 示例
      ``` html
        <div v-once>
          <p>{{msg}}</p>
        </div>
      ```
      :::
3. 生命周期
   - beforeCreate：实例初始化之后，数据观测和事件配置之前被调用
   - created：实例创建完成后被立即调用
     - 可以在这个生命周期去请求接口获取后端数据
   - activated：keep-alive 组件激活时调用(第一次组件被创建时不会调用)
     - 组件激活后用来完成created生命周期所做的事情
   - beforeMount：挂载开始之前被调用
      - 可以在这个生命周期去请求接口获取后端数据
   - mounted：el挂载到实例上去之后调用该钩子
     - 在这个生命周期中，dom已经渲染完成，可以在这获取dom元素
   - beforeUpdate：数据更新时调用
   - updated：数据更新后会调用该钩子
   - deactivated：keep-alive 组件停用时调用
   - beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用
     - 可以做一些清除事件定时器等操作，
   - destroyed：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁  
   - errorCaptured：在捕获一个来自后代组件的错误时被调用
   ![生命周期图解](/lifecycle.png)
4. data：组件的数据，必须是一个函数，返回一个对象
5. methods：组件的方法，可以定义一些方法，在模板中使用
6. computed：计算属性，可以定义一些计算属性，依赖于data中的数据，进行计算
    ::: info 示例
    ``` html
      <!-- 使用 -->
      <div class="">{{ sum }}</div>
      <script>
      export default {
        data() {
          return {
            a:1,b:2
          };
        },
        computed: {
          // 计算属性用于计算 a 和 b 的和
          sum() {
            return this.a + this.b;
          },
      }}
    ```
    :::
7. watch：监听器，可以定义一些监听器,可以用来监听路由的变化，或者监听data，props数据的变化等，然后去做一些操作，更新ui、或者数据变化等
    ::: info 示例
    ``` html
      <!-- 使用 -->
      <div class="">{{ sum }}</div>
      <script>
      export default {
        data() {
          return {
            msg:"",
            message:"",
            data:{
              name:''
            }
          };
        },
        watch: {
          msg(newVal, oldVal) {
            console.log("New value:", newVal);
            console.log("Old value:", oldVal);
            // 在这里可以添加任何你想要执行的逻辑
          },
          message: {
            handler(newVal, oldVal) {
              console.log("New value:", newVal);
              console.log("Old value:", oldVal);
            },
            immediate: true, // 创建时立即执行监听器
          },
          data: {
            handler(newVal, oldVal) {
              console.log("New value:", newVal);
              console.log("Old value:", oldVal);
            },
            deep: true,// 深度
          },
      }}
    ```
    :::
<!-- ----------------------------------- -->
8. props：组件的属性，父组件传递到子组件的数据，或者时子组件标签上的一些属性，子组件可以通过props接收这些数据
    ::: info 示例
    ``` html
    <div class="common-header">
      <h2 class="title">{{ title }}</h2>
      <div class="right-content">
        <slot name="right"></slot>
      </div>
    </div>

    <script>
    export default {
      name: 'CommonHeader',
      props: {
        title: {
          type: String,
          default: '默认标题'
        }
      }
    }
    </script>
    ```
    :::
9. components注册局部组件，只能在当前组件中使用
    ::: info 示例
    ``` html
    <common-header></common-header>
    <image-upload></image-upload>
    <script>
    import ImageUpload from "@/components/ImageUpload.vue"; // 引入 ImageUpload 组件
    import CommonHeader from "@/components/CommonHeader.vue"
    export default {
      components: {
        ImageUpload,
        CommonHeader, // 注册 Header 组件
      }
    }
    </script>
    ```
    :::
10. name:组件名
11. filters:过滤器,局部过滤器
    ::: info 示例
    ``` html
      <!-- 使用 -->
      <div class="">{{ msg | capitalize }}</div>
      <script>
      export default {
        data() {
          return {
            msg: "",
          };
        },
        filters: {
          capitalize(value) {
            if (!value) return "";
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
          },
      }}
    ```
    :::

### 内置组件
1. 动态组件：`<component :is="组件名"></component>`
2. slot: 插槽分发内容
   ::: info 示例
   ``` html
   <!-- 子组件 -->
   <template>
     <div class="common-header">
       <!-- 默认插槽 -->
       <slot></slot>
       <div class="right-content">
         <!-- 具名插槽 -->
         <slot name="right"></slot>
         <!-- 作用域插槽 -->
         <slot name='test' :user="user"></slot>
       </div>
     </div>
   </template>

   <!-- 父组件 -->
   <template>
     <common-header>
       <template>
         默认插槽
       </template>
       <template #right>
         具名插槽
       </template>
       <template #test="SlotProps">
         作用域插槽{{SlotProps.user}}
       </template>
     </common-header>
   </template>
   ```
   :::
3. keep-alive缓存组件：
   - include: 需要缓存的组件 
   - exclude: 忽略缓存的组件，后设覆盖先设（源码中exclude在include后面，所以exclude会覆盖include）
   - max:最大缓存几个组件
   ::: info 示例
   ``` html
    <keep-alive :include="['compA', 'compB', /^comp-C-\d+$/]" exclude="[]" max="3">
      <component :is="compName"></component>
    </keep-alive>
   ```
   :::
4. transition过渡动画组件：
   - transition
   - transition-group
   - 可以用来做页面切换的动画
   ::: info 示例  
    - name名称不写话默认类名是v-xxx，这里以v-if为例，也可以是component切换组件或者v-show等等
          - v-enter：进入开始状态
          - v-enter-active：过渡参数
          - v-enter-to：进入结束状态
          - v-leave：离开开始状态
          - v-leave-active：离开过程中过渡参数
          - v-leave-to离开结束状态
    - duration：设置过渡事件，
    - appear：初始渲染过渡
    - mode：
      - "out-in"：先离开后进入
      - "in-out": 先进入后离开
    - transition-group 的 tag可以用来表示当前的父标签是什么类型的标签，比如下面的示例表示p标签
   ``` html
    <transition name="fade" :duration="{ enter: 500, leave: 800 }">
      <p v-if="show">hello</p>
    </transition>

    <style>
      .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
      }
      .fade-enter, .fade-leave-to  {
        opacity: 0;
      }
    </style>

    <!-- list过渡 -->
    <transition-group name="list" tag="p">
      <span v-for="item in items" v-bind:key="item" class="list-item">
        {{ item }}
      </span>
    </transition-group>
   ```
   :::
5. 函数式组件：

### 组件通信 
1. 父子组件通信
   ::: info 示例
   ``` html
    <!-- 父组件 -->
    <template>
      <div>
        <child :msg="msg" @child-event="parentEvent"></child>
      </div>
    </template>
    <script>
      import child from './child.vue'
      export default {
        components: {
          child
        },
        data() {
          return {
            msg: 'hello'
          }
        },
        methods: {
          parentEvent(val) {
            console.log('接收到子组件传递的值:', val)
          }
        }
      }
    </script>

    <!-- 子组件 -->
    <template>
      <div>
        <!-- 使用父组件传递的属性 -->
        <p>父组件传递的消息: {{msg}}</p>
        <!-- 调用父组件的方法 -->
        <button @click="handleClick">点击触发父组件方法</button>
      </div>
    </template>
    <script>
    export default {
      name: 'Child',
      // 接收父组件传递的属性
      props: {
        msg: {
          type: String,
          default: ''
        }
      },
      methods: {
        handleClick() {
          // 触发父组件的方法并传值
          this.$emit('child-event', '这是来自子组件的值')
        }
      }
    }
    </script>
   ```
   :::
2. 其他通信方式，组件通信方式除了props接收父组件的参数，$emit调用父组件的方法，并传参给父组件，还有很多，比如依赖注入inject、provie实现后代组件调用祖先组件的参数、方法;EventBus实现调用其他组件的方法参数等;但是都有一定的弊端，依赖注入的是非响应式的，父组件数据发生变化，子组件中并不会一起变化；EventBus使用的频繁后，会使状态变得十分混乱
3. vuex组件通信插件：相当于一个仓库，方便其他组件去这个仓库去取

### 常用API
1. nextTick：确保总是可以拿到最新的dom元素
2. set：手动添加一个响应式数据
3. directive：自定义指令
   - 全局指令和局部指令
   ::: info 示例
   ``` js
   // 图片懒加载指令
   // 全局指令
   Vue.directive('lazy', {
     // el: 指令绑定的元素
     // binding: 指令的相关信息
     bind(el, binding) {
       // 创建一个观察器
       const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) { // 当图片进入可视区域
             el.src = binding.value; // 设置图片src
             observer.unobserve(el); // 停止观察
           }
         })
       })
       // 开始观察元素
       observer.observe(el);
     }
   })

   // 局部指令
   export default {
     directives: {
       lazy: {
         bind(el, binding) {
           const observer = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
               if (entry.isIntersecting) {
                 el.src = binding.value;
                 observer.unobserve(el);
               }
             })
           })
           observer.observe(el);
         }
       }
     }
   }

   // 使用方式
   <template>
     <!-- 将实际图片地址传给v-lazy指令 -->
     <img v-lazy="imageUrl" />
   </template>

   <script>
   export default {
     data() {
       return {
         imageUrl: 'https://example.com/image.jpg'
       }
     }
   }
   </script>
   ```
   :::

   这个懒加载指令的主要功能是:
   1. 使用 IntersectionObserver API 监听图片元素是否进入可视区域
   2. 当图片进入可视区域时，将实际的图片地址设置到 src 属性
   3. 图片加载后取消观察，避免重复处理
   4. 可以全局注册或局部注册使用

4. filter：过滤器
5. componet：全局组件
   `Vue.component('组件名'，组件)`
6. use：插件
7. mixin：混入
   - 混入(mixin)提供了一种灵活的方式，来分发组件中的可复用功能
   - 一个混入对象可以包含任意组件选项(data、methods、生命周期钩子等)
   ::: info 示例
   ``` js
   // 定义一个混入对象 - myMixin.js
   export const myMixin = {
     data() {
       return {
         message: 'hello mixin'
       }
     },
     created() {
       console.log('mixin的created被调用')
     },
     methods: {
       hello() {
         console.log('来自mixin的hello方法')
       }
     }
   }

   // 使用混入 - 局部混入
   import { myMixin } from './myMixin.js'

   export default {
     name: 'MyComponent',
     mixins: [myMixin],
     created() {
       this.hello() // 可以直接使用mixin中的方法
       console.log(this.message) // 可以直接使用mixin中的数据
     }
   }

   // 全局混入 - main.js
   Vue.mixin({
     created() {
       console.log('全局混入的created')
     }
   })
   ```
   :::

   混入注意事项:
   1. 当组件和混入对象含有同名选项时的合并策略:
      - data对象在内部会进行递归合并，发生冲突时以组件数据优先
      - 同名钩子函数将合并为一个数组，混入对象的钩子将在组件自身钩子之前调用
      - methods、components等对象类选项，将被合并为同一个对象。若对象键名冲突时，取组件对象的键值对

   2. 全局混入需要谨慎使用，会影响到每个组件实例
   3. 混入适合抽取多个组件共同的业务逻辑，比如:
      - 表单验证逻辑
      - 页面缓存处理
      - 公共的数据处理方法等

8. ref：获取DOM元素
   ::: info 示例
   ``` html
   <!-- 模板中使用ref -->
   <template>
     <div>
       <!-- 在DOM元素上使用ref -->
       <div ref="myDiv">这是一个div元素</div>
       
       <!-- 在组件上使用ref -->
       <child-component ref="childComp"></child-component>
       
       <!-- 在v-for中使用ref -->
       <ul>
         <li v-for="(item, index) in list" :key="index" :ref="'item' + index">
           {{item}}
         </li>
       </ul>
     </div>
   </template>

   <script>
   export default {
     mounted() {
       // 访问DOM元素
       console.log(this.$refs.myDiv) // 获取div元素
       
       // 访问子组件实例
       console.log(this.$refs.childComp) // 获取子组件实例
       
       // 访问v-for中的元素
       console.log(this.$refs.item0) // 获取第一个li元素
     },
     methods: {
       // 在方法中使用
       handleClick() {
         // 可以直接操作DOM
         this.$refs.myDiv.style.color = 'red'
         
         // 可以调用子组件方法
         this.$refs.childComp.someMethod()
       }
     }
   }
   </script>
   ```
   :::

   ref的使用注意事项:
   1. ref只有在组件渲染完成后才能访问到（在mounted钩子之后）
   2. 如果ref用在v-for中，得到的引用会是一个数组
   3. 避免在模板或计算属性中访问 ref，因为它们不是响应式的
   4. 主要用途：
      - 访问DOM元素
      - 访问子组件实例
      - 操作表单
      - 管理焦点