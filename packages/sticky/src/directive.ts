import {
  getScrollTop,
  getScrollYNode,
  isEmpty,
  isObject,
  isString,
  notEmpty,
} from "packages/shareUtils";
import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";
const observers = new WeakMap<HTMLElement, IntersectionObserver>();
type CustomElement = HTMLElement & {
  _position: string;
  _top: string;
  _bottom: string;
  _left: string;
  _right: string;
  _zIndex: string;
  lastState: boolean;
  _scrollTop: number;
  _scrollCallBack: null | (() => void);
};

function getRoot(option: any, currentNode?: HTMLElement) {
  if (isObject<HTMLElement>(option.root)) {
    return option.root;
  } else if (isString(option.root)) {
    let selector = option.root;
    return document.querySelector(selector);
  }
  return getScrollYNode(currentNode);
}
export interface Option {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  zIndex?: string;
  disabled?: boolean;
  root?: string | HTMLElement;
}
export function addSticky(el: HTMLElement, option: Option) {
  const top = option.top;
  const bottom = option.bottom;
  const left = option.left;
  const right = option.right;
  const zIndex = option.zIndex;
  const rootNode: HTMLElement = getRoot(option, el);
  if (rootNode === null) {
    console.error(`找不到root节点:${option.root}`);
    return;
  }
  let observer = observers.get(rootNode);
  if (!observer) {
    let options = {
      root: rootNode,
      // rootMargin: "0px",
      threshold: 1.0,
    };
    //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as CustomElement;
        if (isEmpty(target.lastState)) {
          target.lastState = entry.isIntersecting;
          return;
        }
        /**
         * 暂时只考虑从可见变为不可见时开启sticky的监听，忽略错过了可见变为不可见的时刻的情况(即启用该指令时
         * 元素已经跑到不可见的位置，且继续按当前方向滚动是永远处于不可见状态的)。
         *
         * **/

        if (target.lastState != entry.isIntersecting) {
          if (target.lastState === true) {
            const srcollTop = getScrollTop(target, rootNode);
            target._scrollTop = srcollTop - target.clientHeight;
            target._position = target.style.position;
            target.style.position = "fixed";
            if (notEmpty<string>(top)) {
              target._top = target.style.top;
              target.style.top = top;
            }
            if (notEmpty<string>(bottom)) {
              target._bottom = target.style.bottom;
              target.style.bottom = bottom;
            }
            if (notEmpty<string>(left)) {
              target._left = target.style.left;
              target.style.left = left;
            }
            if (notEmpty<string>(right)) {
              target._right = target.style.right;
              target.style.right = right;
            }
            if (notEmpty<string>(zIndex)) {
              target._zIndex = target.style.zIndex;
              target.style.zIndex = zIndex;
            }
            Promise.resolve().then(() => {
              const callBack = () => {
                if (!target) {
                  rootNode.removeEventListener("scroll", callBack);
                  return;
                }
                const srollTop = getScrollTop(target, rootNode);
                if (
                  (srollTop < target._scrollTop && notEmpty(top)) ||
                  (srollTop > target._scrollTop && notEmpty(bottom))
                ) {
                  recoverStyle(target, option);
                  rootNode.removeEventListener("scroll", callBack);
                  target._scrollCallBack = null;
                }
              };
              target._scrollCallBack = callBack;
              rootNode.addEventListener("scroll", callBack, {
                passive: true,
              });
            });
          }
          target.lastState = entry.isIntersecting;
        }
      });
    }, options);
  }
  observer.observe(el);
}

function removeScrollEventListener(el: HTMLElement, rootNode: HTMLElement) {
  const _scrollCallBack = (el as CustomElement)._scrollCallBack;
  if (rootNode && notEmpty<() => void>(_scrollCallBack)) {
    rootNode.removeEventListener("scroll", _scrollCallBack);
  }
}

function removeObserver(el: HTMLElement, rootNode: HTMLElement) {
  const observer = observers.get(rootNode);
  if (observer) {
    observer.unobserve(el);
    if (observer.takeRecords().length == 0) {
      observer.disconnect();
      observers.delete(rootNode);
    }
  }
}
function recoverStyle(target: CustomElement, option: Option) {
  const top = option.top;
  const bottom = option.bottom;
  const left = option.left;
  const right = option.right;
  const zIndex = option.zIndex;
  if (notEmpty<string>(top)) {
    target.style.top = target._top;
  }
  if (notEmpty<string>(bottom)) {
    target.style.bottom = target._bottom;
  }
  if (notEmpty<string>(left)) {
    target.style.left = target._left;
  }
  if (notEmpty<string>(right)) {
    target.style.right = target._right;
  }
  if (notEmpty<string>(zIndex)) {
    target.style.zIndex = target._zIndex;
  }
  if (target._position !== undefined) {
    target.style.position = target._position;
  }
}
function unbind(el: HTMLElement, option: Option) {
  const rootNode: HTMLElement = getRoot(option, el);
  removeScrollEventListener(el, rootNode);
  removeObserver(el, rootNode);
}
export default {
  inserted: (el: HTMLElement, binding: DirectiveBinding) => {
    const option = binding.value;
    if (!option.disabled) {
      Promise.resolve().then(() => {
        addSticky(el, option);
      });
    }
  },
  update(el: HTMLElement, binding: DirectiveBinding) {
    const oldValue = binding.oldValue as Option;
    const newValue = binding.value as Option;
    if (
      oldValue.bottom != newValue.bottom ||
      oldValue.top != newValue.top ||
      oldValue.left != newValue.left ||
      oldValue.right != newValue.right ||
      oldValue.zIndex != newValue.zIndex ||
      oldValue.disabled != newValue.disabled
    ) {
      if (oldValue.disabled === true && newValue.disabled != true) {
        addSticky(el, newValue);
        return;
      }
      if (oldValue.disabled != true && newValue.disabled === true) {
        unbind(el, newValue);
        return;
      }
      //todo:其他的情况
    }
  },
  unbind: (el: HTMLElement, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) => {
    const option = binding.value;
    unbind(el, option);
  },
};
