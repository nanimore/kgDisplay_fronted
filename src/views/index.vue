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
  background-color: black;
  height: calc(100vh - 50px);
}
.title{
  position: fixed;
  top: 47%;
  left: 55%;
  transform: translate(-50%, -50%);
  font-weight: 700;
  letter-spacing: 5px;
}
</style>

