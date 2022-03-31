/* Automatically generated by './script/build-entry.js' */

import { VueConstructor } from "vue";
import { default as $Sticky } from '../packages/sticky/src/index';
export const Sticky = $Sticky


const directives = [
Sticky
];

export const install = function(Vue: VueConstructor, opts = {}) {
  

  directives.forEach(component => {
    Vue.directive(component.name, component.directive);
  });

  

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  version: '0.0.5',
  install,
  Sticky
};
