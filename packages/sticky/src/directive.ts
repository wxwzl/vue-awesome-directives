import { isEmpty, isObject, isString } from "packages/shareUtils";
import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";
const observers = new WeakMap<HTMLElement, IntersectionObserver>();
type CustomElement = HTMLElement & {
  _position: any;
  _top: any;
  _bottom: any;
  lastState: boolean;
};

function getRoot(option: any) {
  if (isObject<HTMLElement>(option.root)) {
    return option.root;
  } else if (isString(option.root)) {
    let selector = option.root;
    return document.querySelector(selector);
  }
  return null;
}
export default {
  bind: (el: HTMLElement, binding: DirectiveBinding) => {
    const option = binding.value;
    const top = option.top;
    const bottom = option.bottom;
    const rootNode: HTMLElement = getRoot(option);
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
            } else {
              target.style.position = target._position;
              target.style.top = target._top;
              target.style.bottom = target._bottom;
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
    const rootNode: HTMLElement = getRoot(option);
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
