const resize = {}
resize.install = Vue => {
  Vue.directive('resize', {
    bind(el, binding) {
      let height = '';
      function isReize() {
        const style = document.defaultView.getComputedStyle(el);
        if (height !== style.height) {
          binding.value();
        }
        height = style.height;
      }
      el.__vueSetInterval__ = setInterval(isReize, 300);
    },
    unbind(el) {
      clearInterval(el.__vueSetInterval__);
    }
  })
}

export default resize

