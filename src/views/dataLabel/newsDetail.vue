<template>
    <div class="newListDetailContainer">
      <el-dialog title="添加实例" :visible.sync="dialogFormVisible"	:modal="false" v-draggable center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
        <el-dialog
          width="30%"
          title="名称规范示例"
          :visible.sync="innerVisible"
          center
          append-to-body>
          <span style="color: red;">如果要添加的实例名称不在以下规范中，请点击<a style="text-decoration: underline;margin-left: 5px;">新规范</a></span>
          <p>{{ this.regularText }}</p>
        </el-dialog>
            <el-form :model="addEntityForm" ref="addEntityForm" :rules="rules" :label-position="labelPosition"  label-width="100px">
                <el-form-item :label="selfdefine?'自定义类型':'实例类型'" prop="entityType">
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
                <el-form-item label="实例名称" prop="entityName">
                    <el-select v-model="addEntityForm.entityName" filterable placeholder="请选择实例名称" style="width: 300px;">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                    <span @click="getNameRegualation()" v-show="!selfdefine" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">名称规范示例</span>
                </el-form-item>
                <el-form-item label="文本" prop="text" style="margin-bottom: 0;">
                    <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelecting()">
                    <el-input v-model="addEntityForm.text" style="width: 275px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('addEntityForm')" style="background-color: rgba(0,191,191,1);">立即提交</el-button>
            </div>
        </el-dialog>
        <div class="newDetail">
          <div class="newsTitle">
            <div class="newsTitleContent">
              <span :class="getStatusClass(passageDetail.docStatus)" class="status">{{ getStatusText(passageDetail.docStatus) }}</span>
              <span class="passageTitle">{{ passageDetail.title }}</span>
            </div>
            <div class="newsTitleContent1" style="margin-bottom: 5px;font-size: 12px;height: 35px;line-height: 35px;">
              <span><a :href="passageDetail.url" style="color:#02A7F0;margin-right: 30px;">{{passageDetail.datasourceName}}</a></span>
              <span style="color: #6498BB;">{{ passageDetail.createTime }}</span>
              <span class="newsTitleContentright">
                <el-input v-model="searchQuery" @input="highlightText" placeholder="" style="width: 150px;" prefix-icon="el-icon-search"></el-input>  
                <el-button type="primary" size="mini" @click="dropOutPassage()" style="margin-left: 30px;">丢弃</el-button>
              </span>
            </div>
          </div>
          <div class="newsContent" v-html="highlightedContent"></div>
        </div>
        <div class="entityDetail">
          <div class="entityTitle">
            <el-button type="primary" style="background-color: #03afb0;" v-loading.fullscreen.lock="fullscreenLoading" @click="extractText()" >抽取文本</el-button>
            <img src='../../assets/images/u1890.svg' @click="back()" style="width: 30px;height: 30px;float: right;cursor: pointer;"></img>
          </div>
          <div class="addEntity" @click="addEntity()"><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span>添加实例</span></div>
          <div class="entityListContainer">
            <ul class="entityList" >
              <!-- <li><span class="entityListLeftContainer"><span>亚特兰大级巡洋舰</span><span class="entityListLabel">已经保存属性</span><span class="entityListLabel">已经保存关系</span><span style="color:#D9001B;">别名</span></span><span class="entityListRightContainer"><span style="color: #02A7F0;">实例属性</span><span style="color: #00bfbf;">实例关系</span><img src="../../assets/images/u1782.svg" alt=""></span></li> -->
              <!-- <li>CL51亚特兰大号巡洋舰<span class="entityListRightContainer"><span>实例属性</span><span style="color: #00bfbf;">实例关系</span><img src="../../assets/images/u1782.svg" alt=""></span></li> -->

              <li v-for="item in extractData" :key="item.id">
                <span class="entityListLeftContainer">
                  <span>{{ item.entityName }}</span>
                  <span class="entityListLabel" v-if="item.isProperty">已经保存属性</span>
                  <span class="entityListLabel" v-if="item.isRelation">已经保存关系</span>
                  <span style="color: #95F204;" v-if="item.isNew">新规范</span>
                  <span style="color:#D9001B;">{{ item.alias }}</span>
                </span>
                <span class="entityListRightContainer" v-if="item.isSelfDefined">
                  <span style="color: #02A7F0;">[ 自定义类型 ]</span>
                  <span style="color: #00bfbf;">{{ item.entityType }}</span>
                  <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity(item)">
                </span>
                <span class="entityListRightContainer" v-else>
                  <span style="color: #02A7F0;">实例属性</span>
                  <span style="color: #00bfbf;">实例关系</span>
                  <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity(item)">
                </span>
              </li>
            </ul>
          </div>
          <div class="entityDetailFooter" v-if="extractData && extractData.length > 0">
            <el-button type="primary" style="background-color: #03afb0;margin-right: 30px;"  @click="submitReview()" >提交审核</el-button>
            <el-button type="primary"  @click="back()" >返回</el-button>
          </div>
        </div>
    </div>
</template>

<script>
import { annotationFistPage,getEntityList } from "@/api/datalabel/label";
export default {
  props:['params'],
  name: "newsDetail",
  created(){
    let annotationFistPageParams = {
      docId:this.params.articleId,
      docPhase:this.params.docPhase,
      docType:this.params.docType
    }
    annotationFistPage(annotationFistPageParams).then(res=>{
      this.passageDetail = res.data
      this.highlightText()
    })
    this.getEntityListFunction()
  },
  data() {
    return {
        extractData:[],
        fullscreenLoading: false,
        form:{},
        passageDetail:{},
        dialogFormVisible:false,
        selfdefine:false,
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
        searchQuery: '',   
        highlightedContent: '',  
        regularText:'规范1',
        innerVisible:false,
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
    extractText(){
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.extractData = this.entityListData
      }, 2000);
    },
    dropEntity(item){
      this.$confirm('是否删除该实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(item.id)
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          
        });
    },
    back(){
      this.$router.back()
    },
    getEntityListFunction(){
      let getEntityListParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType
      }
      getEntityList(getEntityListParams).then(res => {
        this.extractData = res.data
      })
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
    startSelecting() {
      document.addEventListener('mouseup', this.handleTextSelection);
    },
    handleTextSelection() {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        this.addEntityForm.text += selectedText + ' ';
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelection);
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('添加成功!');
            this.resetForm(formName)
            this.dialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
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
    highlightText() {  
      if (!this.searchQuery) {  
        // 如果没有搜索内容，则显示原始文本  
        this.highlightedContent = this.passageDetail.content;
        return;  
      }  
      // 使用正则表达式替换匹配的文本  
      const regex = new RegExp(this.searchQuery, 'gi');  
      this.highlightedContent = this.passageDetail.content.replace(regex, '<span class="highlight">$&</span>');  
    },  
    changeSelfDefine(){
      this.addEntityForm.entityType = '';
      this.selfdefine = !this.selfdefine
    },
    getNameRegualation(){
      if(this.addEntityForm.entityType==''){
        this.$message.error('请先选择实例类型！')
         return false
      }
      this.innerVisible =true
    }
  },
  computed: {
    
  },
};
</script>

<style lang="scss" scoped>
.entityListContainer{
  margin-top: 20px;
}
.entityList{
  color: #CECECE;
  list-style-type: none;
  padding-left: 0;
  font-size: 12px;
  li{
    border-bottom: 1px solid #cecece;
    padding-bottom: 5px;
    margin-bottom: 30px;
    .entityListRightContainer{
      float:right;
      display: flex;
      align-items: center; 
      span{
        margin-right: 10px;
        cursor: pointer;
      }
      img {
        cursor: pointer;
      }
    }
  }
}
.entityListLeftContainer span{
  margin-right: 10px;
}
.entityListLabel{
  color:#D9001B;
  border: 1px solid #D9001B;;
  border-radius: 15px;
  padding: 2px 5px;
}

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
  margin-top: 10px;
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
  .newsTitleContentright{
    display: flex;
    align-items: center;
    float: right;
    .el-button--mini{
      padding: 5px 10px;
      font-size: 10px;
    }
  }
}
.passageTitle{
  font-size: 20px;
  color: white;
}
.newsContent{
  color: #CECECE;
  padding: 10px 0;
  height:71vh;
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
  top: 15%;
}
::v-deep .highlight {  
  background-color: yellow;  
  color: black;
}
::v-deep .highlight {  
  background-color: yellow;  
}
::v-deep  .el-input__inner {
  height: 30px;
}
.entityDetailFooter{
  text-align: center;
}
</style>