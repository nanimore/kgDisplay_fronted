<template>
    <div class="app-container">
        <el-dialog
            title="编辑概念"
            :visible.sync="dialogVisibleEditBt"
            width="30%"
            center
            :modal="false" 
            v-draggable
            :close-on-click-modal="false"
            custom-class="viewDialog">
            <el-form :model="formInline" class="demo-form-inline" ref="formInline" label-width="80px">
                <el-form-item label="父概念" prop="fatherGn">
                    <el-select v-model="formInline.fatherGn" style="width: 300px;">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="概念名称" prop="GnName">
                    <el-input v-model="formInline.GnName" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="submitForm('formInline')">确定</el-button>
                <el-button @click="resetForm('formInline')">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :title="isAddSonName?'添加概念':'添加子概念'"
            :visible.sync="dialogVisibleEditBtadd"
            width="30%"
            center
            :modal="false" 
            v-draggable
            :close-on-click-modal="false"
            custom-class="viewDialog">
            <el-form :model="formInline1" class="demo-form-inline" ref="formInline1" label-width="80px">
                <el-form-item :label="isAddSonName?'概念名称':'子概念名称'" prop="GnName">
                    <el-input v-model="formInline1.GnName" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="submitForm('formInline1')">确定</el-button>
                <el-button @click="resetForm('formInline1')">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="注释管理"
            :visible.sync="dialogVisibleEditBtZs"
            width="30%"
            center
            :modal="false" 
            v-draggable
            :close-on-click-modal="false"
            custom-class="viewDialog">
            <el-form :model="annotationForm" class="demo-form-inline" ref="annotationForm" label-width="85px">
                <el-form-item label="注释名：" prop="annotation">
                    <el-select v-model="annotationForm.annotation" style="width: 300px;">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="已有注释：" style="color: white;font-size: 18px !important;">
                    <span>{{ '('+noteList.length+')' }}</span><div v-for="item in noteList" :key="item.index">{{item.name}}</div>
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="submitForm('annotationForm')">添加</el-button>
                <el-button @click="resetForm('annotationForm')">取 消</el-button>
            </div>
        </el-dialog>
        <div style="display: flex;">
            <div class="leftContainer">
                <div class="entityType">
                    <i class="el-icon-document-copy" style="margin-left: 15px;" @click="addSonBt()"></i>
                    <i class="el-icon-printer" @click="addBt()"></i>
                    <i class="el-icon-edit-outline" @click="editBt()"></i>
                    <i class="el-icon-delete" @click="deleteBt()"></i>
                </div>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入"
                    v-model="filterText">
                </el-input>
                <div style="position: relative;">
                  <el-tree
                      :data="data"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      ref="tree"
                      node-key="id"
                      highlight-current
                      :expand-on-click-node="false"
                      @node-click="changeNowNode">
                  </el-tree>
                </div>
            </div>
            <div class="rightContainer">
                <el-breadcrumb v-if="breadcrumbs.length" separator=">" class="breadcrumb">
                    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                        {{ item }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <div class="language">
                    <span style="color: white;font-weight: 700;margin-right: 15px;">语言</span>
                    <el-select v-model="language" size="mini" style="margin-right: 5px;width: 150px">
                        <el-option label="中文" value="中文"></el-option>
                        <el-option label="英文" value="英文"></el-option>
                    </el-select>
                </div>
                <el-tabs v-model="activeName" type="card">
                    <keep-alive>
                        <el-tab-pane label="Annotations" name="first" style="padding: 20px;overflow-x: auto;width: 100%;">
                        <div style="color: white;position: absolute;left: 10px;top: 10px;cursor: pointer;z-index: 10000;font-size: 14px;" @click="dialogVisibleEditBtZs = true"><i class="el-icon-setting" style="margin-right: 7px;"></i>注释管理</div>
                        <el-carousel type="card" :autoplay="false" height="calc(85vh - 100px)">
                            <el-carousel-item v-for="(item,index) in noteList" :key="item.index">
                                <div class="leftContainer1">
                                <div class="entityType">
                                    <span>{{ item.name }}</span>
                                    <i class="el-icon-circle-plus-outline" style="margin-left: 15px;" @click="addSonBt()"></i>
                                    <i class="el-icon-edit-outline" @click="editBt()"></i>
                                    <i class="el-icon-delete" @click="deleteBtInner(item,index)"></i>
                                </div>
                                <el-input
                                    prefix-icon="el-icon-search"
                                    placeholder="请输入"
                                    v-model="item.filterText"
                                    size="mini"
                                    @input="filterNode1(item,index)">
                                </el-input>
                                <div style="position: relative;">
                                    <el-tree
                                        :data="data"
                                        :props="defaultProps"
                                        :filter-node-method="item.filterNode1"
                                        ref="tree1"
                                        node-key="id"
                                        highlight-current
                                        :expand-on-click-node="false"
                                        @node-click="handleNodeClick">
                                    </el-tree>
                                </div>
                                </div>
                            </el-carousel-item>
                        </el-carousel>

                        </el-tab-pane>
                    </keep-alive>
                    <keep-alive>
                        <el-tab-pane label="Usage" name="second">
                            2
                        </el-tab-pane>
                    </keep-alive>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
  
<script>
import { getInitDocList } from "@/api/entityAdmin/index";
export default {
  name: "Index",
  created(){
    this.loadData()
  },
  data() {
    return {
        dialogVisible: false,
        dialogVisibleEditBt:false,
        queryParams: {
            keyword: '',
            time: ''
        },
        formInline:{
            fatherGn:'',
            GnName:''
        },
        formInline1:{
            GnName:''
        },
        annotationForm:{
            annotation:''
        },
        selectedNode:null,
        dialogVisibleEditBtZs:false,
        rowName:'',
        filterText: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        noteList:[{name:"概述",
        filterNode1: (value, data) => {
          if (!value) return true;
          return data.label && data.label.indexOf(value) !== -1;
        }},{name:'全称',
        filterNode1: (value, data) => {
          if (!value) return true;
          return data.label && data.label.indexOf(value) !== -1;
        }},{name:'简称/同义词',
        filterNode1: (value, data) => {
          if (!value) return true;
          return data.label && data.label.indexOf(value) !== -1;
        }},{name:"xxxx",
        filterNode1: (value, data) => {
          if (!value) return true;
          return data.label && data.label.indexOf(value) !== -1;
        }}],
        totalNum:100,
        activeName: 'first',
        otherNameList:[],
        dialogVisibleEditBtadd:false,
        nowClickNode:{},
        isAddSonName:Boolean,
        language:'',
        data: [{
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        selectedLeafNodes: [],
        breadcrumbs: []
    }
  },
  methods: {
    loadData(pageSize,currentpage){
        let disstartDate ='';
        let disendDate = '';
        if(this.queryParams.time.length === 2){
            disstartDate = this.formatDate(this.queryParams.time[0]);
            disendDate = this.formatDate(this.queryParams.time[1]);
        }
        let pagesizeTemp =this.pageSize
        let currentPageTemp = this.currentPage
        if(pageSize){
            pagesizeTemp = pageSize 
        }
        if(currentpage){
            currentPageTemp = currentpage
        }
        let params = {
            createTimeEnd:disendDate,
            createTimeStart:disstartDate,
            entityType:'',
            keyword:this.queryParams.keyword,
            page:currentPageTemp,
            size:pagesizeTemp
        }
        getInitDocList(params).then(res=>{
            this.tableData = res.data.entityResList
            this.totalNum = res.data.totalCount
        })
    },
    deleteBtInner(item,index){
        const treeRef = this.$refs.tree1[index];
        if (treeRef && this.selectedNode) {
        console.log(treeRef.data, this.selectedNode.data);
      } else {
        this.$message({
          type: 'error',
          message: '请先选择需要删除的'+item.name
        });
      }
    },
    handleNodeClick(node) {
      this.selectedNode = node;
      console.log(node)
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisibleEditBt = false
        this.dialogVisibleEditBtadd = false
        this.dialogVisibleEditBtZs = false
    },
    editBt(){
        if(this.nowClickNode.id){
            this.dialogVisibleEditBt = true
        }else{
            this.$message.error("请选择需要编辑的概念！")
        }
    },
    addBt(){
        if(this.nowClickNode.id){
            this.isAddSonName = false
            this.dialogVisibleEditBtadd = true
        }else{
            this.$message.error("请选择需要添加概念的位置！")
        }
    },
    addSonBt(){
        if(this.nowClickNode.id){
            this.isAddSonName = true
            this.dialogVisibleEditBtadd = true
        }else{
            this.$message.error("请选择需要添加子概念的位置！")
        }
    },
    deleteBt(){
        console.log(this.nowClickNode)
        if(this.nowClickNode.id){
            this.$confirm('是否删除'+this.nowClickNode.label+'？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            // deleteEntity(deleteEntityParams).then(res=>{
            //     if(res.code == 200){
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                });
            //     this.isDetail = true;
            //     this.getEntityListFunction()
            //     }
            // })
            });
        }else{
            this.$message.error("请选择需要删除的概念！")
        }
    },
    changeNowNode(nodeData, node, instance){
        this.nowClickNode = nodeData
        this.breadcrumbs = this.getLabelsFromDOM(instance.$el);
    },
    changeNowNodeInner(nodeData, node, instance){
        console.log(nodeData)
    },
    getLabelsFromDOM(element) {
      const labels = [];
      let currentElement = element;

      while (currentElement) {
        const labelElement = currentElement.querySelector('.el-tree-node__label');
        if (labelElement) {
          labels.unshift(labelElement.innerText);
        }
        currentElement = currentElement.parentElement.closest('.el-tree-node');
      }

      return labels;
    },
    filterNode1(tree, index) {
      const treeRef = this.$refs.tree1[index];
      if (treeRef) {
        treeRef.filter(tree.filterText);
      }
    },
    viewOtherName(data){
        this.dialogVisible = true;
        this.rowName = data.entityname
        this.otherNameList = data.anotherName
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    },
    getLeafNodes(nodes) {
      const leafNodes = [];
        nodes.forEach(node => {
          if (!node.children || node.children.length === 0) {
            leafNodes.push(node);
          }
        });
      return leafNodes;
    },
    formatDate(date) {
      const d = new Date(date);
      const year = String(d.getFullYear());  // 获取年份的后两位
      const month = String(d.getMonth() + 1).padStart(2, '0');  // 获取月份，并补零
      const day = String(d.getDate()).padStart(2, '0');  // 获取日期，并补零
      const hours = String(d.getHours()).padStart(2, '0');  // 获取小时，并补零
      const minutes = String(d.getMinutes()).padStart(2, '0');  // 获取分钟，并补零
      const seconds = String(d.getSeconds()).padStart(2, '0');  // 获取秒，并补零
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  watch: {
    filterText(val) {
        this.$refs.tree.filter(val);
    }
},
};

</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
        padding-bottom: 0;
    }
    .leftContainer{
        width: 20%;
        border: 1px solid rgba(2,167,240,1);
        border-radius: 8px;
        height: 85vh;
    }
    .leftContainer1{
        width: 100%;
        border-radius: 8px;
        display: inline-block;
    }
    .rightContainer{
        width: 80%;
        margin-left: 20px;
        position: relative;
    }
    .tag-group{
        line-height: 40px;
    }
    .tag-group__title{
        font-size: 18px;
        font-weight: 700;
        color: #00FFFF;
        margin-left: 5px;
    }
    .el-tag--medium{
        margin-left: 10px;
    }
    .leftContainer{
        .entityType{
        line-height: 40px;
        color: white;
        font-size: 22px;
        height: 40px;
        text-align: center;
        i{
            margin-right: 15px;
            cursor: pointer;
        }
    }
    }
    .leftContainer1{
        .entityType{
        line-height: 40px;
        color: white;
        font-size: 18px;
        height: 40px;
        text-align: center;
        i{
            margin-right: 15px;
            cursor: pointer;
        }
    }
    }
    .el-tree{
        height: calc(85vh - 85px);
        overflow-y: auto;
    }
    ::v-deep .leftContainer1{
        .el-tree{
            height: calc(85vh - 168px);
            overflow-y: auto;
            background-color: rgba(1,27,38,1);
            color: white;
            border: 1px solid rgba(121,121,121,1);
            .el-tree-node__content{
                background: none !important;
            }
        }
    }
    ::v-deep .el-carousel__container .el-tabs .is-active{
        background-color: red !important;
    }
    
    ::v-deep .viewDialog{
        top: 10%;
    }
    ::v-deep .el-descriptions-item__cell{
        text-align: center !important;
    }
    ::v-deep .el-descriptions-item__label{
        width: 30%;
        text-align: center;
    }
    .el-tree{
        background-color: rgba(0,0,0,1);
        color: white;
    }
    ::v-deep .leftContainer .el-input__inner{
        background-color: rgba(0,0,0,1) !important;
        color: white;
    }
    ::v-deep .leftContainer1 .el-input__inner{
        background-color: rgba(0,0,0,1) !important;
        color: white;
    }
    ::v-deep .el-checkbox__inner{
        background-color: rgba(1,84,120,1);
        border: 1px solid rgba(2,125,180,1);
    }
    ::v-deep .el-tree-node__content{
        background: url('../../assets/images/u376.svg') no-repeat;      
    }
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background: url('../../assets/images/u376.svg') no-repeat;
        color: #169BD5;
    }
    ::v-deep .el-tree-node__content{
        .is-focusable{
            background: url('../../assets/images/u376.svg') no-repeat;      
        }
    }
    ::v-deep .el-tree-node:focus > .el-tree-node__content{
        background: url('../../assets/images/u376.svg') no-repeat;    
    }
    ::v-deep .el-tree-node__content:hover{
        background: url('../../assets/images/u376.svg') no-repeat !important;
    }
    ::v-deep .el-tabs__header{
            .is-active{
                color: white;
                background-color: #169BD5 !important;
                padding: 0 !important;
            }
    } 
    ::v-deep .el-tabs{
        .el-tabs__header{
            margin-bottom: 0;
            border: none;
        }
        .el-tabs__content{
            border: 1px solid #dfe4ed;
            height: 81vh;
        }
        .el-tabs__nav{
            border: none;
        }
        .el-tabs__item{
            color: white;
            background-color: rgba(170,170,170,1);
            border: none;
            border-radius: 8px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            width: 100px;
            padding: 0;
        }
    }
    ::v-deep .breadcrumb{
        display: inline-block;
        position: absolute;
        left: 25%;
        top: 10px;
        .el-breadcrumb__item{
            .el-breadcrumb__inner{
                color: #02a7f0 !important;
            }
        }
    }
    ::v-deep .language{
        display: inline-block;
        position: absolute;
        right:0;
        z-index: 1000;
    }
    ::v-deep .el-carousel__mask{
        background-color: #111725;
    }
</style>
  
  