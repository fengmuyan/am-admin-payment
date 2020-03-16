<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <i v-if="isActive" class="el-icon-s-fold"></i>
    <i v-else class="el-icon-s-unfold"></i>
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit("toggleClick");
    }
  }
};
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.hamburger-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
