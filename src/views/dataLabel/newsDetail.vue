<template>
    <div class="newListDetailContainer">
        <div class="newDetail">
          <div class="newsTitle">
            <div class="newsTitleContent">
              <span :class="getStatusClass(passageDetail.docStatus)" class="status">{{ getStatusText(passageDetail.docStatus) }}</span>
              <span class="passageTitle">{{ passageDetail.title }}</span>
            </div>
            <div class="newsTitleContent1" style="margin-bottom: 5px;font-size: 12px;">
              <span><a :href="passageDetail.url" style="color:#02A7F0;margin-right: 30px;">{{passageDetail.datasourceName}}</a></span>
              <span style="color: #6498BB;">{{ passageDetail.createTime }}</span>
              <el-button type="primary" size="mini" style="float: right;" @click="dropOutPassage()">丢弃</el-button>
            </div>
          </div>
          <div class="newsContent" v-html="passageDetail.content"></div>
        </div>
        <div class="entityDetail">
          <div class="entityTitle">
            <el-button type="primary" style="background-color: #03afb0;">抽取文本</el-button>
            <img src='../../assets/images/u1890.svg' @click="back()" style="width: 30px;height: 30px;float: right;cursor: pointer;"></img>
          </div>
          <div class="addEntity"><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span>添加实例</span></div>
        </div>
    </div>
</template>

<script>
import { annotationFistPage } from "@/api/datalabel/label";
export default {
  props:['params'],
  name: "newsDetail",
  created(){
    console.log(this.params)
    annotationFistPage(this.params).then(res=>{
      this.passageDetail = res.data
    })
  },
  data() {
    return {
        form:{},
        passageDetail:{}
    };
  },
  methods: {
    back(){
      this.$router.back()
    },
    dropOutPassage(){
      this.$confirm('是否丢弃该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
    },
    getStatusClass(status) {
      return {
        'status-1': status === 1,
        'status-2': status === 2,
        'status-3': status === 3,
        'status-4': status === 4,
        'status-5': status === 5,
        'status-6': status === 6,
        'status-7': status === 7,
      };
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '未标注';
        case 2:
          return '已标注';
        case 3:
          return '未通过';
        case 4:
          return '已通过';
        case 5:
          return '已返工';
        case 6:
          return '待审核';
        case 7:
          return '待补充';
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.newListDetailContainer{
  display: flex;
  padding: 30px;
}
.newDetail{
  width: 50%;
  border-radius: 20px;
  border: 1px solid rgba(129,211,248,1);
  height: 84vh;
  background-color: rgba(28,42,57,1);
  padding: 10px;
}
.entityDetail{
  width: 50%;
  margin-left: 50px;
}
.entityTitle{
  padding: 15px 0;
}
.addEntity{
  color: #02a7f0;
  cursor: pointer;
  margin-top: 20px;
}
.newsTitle{
  border-bottom: 1px dashed #6498bb;
}
.newsTitleContent{
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
  width: 100%;
}
.newsTitleContent1{
  height: 30px;
  line-height: 30px;
  .el-button--mini{
    padding: 5px 10px;
    font-size: 10px;
    margin-top: 4px;
  }
}
.passageTitle{
  font-size: 20px;
  color: white;
}
.newsContent{
  color: #CECECE;
  padding: 10px 0;
  height: 70vh;
  overflow-y: scroll;
  font-size: 12px;
}
</style>