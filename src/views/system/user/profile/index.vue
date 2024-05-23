<template>
  <div class="app-container">
    <el-card class="passwordCard">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <resetPwd />
    </el-card>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "resetPwd"
    };
  },
  created() {
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.passwordCard{
  width: 600px;
  margin: 0 auto;
  margin-top: 80px;
}
</style>
