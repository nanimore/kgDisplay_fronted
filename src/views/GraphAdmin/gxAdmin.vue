<template>
    <div class="app-container">
        <el-dialog
            :title="rowName"
            :visible.sync="dialogVisible"
            width="25%"
            center
            :close-on-click-modal="false"
            custom-class="viewDialog">
            <el-descriptions class="margin-top" :column="1" border>
                <el-descriptions-item v-for="item in otherNameList" :label="item.name">{{ item.value }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
        <div style="display: flex;">
            <div class="leftContainer">
                <div class="entityType">
                    <i class="el-icon-document-copy" style="margin-left: 15px;"></i>
                    <i class="el-icon-printer"></i>
                    <i class="el-icon-edit-outline"></i>
                    <i class="el-icon-delete"></i>
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
                      @check="selectNodes">
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
        queryParams: {
            keyword: '',
            time: ''
        },
        rowName:'',
        filterText: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        totalNum:100,
        otherNameList:[],
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
    handleSizeChange(pageSize){
        this.loadData(pageSize,this.currentPage)
    },
    handleCurrentChange(currentpage){
        this.loadData(this.pageSize,currentpage)
    },
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
        this.currentPage = 1
        this.pageSize = 10
        this.loadData()
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
  
  