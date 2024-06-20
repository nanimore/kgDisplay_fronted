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
                <el-descriptions-item label="日文全称">{{ otherData.japanesename }}</el-descriptions-item>
                <el-descriptions-item label="日文简称">{{ otherData.japanesesimplename }}</el-descriptions-item>
                <el-descriptions-item label="日文别名">{{ otherData.japanesealias }}</el-descriptions-item>
                <el-descriptions-item label="俄文全称">{{ otherData.russianame }}</el-descriptions-item>
                <el-descriptions-item label="俄文简称">{{ otherData.russiasimplename }}</el-descriptions-item>
                <el-descriptions-item label="俄文别名">{{ otherData.russiaalias }}</el-descriptions-item>
                <el-descriptions-item label="韩文全称">{{ otherData.koreanname }}</el-descriptions-item>
                <el-descriptions-item label="韩文简称">{{ otherData.koreansimplename }}</el-descriptions-item>
                <el-descriptions-item label="韩文别名">{{ otherData.koreanalias }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
        
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="标注人员" prop="person">
                <el-select v-model="queryParams.person" filterable placeholder="请选择标注人员">
                    <el-option label="A" value="Chinese"></el-option>
                    <el-option label="B" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标注时间" prop="time">
                <el-date-picker
                    v-model="queryParams.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字" prop="keyword">
                <el-input v-model="queryParams.keyword" autocomplete="off" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="loadData()">检索</el-button>
                <el-button @click="resetForm('queryParams')" class="resetbutton">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="display: flex;">
            <div class="leftContainer">
                <div class="entityType">实例类型</div>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="输入实例名称搜索"
                    v-model="filterText">
                </el-input>
                <div style="position: relative;">
                  <el-button type="danger" icon="el-icon-delete" circle @click="clearAllSelections" style="position: absolute;right: 7px;top: 1px;z-index: 999;"></el-button>                
                  <el-tree
                      :data="data"
                      :props="defaultProps"
                      default-expand-all
                      :filter-node-method="filterNode"
                      ref="tree"
                      node-key="id"
                      show-checkbox
                      highlight-current
                      expand-on-click-node
                      @check="selectNodes">
                  </el-tree>
                </div>
            </div>
            <div class="rightContainer">
                <div class="tag-group">
                    <span class="tag-group__title">选择实例类型：</span>
                    <el-tag
                        v-for="node in selectedLeafNodes"
                        :key="node.id"
                        closable
                        @close="handleTagClose(node)"
                        effect="dark">
                        {{ node.label }}
                    </el-tag>
                </div>
                <el-table
                    :data="tableData"
                    border>
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="entityname"
                        label="实例名称"
                        width="130"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="entitytype"
                        label="实例类型"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="chinesename"
                        label="中文全称"
                        width="130"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="chinesesimplename"
                        label="中文简称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="chinesealias"
                        label="中文别名"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="englishname"
                        label="英文全称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="englishsimplename"
                        label="英文简称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="englishalias"
                        label="英文别名"
                        width="100"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="其他语言名称"
                        width="120"
                        align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isData==true" style="color: #1890ff;cursor: pointer;" @click="viewOtherName(scope.row)">点击查看</span>
                            <span v-else >点击查看</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="sendSalary(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="margin-top:15px;">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="10">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
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
            person: '',
            time: ''
        },
        rowName:'',
        filterText: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [
            {entityname:'亚特兰大级轻型巡洋舰',entitytype:'巡洋舰',chinesename:'CL51亚特兰大级轻型巡洋舰',chinesesimplename:'',chinesealias:'CL51亚特兰大',englishname:'',englishsimplename:'Atlanta; USS Atlanta',englishalias:'',isData:true,japanesename:'1',japanesesimplename:'2',japanesealias:'3',russianame:'4',russiasimplename:'5',russiaalias:'6',koreanname:'7',koreansimplename:'8',koreanalias:'9'},
            {entityname:'亚特兰大级轻型巡洋舰1',entitytype:'巡洋舰',chinesename:'CL51亚特兰大级轻型巡洋舰',chinesesimplename:'',chinesealias:'CL51亚特兰大',englishname:'',englishsimplename:'Atlanta; USS Atlanta',englishalias:'',isData:false},
            {entityname:'亚特兰大级轻型巡洋舰2',entitytype:'巡洋舰',chinesename:'CL51亚特兰大级轻型巡洋舰',chinesesimplename:'',chinesealias:'CL51亚特兰大',englishname:'',englishsimplename:'Atlanta; USS Atlanta',englishalias:'',isData:true},
            {entityname:'亚特兰大级轻型巡洋舰3',entitytype:'巡洋舰',chinesename:'CL51亚特兰大级轻型巡洋舰',chinesesimplename:'',chinesealias:'CL51亚特兰大',englishname:'',englishsimplename:'Atlanta; USS Atlanta',englishalias:'',isData:true},
            {entityname:'亚特兰大级轻型巡洋舰4',entitytype:'巡洋舰',chinesename:'CL51亚特兰大级轻型巡洋舰',chinesesimplename:'',chinesealias:'CL51亚特兰大',englishname:'',englishsimplename:'Atlanta; USS Atlanta',englishalias:'',isData:false},
        ],
        otherData:{},
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
        this.pageSize = pageSize
        this.loadData()
    },
    handleCurrentChange(currentpage){
        this.currentPage = currentpage
        this.loadData()
    },
    loadData(){
        console.log(this.queryParams)
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    viewOtherName(data){
        this.dialogVisible = true;
        this.rowName = data.entityname
        this.otherData = data
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
        console.log(this.$refs.tree.getCheckedNodes())
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
        height: 80vh;
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
        // color: #00FFFF;
        margin-left: 5px;
    }
    .el-tag--medium{
        margin-left: 10px;
    }
    .entityType{
        line-height: 40px;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        border-bottom: 1px solid rgba(2,167,240,1);
        color: rgba(2,167,240,1);
    }
    .el-tree{
        height: calc(80vh - 85px);
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
</style>
  
  