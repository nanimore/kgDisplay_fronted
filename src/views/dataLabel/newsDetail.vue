<template>
    <div class="newListDetailContainer">
      <el-dialog title="添加实例" :visible.sync="dialogFormVisible"	:modal="false" v-draggable center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="addEntityForm" ref="addEntityForm" :rules="rules" :label-position="labelPosition"  label-width="100px">
                <el-form-item :label="selfdefine?'自定义类型：':'实例类型：'" prop="entityType">
                  <el-select v-if="!selfdefine" v-model="addEntityForm.entityType" filterable placeholder="请选择实例类型" style="width: 300px;">
                      <el-option label="中文" value="Chinese"></el-option>
                      <el-option label="英文" value="English"></el-option>
                      <el-option label="日文" value="Japanese"></el-option>
                      <el-option label="韩文" value="Korean"></el-option>
                      <el-option label="俄文" value="Russian"></el-option>
                  </el-select>

                  <el-input v-else v-model="addEntityForm.entityType" placeholder="请输入内容" style="width: 300px;"></el-input>

                  <span @click="changeSelfDefine()" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">自定义类型</span>
                </el-form-item>
                <el-form-item label="实例名称：" prop="entityName">
                    <el-select v-model="addEntityForm.entityName" filterable placeholder="请选择实例名称" style="width: 300px;">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                    <span @click="getNameRegualation()" v-show="!selfdefine" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">名称规范示例</span>
                </el-form-item>
                <el-form-item label="文本：" prop="text" style="margin-bottom: 0;">
                    <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;" >
                    <el-input v-model="addEntityForm.text" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('form')" style="background-color: rgba(0,191,191,1);">立即提交</el-button>
            </div>
        </el-dialog>
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
          <div class="addEntity" @click="addEntity()"><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span>添加实例</span></div>
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
        passageDetail:{
          content:'词向量'
        },
        dialogFormVisible:false,
        selfdefine:false,
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
        labelPosition:'right',
        rules: {
          entityType: [
            { required: true, message: '请选择实例类型'},
          ],
          entityName: [
            { required: true, message: '请选择实例名称'},
          ],
          text: [
            { required: true, message: '请输入文本'},
          ],
        },
    };
  },
  methods: {
    back(){
      this.$router.back()
    },
    addEntity(){
      this.dialogFormVisible = true
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
    },
    changeSelfDefine(){
      this.addEntityForm.entityType = '';
      this.selfdefine = !this.selfdefine
    },
    getNameRegualation(){

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
::v-deep .el-dialog{
  .el-form-item__label{
    color: #00FFFF;
    font-weight: 500;
  }
}
::v-deep .el-dialog__wrapper {
  pointer-events: none; /* 使el-dialog__wrapper不拦截鼠标事件 */
}
::v-deep .el-dialog {
  pointer-events: all; /* 确保el-dialog内部可以交互 */
}
</style>