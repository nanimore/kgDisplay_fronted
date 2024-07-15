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
                      @check="selectNodes"
                      :expand-on-click-node="false"
                      @node-click="changeNowNode">
                  </el-tree>
                </div>
            </div>
            <div class="rightContainer">
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="Annotations" name="first">
                        1
                    </el-tab-pane>
                    <el-tab-pane label="Usage" name="second">
                        2
                    </el-tab-pane>
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
        rowName:'',
        filterText: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        totalNum:100,
        activeName: 'first',
        otherNameList:[],
        dialogVisibleEditBtadd:false,
        nowClickNode:{},
        isAddSonName:Boolean,
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
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
        selectedLeafNodes: []
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
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisibleEditBt = false
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
    getParentLabels(node) {
      const labels = [];
      let parent = node.parent;

      while (parent) {
        labels.unshift(parent.label);
        parent = parent.parent;
      }

      return labels;
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
    changeNowNode(params1){
        this.nowClickNode = params1
        const labels = this.getParentLabels(node);
        labels.push(node.label);
        this.breadcrumbLabels = labels;
        console.log('Current node label:', node.label);
        console.log('All parent labels:', labels);
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
    clearAllSelections() {
      this.$refs.tree.setCheckedNodes([]);
      this.selectedLeafNodes = [];
    },
    selectNodes(checkedNodes, checkedKeys) {
        this.selectedLeafNodes = this.getLeafNodes(this.$refs.tree.getCheckedNodes());
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
    handleTagClose(node) {
      // 取消选中节点
      this.$refs.tree.setChecked(node.id, false);
      this.selectedLeafNodes = this.selectedLeafNodes.filter(item => item.id !== node.id);
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
    .rightContainer{
        width: 80%;
        margin-left: 20px;
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
    .el-tree{
        height: calc(85vh - 85px);
        overflow-y: scroll;
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
    ::v-deep .el-tabs{
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
</style>
  
  