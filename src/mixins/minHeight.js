const mixin = {
  data() {
    return {
      isMounted: false,
      elementHeight: 0
    }
  },
  computed: {
    minHeight() {
      if (!this.isMounted) return;
      if (this.formShow !== undefined) {
        if (this.$refs.formPublic) {
          this.elementHeight = this.$refs.formPublic.offsetHeight
        }
        return window.innerHeight - (Number(this.formShow) * (this.elementHeight + 10)) - 134 + 'px'
      } else {
        return window.innerHeight - 134 + 'px'
      }
    }
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    resize() {
      this.elementHeight = '60px'
    }
  }
}

export default mixin