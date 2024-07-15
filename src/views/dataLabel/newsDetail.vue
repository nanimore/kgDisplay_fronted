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
                  <el-select v-if="!selfdefine" v-model="addEntityForm.entityType" filterable placeholder="请选择实例类型" style="width: 300px;">
                    <el-option
                            v-for="group in addEntityTypeList"
                            :key="group.index"
                            v-if="group.children==null"
                            :label="group.name"
                            :value="group.name"
                        ></el-option>
                        <el-option-group
                            v-for="group in addEntityTypeList"
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
                    <el-select v-model="addEntityForm.entityName" allow-create filterable remote :remote-method="remoteMethod" placeholder="请选择实例名称" style="width: 300px;">
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
              <img src='../../assets/images/u1890.svg' @click="backToEntityList()" style="width:20px;height: 20px;cursor: pointer;"></img>
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
              <div class="addRelClass">
                <span class="addRelClassContainer" @click="addEntity('addEntityForm')"><img src="../../assets/images/u3832.svg" class="addClass">添加实例</span>
                <span class="addRelClassContainer" @click="addrelForm()" style="margin-left: 20px;"><img src="../../assets/images/u3832.svg" class="addClass">添加关系</span>
              </div>
              <div v-for="(form, index) in relforms" :key="form.id" style="border-bottom: 1px solid #aaaaaa;">
                  <div v-if="form.editing">
                    <el-form :model="form" label-width="90px" ref="form" class="relform">
                      <el-row>
                        <el-col :span="14" >
                          <el-form-item label="头实例名称">
                            <span v-if="form.isChangeSort" style="color: #FFFF00;">{{ nowlabelEntityName }}</span>
                            <el-select v-else v-model="form.entityName1" allow-create filterable remote :remote-method="remoteMethodEntityList" placeholder="请选择实例名称" style="width: 100%;" @change="nowremoteIndex = index">
                                <el-option v-for="item in form.entityNameListbyRel" :key="item" :label="item" :value="item"></el-option>
                            </el-select>  
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <el-input v-model="form.entity1num" style="width: 100px;"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="自定义关系" v-if="form.isSelfDefinedRel">
                            <el-input v-model="form.relation" style="width:  100%;"></el-input>
                          </el-form-item>
                          <el-form-item label="关系名称" v-else>
                            <el-select v-model="form.relation" filterable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in relNameList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>   
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <div v-if="form.isSelfDefinedRel" style="color:#F59A23;font-weight: 700;margin-top: 7px;margin-left: 15px;cursor: pointer;font-size: 14px;" @click="cancelChangeRelType(index)" >取消</div>
                          <div v-else style="color:#F59A23;font-weight: 700;margin-top: 7px;margin-left: 15px;cursor: pointer;font-size: 14px;" @click="changeRelType(index)" >自定义关系</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="尾实例名称">
                            <el-select v-if="form.isChangeSort" v-model="form.entityName1" remote :remote-method="remoteMethodEntityList" allow-create filterable placeholder="请选择实例名称" style="width: 100%;" @change="nowremoteIndex = index">
                                <el-option v-for="item in form.entityNameListbyRel" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                            <span v-else style="color: #FFFF00;">{{ nowlabelEntityName }}</span>                  
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <el-input v-model="form.entity2num" style="width: 100px;"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="备注" class="teshu">
                            <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelectingRelNote(index)">
                            <el-input v-model="form.note" style="width: 90%;"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="文本" class="teshu">
                            <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelectingRelText(index)">
                            <el-input v-model="form.text" style="width: 90%"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <div>
                            <span v-if="form.editing" style="color: red;cursor: pointer;margin-left: 15px;" @click="clearRelform(index)">清除</span>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="editrelForm(index)" v-if="!form.editing">编辑</el-button>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="saveForm(index)" v-if="form.editing">暂存</el-button>
                            <el-button type="primary" style="background-color: #aaaaaa;margin-right: 10px;margin-left: 15px;" @click="form.editing = !form.editing" v-if="form.editing">取消</el-button>
                            <el-button type="danger" style="margin-right: 10px;margin-left: 15px;"  v-if="!form.editing">删除</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                  <div v-else>
                    <el-form :model="form">
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="头实例名称">
                            <div v-if="form.isChangeSort" style="color: #FFFF00;">{{ nowlabelEntityName }}</div>
                            <div v-else style="color: #FFFF00;"> {{ form.entityName1 }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <div style="color: #FFFF00;"> {{ form.entity1num }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="尾实例名称">
                            <div v-if="form.isChangeSort" style="color: #FFFF00;"> {{ form.entityName1 }}</div>
                            <div v-else style="color: #FFFF00;">{{ nowlabelEntityName }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <div style="color: #FFFF00;"> {{ form.entity2num }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="关系名称">
                            <div style="color: #FFFF00;"> {{ form.relation }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="文本" class="teshu">
                            <div style="color: #FFFF00;"> {{ form.text }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <div>
                            <span v-if="form.isAbstact&&form.isqueding" style="color: red;cursor: pointer;margin-left: 15px;">确定</span>
                            <span v-if="form.isAbstact&&!form.isqueding" style="color: red;cursor: pointer;margin-left: 15px;">取消</span>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="editrelForm(index)" v-if="!form.editing">编辑</el-button>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="saveForm(index)" v-if="form.editing">暂存</el-button>
                            <el-button type="primary" style="background-color: #aaaaaa;margin-right: 10px;margin-left: 15px;" @click="form.editing = !form.editing" v-if="form.editing">取消</el-button>
                            <el-button type="danger" style="margin-right: 10px;margin-left: 15px;"  v-if="!form.editing">删除</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

    </div>
</template>

<script>
import { annotationFistPage,getEntityList,getRelList,discard,saveTriplets,getEntityNameByEntityType,deleteEntity,getPropList,chineseAnnotation,getAllLeafEntityTypes,similarInstanceNames,addInstance,getRelationByEntityType,getEntityByRelation } from "@/api/datalabel/label";
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
        relforms:[],
        nowremoteIndex:0,
        isDetail:true,
        passageDetail:{},
        dialogFormVisible:false,
        selfdefine:false,
        addEntityTypeList:[],
        relNameList:[],
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
        nowEditEntityId:'',
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
        nowhuaciIndex:'',
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
    addrelForm() {
      this.relforms.push({
        id: Date.now(),
        entityName1: '',
        relation: '',
        text:'',
        note:'',
        editing: true,
        entity2num:0,
        entity1num:0,
        isSelfDefinedRel:false,
        isAbstact:false,
        isqueding:true,
        entityNameListbyRel:[],
        isChangeSort:true,
      });
    },
    saveForm(index) {
      // 假设这里有一个API接口保存表单数据
      // axios.post('/api/forms', form).then(() => {
      //   this.$set(this.forms, index, { ...form, editing: false });
      // });
      if(this.relforms[index].entityName1==''||this.relforms[index].relation==''||this.relforms[index].text==''){
        this.$message.error("关系名称、尾实例名称、文本不能为空！")
        return false
      }
      let params ={
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:[{
          comment:this.relforms[index].note,
          object:this.relforms[index].entityName1,
          objectAmount:this.relforms[index].entity1num,
          predicate:this.relforms[index].relation,
          predicateType:2,
          isEnsure:0,
          status:2,
          subjectAmount:this.relforms[index].entity2num,
          subject:this.nowlabelEntityName,
          tripleText:this.relforms[index].text
          }
        ]
      }
      saveTriplets(params).then(res=>{
      })
      this.$set(this.relforms, index, { ...this.relforms[index], editing: false });
    },
    editrelForm(index) {
      this.$set(this.relforms, index, { ...this.relforms[index], editing: true });
    },
    clearRelform(index){
      this.$set(this.relforms, index, { ...this.relforms[index], text: '', relation: '',note:'',entityName1:'',entity1num:0,entity2num:0 });
    },
    changeRelType(index){
      this.$set(this.relforms, index, { ...this.relforms[index], relation: '' });
      this.$set(this.relforms, index, { ...this.relforms[index], isSelfDefinedRel: true });
    },
    cancelChangeRelType(index){
      this.$set(this.relforms, index, { ...this.relforms[index], relation: '' });
      this.$set(this.relforms, index, { ...this.relforms[index], isSelfDefinedRel: false });
    },
    dropEntity(item){
      let id 
      if(this.nowEditEntityId){
        id = this.nowEditEntityId
      }else{
        id = item.uuid
      }
      let deleteEntityParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id
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
    startSelectingRelNote(index){
      this.nowhuaciIndex = index
      document.addEventListener('mouseup', this.handleTextSelectionRelNote);
    },
    handleTextSelectionRelNote(){
      const selectedText = window.getSelection().toString();
      console.log(selectedText)
      if (selectedText) {
        this.$set(this.relforms, this.nowhuaciIndex, { ...this.relforms[this.nowhuaciIndex], note: selectedText + ' ' });
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionRelNote);
    },
    startSelectingRelText(index){
      this.nowhuaciIndex = index
      document.addEventListener('mouseup', this.handleTextSelectionRelText);
    },
    handleTextSelectionRelText(){
      const selectedText = window.getSelection().toString();
      console.log(selectedText)
      if (selectedText) {
        this.$set(this.relforms, this.nowhuaciIndex, { ...this.relforms[this.nowhuaciIndex], text: selectedText + ' ' });
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionRelText);
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
    remoteMethodEntityList(query){
      let params = {
          entityType:this.nowlabelEntityType,
          relation:this.relforms[this.nowremoteIndex].relation,
          text: query
        }
        if (query !== '') {
          setTimeout(() => {
            getEntityByRelation(params).then(res=>{
              this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], entityNameListbyRel: res.data.entityList });
              if(res.data.entityLocation == 0){
                this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], isChangeSort: true });
              }else{
                this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], isChangeSort: false });
              }
            })
          }, 200);
        } else {
          this.$set(this.relforms, index, { ...this.relforms[index], entityNameListbyRel: [] });;
        }
    },
    enterProp(item){
      this.isDetail = false
      this.nowlabelEntityName = item.entityName
      this.nowlabelEntityType = item.entityType
      this.getEntityNameByEntityTypeFunction()
      this.getRelationByEntityTypeFunction()
      this.getPropListFunction(item.uuid)
      this.getRelListFunction(item.uuid)
      this.nowEditEntityId = item.uuid
    },
    getRelationByEntityTypeFunction(){
      let params = {
        entityType:this.nowlabelEntityType
      }
      getRelationByEntityType(params).then(res=>{
        this.relNameList = res.data
      })
    },
    getRelListFunction(id){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id,
        dataType:this.nowlabelEntityType
      }
      getRelList(params).then(res=>{
        console.log(res.data)
      })
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
            let params = {
              Verify:{
                tripleText:this.addEntityForm.text,
                subject:this.addEntityForm.entityName,
                object:this.addEntityForm.entityType
              },
              EquipOrSplitReq:{
                id:this.passageDetail.id,
                dataType:this.passageDetail.dataType
              }
            }
            addInstance(params).then(res => {
              if(res.code == 200){
                this.$message.success('添加成功!');
                this.dialogFormVisible = false;
                this.resetForm(formName)
                this.getEntityListFunction()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    remoteMethod(query) {
        let params = {
          subject: query
        }
        if (query !== '') {
          setTimeout(() => {
            similarInstanceNames(params).then(res=>{
              this.entityNameList = res.data
            })
          }, 200);
        } else {
          this.entityNameList = [];
        }
    },
    getEntityNameByEntityTypeFunction(){
      let params = {
          entityType:this.nowlabelEntityType
        
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
    backToEntityList(){
      this.isDetail = true
      this.getEntityListFunction()
      this.nowEditEntityId = ''
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
.addRelClass{
  color: white;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  height: 20px;
  line-height: 20px;
}
.addRelClassContainer{
  display:flex;
  cursor: pointer;
}
.addClass{
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
::v-deep .el-form-item__label{
    color: #02A7F0;
}
::v-deep .teshu{
  .el-form-item__label{
    color: white !important;
    width: 70px !important;
  }
  .el-form-item__content{
    margin-left: 70px !important
  }
}
</style>