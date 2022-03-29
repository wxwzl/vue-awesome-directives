import {
  getScrollTop,
  getScrollYNode,
  isEmpty,
  isObject,
  isString,
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
  _scrollCallBack: () => void;
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
export default {
  bind: (el: HTMLElement, binding: DirectiveBinding) => {
    const option = binding.value;
    const top = option.top;
    const bottom = option.bottom;
    const left = option.left;
    const right = option.right;
    const zIndex = option.zIndex;
    const rootNode: HTMLElement = getRoot(option, el);
    let observer = observers.get(rootNode);
    if (!observer) {
      let options = {
        root: rootNode,
        // rootMargin: "0px",
        threshold: 1.0,
      };
      //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          console.log(entry.boundingClientRect, "entry.boundingClientRect");
          console.log(entry.rootBounds, "entry.rootBounds");
          const target = entry.target as CustomElement;
          if (isEmpty(target.lastState)) {
            target.lastState = entry.isIntersecting;
            return;
          }
          if (target.lastState != entry.isIntersecting) {
            if (target.lastState === true) {
              target._position = target.style.position;
              target.style.position = "fixed";
              if (!isEmpty(top)) {
                target._top = target.style.top;
                target.style.top = top;
              }
              if (!isEmpty(bottom)) {
                target._bottom = target.style.bottom;
                target.style.bottom = bottom;
              }
              if (!isEmpty(left)) {
                target._left = target.style.left;
                target.style.left = left;
              }
              if (!isEmpty(right)) {
                target._right = target.style.right;
                target.style.right = right;
              }
              if (!isEmpty(zIndex)) {
                target._zIndex = target.style.zIndex;
                target.style.zIndex = zIndex;
              }
              Promise.resolve().then(() => {
                target._scrollTop = getScrollTop(target, rootNode);
                const callBack = () => {
                  if (!target) {
                    rootNode.removeEventListener("scroll", callBack);
                    return;
                  }
                  const srollTop = getScrollTop(target, rootNode);
                  if (
                    (srollTop < target._scrollTop && !isEmpty(top)) ||
                    (srollTop > target._scrollTop && !isEmpty(bottom))
                  ) {
                    if (!isEmpty(top)) {
                      target.style.top = target._top;
                    }
                    if (!isEmpty(bottom)) {
                      target.style.bottom = target._bottom;
                    }
                    if (!isEmpty(left)) {
                      target.style.left = target._left;
                    }
                    if (!isEmpty(right)) {
                      target.style.right = target._right;
                    }
                    if (!isEmpty(zIndex)) {
                      target.style.zIndex = target._zIndex;
                    }
                    target.style.position = target._position;
                    rootNode.removeEventListener("scroll", callBack);
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
      observer.observe(el);
    }
  },
  unbind: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {
    const option = binding.value;
    const rootNode: HTMLElement = getRoot(option, el);
    rootNode &&
      (el as CustomElement)._scrollCallBack &&
      rootNode.removeEventListener(
        "scroll",
        (el as CustomElement)._scrollCallBack
      );
    let observer = observers.get(rootNode);
    if (observer) {
      observer.unobserve(el);
      if (observer.takeRecords().length == 0) {
        observer.disconnect();
        observers.delete(rootNode);
      }
    }
  },
};
