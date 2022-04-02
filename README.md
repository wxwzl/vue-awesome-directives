# vue-awesome-directives

vue 指令

## 安装

`pnpm add vue-awesome-directives -S`

或

`npm i vue-awesome-directives -S`


## 使用

### 全局引入
```
import Vue from "vue";
import directive from "vue-awesome-directives";
Vue.use(directive);

```

### 按需引入
- 1、 安装[babel-plugin-component](https://github.com/ElementUI/babel-plugin-component)
    或 安装[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)
```
 pnpm add babel-plugin-component -D  
 或
 npm i babel-plugin-component -D
 或
 pnpm add babel-plugin-import -D 
 或
 npm i babel-plugin-import -D
```
- 2、将 .babelrc或babel.config.js 修改为：
```
// babel-plugin-component
module.exports = {
  //...
  plugins: [
    [
      "component",
      {
        libraryName: "vue-awesome-directives",
        style: false,
      },
    ],
  ],
};
//或者babel-plugin-import

module.exports = {
  //...
  plugins: [
    [
      "import",
      {
        libraryName: "vue-awesome-directives",
        style: false,
      },
    ],
  ],
};
```
- 3、使用
```
// 局部注册
import { Sticky } from "vue-awesome-directives";
import {
  Vue,
  Component,
  Prop,
  ModelSync,
  InjectReactive,
} from "vue-property-decorator";
@Component({
  name: schema.componentType,
  directives: {
    Sticky:Sticky.directive,
  },
})
export default class Button extends Vue {

}

//或者 全局注册

import { Sticky } from "vue-awesome-directives";
Vue.use(Sticky);

```

## 指令列表

- `v-sticky`: 不依赖css 的sticky属性，因为使用该属性的限制条件太多了，如：[https://github.com/w3c/csswg-drafts/issues/865](https://github.com/w3c/csswg-drafts/issues/865).该指令内部依赖了[`Intersection_Observer`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)，需要兼容ie或低版本的同学可以引入[IntersectionObserver polyfill](https://www.npmjs.com/package/intersection-observer)这个polyfill来解决兼容性问题。关于Intersection_Observer_API兼容性见[详情](https://caniuse.com/?search=IntersectionObserver)

```
使用示例：

<van-button
    v-sticky="{ top: '3rem', zIndex: 1, left: 0, root: '#page' , disabled: isSticky,}"
    :type="actualConfig.type"
    :style="style"
    :disabled="actualConfig.disabled"
    :round="round"
    :square="square"
    :size="actualConfig.size"
    :native-type="nativeType"
    @click="onClick"
  >
    {{ actualConfig.btnText }}
  </van-button>
  

  //其中root:可以是css选择器或一个dom对象，如果不填，默认为选取最近的一个滚动父节点
```


