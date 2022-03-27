import { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

export const enum Type {
  name = "name",
}
export default {
  name: "Sticky",
  bind: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {},
  inserted: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {},
  update: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {},
  componentUpdated: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {},
  unbind: (
    el: HTMLElement,
    binding: DirectiveBinding,
    vnode: VNode,
    oldVnode: VNode
  ) => {},
};
