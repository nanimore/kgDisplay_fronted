<template>
  <div class="app-container home">
    <span class="title">欢迎进入标注系统</span>
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
  // background-color: black;
  background-image: url("../assets/images/welcome.gif");
  background-repeat: no-repeat; /* 不重复背景图像 */  
  background-size: cover; /* 确保背景图像覆盖整个元素 */  
  /* 如果GIF图像尺寸小于元素，您可能还想设置背景位置 */  
  background-position: center center; /* 背景图像居中 */  
  height: calc(100vh - 50px);
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

