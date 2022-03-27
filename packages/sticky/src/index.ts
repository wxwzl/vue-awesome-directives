import directive from "./directive";
const name = "Sticky";
export default {
  name,
  install() {
    Vue.component(name, directive);
  },
  directive,
};
