<template>
  <div class="app-container home">
    <div class="blur-background"></div>
    <span class="title" style="z-index: 2;">欢迎进入标注系统</span>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.7"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  font-size: 48px;
  margin: 0 auto;
  color: white;
  overflow: hidden;
  background-image: url("../assets/images/welcome.gif");
  background-size: cover;
  background-position: center;
  // background-color: black;
  height: calc(100vh - 50px);
}
.blur-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  filter: blur(4px); /* 调整模糊度 */
  z-index: 1; /* 保证模糊背景在后面 */
  pointer-events: none; /* 防止遮挡点击事件 */
}
.title{
  position: fixed;
  top: 47%;
  left: 55%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  letter-spacing: 5px;
  color: white;
}
</style>

