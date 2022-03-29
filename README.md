# vue-awesome-directives

vue 指令

## 安装

`pnpm add vue-awesome-directives -S`

## 使用

### 全局引入
```
import Vue from "vue";
import directive from "vue-awesome-directives";
Vue.use(directive);

```

### 按需引入

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


