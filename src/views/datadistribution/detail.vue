<template>
    <div class="newListDetailContainer">
        <div class="newDetail">
          <div class="newsTitle">
            <div class="newsTitleContent">
              <span :class="getStatusClass(passageDetail.docStatus)" class="status">{{ getStatusText(passageDetail.docStatus) }}</span>
              <span class="passageTitle">{{ passageDetail.title }}</span>
              <el-select v-model="dataType" placeholder="请选择" style="width: 150px;margin-left: 30px;">
                  <el-option
                      v-for="group in initDocCategory"
                      :key="group.index"
                      v-if="group.children==null"
                      :label="group.name"
                      :value="group.name"
                  ></el-option>
                  <el-option-group
                      v-for="group in initDocCategory"
                      :key="group.name"
                      v-if="group.children"
                      :label="group.name"
                  >
                      <el-option
                      v-for="item in group.children"
                      :key="item"
                      :label="item"
                      :value="item"
                      ></el-option>
                  </el-option-group>
              </el-select>
              <el-button type="primary" @click="changeDataType()" size="mini" style="margin-left: 20px;">修改数据类型</el-button>
            </div>
            <div class="newsTitleContent1" style="margin-bottom: 5px;font-size: 12px;height: 35px;line-height: 35px;">
              <span><a :href="passageDetail.url" style="color:#02A7F0;margin-right: 30px;">{{passageDetail.datasourceName}}</a></span>
              <span style="color: #6498BB;margin-right: 20px;">数据分类：{{ params.dataType }}</span>
              <span style="color: #6498BB;">采集时间：{{ passageDetail.createTime }}</span>
              <span style="color: #6498BB;">发布时间{{ passageDetail.publishTime }}</span>
              <img src="../../assets/images/u1782.svg" alt="" @click="deleteArticle()" style="width:15px;height: 15px;cursor: pointer;margin-left: 20px;">
              <span class="newsTitleContentright">
                <img src='../../assets/images/u1890.svg' @click="back()" style="width: 30px;height: 30px;float: right;cursor: pointer;"></img>
              </span>
            </div>
          </div>
          <div class="newsContent" v-html="highlightedContent"></div>
        </div>
    </div>
</template>

<script>
import { annotationFistPage,getEntityList,discard,getEntityNameByEntityType,deleteEntity,getPropList,deleteArticle,getInitDocCategory,updateDataType } from "@/api/datalabel/label";
import { getAllEntityType } from "@/api/index";
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
    let params ={
        pageStatus:2
    }
    getInitDocCategory(params).then(res=>{
        this.initDocCategory = res.data
    })
    this.dataType = this.params.dataType
  },
  data() {
    return {
        extractData:[],
        fullscreenLoading: false,
        form:{},
        formItems:[],
        propForm:{},
        isDetail:true,
        passageDetail:{},
        dialogFormVisible:false,
        selfdefine:false,
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
        initDocCategory:[],
        dataType:'',
        relform: {}, // 用于存储表单数据的对象  
        RelformItems: [ // 假设这是从接口获取的表单结构  
          { label: '用户名', prop: 'username', isEditing: false },  
          { label: '密码', prop: 'password', isEditing: false },  
          // ... 其他字段  
        ],  
        entityNameList:[],
        entityTypeList:[],
        formVisible:false,
        isEditEntityName1:true,
        searchQuery: '',   
        highlightedContent: '',  
        regularText:'规范1',
        innerVisible:false,
        labelPosition:'right',
        nowlabelEntityName:'',
        nowlabelEntityType:'',
        selfDefinePropForm:{
          items: [
          { id:0,label: '属性名', value: '' },
          { id:1,label: '属性值', value: '' },
          { id:2,label: '单位', value: '' },
          { id:3,label: '备注', value: '' },
          { id:4,label: '文本', value: '' },
        ]
        },
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
    addSelfProp(){
      this.formVisible = true;
    },
    removeForm() {
      this.formVisible = false;
    },
    getAllEntityType(){
      getAllEntityType().then(res=>{
        this.entityTypeList = res.data
      })
    },
    startEditing(index) {  
      this.RelformItems[index].isEditing = true;  
    },  
    saveAndHide(index) {  
      this.RelformItems[index].isEditing = false;  
 
    },
    changeDataType(){
        let params={
                docId: this.params.articleId,
                docStatus: this.params.docStatus,
                docType: this.params.docType,
                uuid: this.params.articleId,
                dataType:this.dataType

        }
        updateDataType(params).then(res=>{
            if(res.code==200){
                this.$message.success('修改实例类型成功！')
                this.params.dataType = this.dataType
            }
        })
    },
    dropEntity(item){
      let deleteEntityParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:item.uuid
      }
      this.$confirm('是否删除该实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteEntity(deleteEntityParams).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.isDetail = true;
              this.getEntityListFunction()
            }
          })
        });
    },
    back(){
      sessionStorage.setItem('fromDetail', true);
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
    addEntity(formName){
      this.isEditEntityName1 = true
      delete this.addEntityForm.entityName
      delete this.addEntityForm.entityType
      this.entityNameList =[]
      this.dialogFormVisible = true
    },
    dropOutPassage(){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType
      }
      this.$confirm('是否丢弃该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          discard(params).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            setTimeout(() => {
              this.back()
            }, 1000);
          })
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
    enterProp(item){
      this.isDetail = false
      this.nowlabelEntityName = item.entityName
      this.nowlabelEntityType = item.entityType
      this.getEntityNameByEntityTypeFunction()
      this.getPropListFunction(item.uuid)
    },
    getPropListFunction(id){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id
      }
      getPropList(params).then(res=>{
        this.formItems = res.data
      })
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
    getEntityNameByEntityTypeFunction(){
      let params
      if(this.addEntityForm.entityType){
        params= {
          entityType:this.addEntityForm.entityType
        }
      }else{
        params= {
          entityType:this.nowlabelEntityType
        }
      }
      getEntityNameByEntityType(params).then(res=>{
        this.entityNameList = res.data
      })
    },
    getStatusClass(status) {
      return {
        'status-8': status === 0,
        'status-9': status === 1,
      };
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return '未分配';
        case 1:
          return '已分配';
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
      if(this.addEntityForm.entityType==''&&this.nowlabelEntityType==''){
        this.$message.error('请先选择实例类型！')
         return false
      }
      this.innerVisible =true
    },
    aliasFindHighLight(data){
      this.searchQuery = data
      this.highlightText()
    },
    isEditEntityName(){
      // getEntityNameByEntityType
      this.isEditEntityName1 = false
      this.addEntityForm.entityName = this.nowlabelEntityName
      this.dialogFormVisible =true
    },
    getSelectedText(index) {
      let selectedText = '';
      if (window.getSelection) {
        selectedText = window.getSelection().toString();
      } else if (document.selection && document.selection.type !== "Control") {
        selectedText = document.selection.createRange().text;
      }
      this.$set(this.selfDefinePropForm.items, index, {
        ...this.selfDefinePropForm.items[index],
        value: selectedText
      });
    },
    back(){
      sessionStorage.setItem('fromDetail', true);
      this.$router.back()
    },
    deleteArticle(){
        let deleteParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:this.params.articleId
      }
      this.$confirm('是否删除该新闻?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteArticle(deleteParams).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              setTimeout(() => {
              this.back()
            }, 1000);
            }
          })
        });
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
  padding: 30px;
}
.newDetail{
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
.text-with-star {
    position: relative;
    display: inline-block;
}

.text-with-star::after {
    content: '★'; /* 星星符号 */
    color: red; /* 红色 */
    font-size: 7px; /* 调整星星的大小 */
    position: absolute;
    top: -5px; /* 调整星星的位置 */
    right: -5px; /* 调整星星的位置 */
}
.entityDetailInnerTitle{
  color: #02A7F0;
  font-weight: 700;
  border-top-left-radius: 15px;
  .entityLabel{
    margin-right: 15px;
  }
  margin-top: 15px;
}
::v-deep .el-tabs__nav{
  width: 100%;
  color: black;
}
::v-deep .el-tabs__item.is-active{
  background-color: #02A7F0;
  color: white;
  font-weight: 700;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
    background-color: #02A7F0;
    color: white;
    font-weight: 700;
}
::v-deep .el-tabs__item{
  width: 50%;
  text-align: center;
  font-size: 16px;
  background-color: rgba(195,195,197,1);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
::v-deep .el-tabs__active-bar{
  display: none;
}
::v-deep .selfDefinePropForm {
  .el-input{
    display: inline-block;
    width: 180px;
  }
  .selfDefinePropFormSpan{
    margin-right: 15px;
    cursor: pointer;
  }
}
::v-deep .el-tabs__content{
  height: 70vh;
  overflow-y: scroll;
}
</style>