<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="标注人员" prop="person">
                <el-select v-model="queryParams.person" @change="selectPerson" filterable placeholder="请选择标注人员">
                    <el-option v-for="(item,index) in peopleList" :label="item" :value="item" :key="index"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center">
            </el-table-column>
            <el-table-column
                prop="proofreader"
                label="标注人员"
                width="150"
                align="center">
            </el-table-column>
            <el-table-column
                prop="datatype"
                label="数据类型"
                align="center">
            </el-table-column>
            <el-table-column
                prop="receivedArticle"
                label="已领取文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="reviewArticle"
                label="待审核文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="notPassedArticle"
                label="未通过文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="reworkedArticle"
                label="已返工文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="passedArticle"
                label="已通过文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="labeledTriplets"
                label="已标注三元组"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="passedTriplets"
                label="已通过三元组"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="confirmedTriplets"
                label="已确认三元组"
                align="center">
            </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 30px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNum">
            </el-pagination>
        </div>
    </div>
</template>
  
<script>
import { managePersonalInfo } from "@/api/userInfo/index";
import { getInitProofreaders } from "@/api/datalabel/label";
export default {
  name: "Index",
  created(){
    let params = {
        proofreader:''
    }
    managePersonalInfo(params).then(res=>{
        this.tableData= res.data
    })
    getInitProofreaders().then(res=>{
        this.peopleList = res.data
    })
  },
  data() {
    return {
        currentPage: 1,
        pageSize: 10,
        queryParams: {
            person: '',
        },
        tableData: [],
        peopleList:[]
    }
  },
  methods: {
    selectPerson(){
        this.loadData()
    },
    sendSalary(row){
        console.log(row.person)
    },
    handleSizeChange(pageSize){
        this.pageSize = pageSize
        this.loadData()
    },
    handleCurrentChange(currentpage){
        this.currentPage = currentpage
        this.loadData()
    },
    loadData(){
        let params = {
            proofreader:this.queryParams.person
        }
        managePersonalInfo(params).then(res=>{
            this.tableData=res.data
        })
    }
  },
  computed: {
  }
};


</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
    }
</style>
  
  