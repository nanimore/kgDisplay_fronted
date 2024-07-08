<template>
    <div class="newListDetailContainer">
      <el-dialog :title="isEditEntityName?'添加实例':'编辑实例'" :visible.sync="dialogFormVisible"	:modal="false" v-draggable center :close-on-click-modal="false" width="35%" custom-class="my-dialog">
        <el-dialog
          width="30%"
          title="名称规范示例"
          :visible.sync="innerVisible"
          center
          append-to-body>
          <span style="color: red;">如果要添加的实例名称不在以下规范中，请点击<a style="text-decoration: underline;margin-left: 5px;">新规范</a></span>
          <p>{{ this.regularText }}</p>
        </el-dialog>
            <el-form :model="addEntityForm" ref="addEntityForm" :rules="rules" :label-position="labelPosition" label-width="100px">
                <el-form-item :label="selfdefine?'自定义类型:':'实例类型:'" prop="entityType" v-if="isEditEntityName1">
                  <el-select v-if="!selfdefine" v-model="addEntityForm.entityType" filterable placeholder="请选择实例类型" style="width: 300px;" @change="getEntityNameByEntityTypeFunction()">
                    <el-option
                            v-for="group in addEntityTypeList"
                            :key="group.index"
                            v-if="group.children==null"
                            :label="group.name"
                            :value="group.name"
                        ></el-option>
                        <el-option-group
                            v-for="group in entityTypeList"
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
                  <el-input v-else v-model="addEntityForm.entityType" placeholder="请输入内容" style="width: 300px;"></el-input>
                  <span @click="changeSelfDefine()" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">自定义类型</span>
                </el-form-item>
                <el-form-item label="实例类型:" v-else style="color: white;">
                  {{ nowlabelEntityType }}
                </el-form-item>
                <el-form-item label="实例名称:" prop="entityName">
                    <el-select v-model="addEntityForm.entityName" allow-create filterable placeholder="请选择实例名称" style="width: 300px;">
                        <el-option v-for="item in entityNameList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span @click="getNameRegualation()" v-show="!selfdefine" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">名称规范示例</span>
                </el-form-item>
                <el-form-item label="文本:" prop="text" style="margin-bottom: 0;">
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
        <div class="entityDetail" v-if="isDetail">
          <div class="entityTitle">
            <el-button type="primary" style="background-color: #03afb0;" v-loading.fullscreen.lock="fullscreenLoading" @click="extractText()" >抽取文本</el-button>
            <img src='../../assets/images/u1890.svg' @click="back()" style="width: 30px;height: 30px;float: right;cursor: pointer;"></img>
          </div>
          <div class="addEntity" @click="addEntity('addEntityForm')"><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span>添加实例</span></div>
          <div class="entityListContainer">
            <ul class="entityList" >
              <li v-for="item in extractData" :key="item.id">
                <span class="entityListLeftContainer">
                  <span>{{ item.entityName }}</span>
                  <span class="entityListLabel" v-if="item.isSaveProp">已经保存属性</span>
                  <span class="entityListLabel" v-if="item.isSaveRel">已经保存关系</span>
                  <span style="color: #95F204;" v-if="item.isCustomNorm">新规范</span>
                  <span style="color:#D9001B;" v-for="data in item.extractOrigin" @click="aliasFindHighLight()">{{ data }}</span>
                </span>
                <span class="entityListRightContainer" v-if="item.isCustomOntoType">
                  <span style="color: #F59A23;">[ 自定义类型 ]</span>
                  <span style="color: white;border-radius: 15px;padding:0 6px;background-color:#bfbf00;">{{ item.entityType }}</span>
                  <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity(item)">
                </span>
                <span class="entityListRightContainer" v-else>
                  <span style="color: #02A7F0;" :class="{ 'text-with-star': item.propontoModify }" @click="enterProp(item)">实例属性</span>
                  <span style="color: #00bfbf;" :class="{ 'text-with-star': item.relontoModify }" @click="enterRel(item)">实例关系</span>
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
        <div class="entityDetail" v-else>
          <div class="entityDetailInnerTitle">
            <span class="entityLabel">实例名称: <span style="color: white;font-weight: 500">{{ nowlabelEntityName }}</span></span>
            <span class="entityLabel">实例类型: <span style="color: white;font-weight: 500;">{{ nowlabelEntityType}}</span></span>
            <el-button type="primary" size="mini" @click="isEditEntityName()">修改实例名称/文本</el-button>
            <span style="float: right;display: flex;align-items: center;margin-top: 3px;">
              <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity()" style="width:20px;height: 20px;cursor: pointer;margin-right: 10px;">
              <img src='../../assets/images/u1890.svg' @click="isDetail = true" style="width:20px;height: 20px;cursor: pointer;"></img>
            </span>
          </div>
          <el-tabs class="entityDetailInnerContent" style="margin-top: 10px;color: #02A7F0;">
            <el-tab-pane label="实例属性">
              <div class="addSelfProp" @click="addSelfProp()" ><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span style="cursor: pointer;">自定义属性</span></div>
              <div v-if="formVisible">
                <el-form :model="selfDefinePropForm" class="selfDefinePropForm" label-width="60px">
                  <el-form-item :label="item.label" v-for="item in selfDefinePropForm.items" :key="item.label">
                    <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getSelectedText(item.id)">
                    <el-input v-model="item.value" style="margin-right: 20px;"></el-input>
                    <span v-if="item.id==0">
                      <el-button type="primary" size="mini"  style="background-color: #00BFBF;text-align: center;margin-right: 20px;">添加别名</el-button>
                      <span class="selfDefinePropFormSpan"  @click="removeForm()">暂存</span>
                      <span class="selfDefinePropFormSpan" @click="removeForm()">取消</span>
                      <span class="selfDefinePropFormSpan" @click="removeForm()">清除</span>
                    </span>
                  </el-form-item>
                </el-form>
              </div>
              <el-form :model="propForm" ref="propForm" label-width="100px">  
                <el-form-item  
                  v-for="(item, index) in formItems"  
                  :key="index"  
                  :label="item.name"  
                  :prop="item.engName"  
                >  
                  <el-input v-model="form[item.engName]" style="width: 250px;"></el-input>  
                  <!-- 这里可以根据需要添加其他类型的表单组件，如密码框、邮箱框等 -->  
                </el-form-item>  
                <el-form-item>  
                  <el-button type="primary" @click="submitForm('propForm')">保存全部属性</el-button>  
                </el-form-item>  
              </el-form> 
            </el-tab-pane>
            <el-tab-pane label="实例关系">
              <el-form :model="relform" ref="relform" label-width="120px">  
                <el-form-item  
                  v-for="(item, index) in RelformItems"  
                  :key="index"  
                  :label="item.label"  
                  :prop="item.prop"  
                >  
                  <el-input  
                    v-if="!item.isEditing"  
                    v-model="relform[item.prop]"  
                    @focus="startEditing(index)"  
                    placeholder="点击编辑"  
                  ></el-input>  
                  <span v-else>{{ relform[item.prop] }}</span>  
                  <el-button  
                    type="text"  
                    icon="el-icon-edit"  
                    @click="startEditing(index)"  
                    v-if="!item.isEditing"  
                  >编辑</el-button>  
                  <el-button  
                    type="text"  
                    icon="el-icon-check"  
                    @click="saveAndHide(index)"  
                    v-if="item.isEditing"  
                  >保存</el-button>  
                </el-form-item>  
              </el-form>  
            </el-tab-pane>
          </el-tabs>
        </div>

    </div>
</template>

<script>
import { annotationFistPage,getEntityList,discard,getEntityNameByEntityType,deleteEntity,getPropList,chineseAnnotation,getAllLeafEntityTypes } from "@/api/datalabel/label";
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
    this.getEntityListFunction()
    this.getAllEntityType()
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
        addEntityTypeList:[],
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
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
      chineseAnnotation(this.passageDetail).then(res=>{
        this.passageDetail = res.data
        this.highlightText()
        this.getEntityListFunction()
        this.fullscreenLoading = false;
      })
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
      getAllLeafEntityTypes().then(res=>{
        this.addEntityTypeList = res.data
      })
    },
    startEditing(index) {  
      this.RelformItems[index].isEditing = true;  
    },  
    saveAndHide(index) {  
      this.RelformItems[index].isEditing = false;  
 
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
  max-height: 60vh;
  overflow-y: auto;
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
  font-size: 14px;
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