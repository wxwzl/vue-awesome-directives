import directive from "./directive";
import Vue from "vue";
const name = "Sticky";
export default {
  name,
  install() {
    Vue.component(name, directive);
  },
  directive,
};
