<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="标注人员" prop="person">
                <el-select v-model="queryParams.person" @change="selectPerson" filterable placeholder="请选择标注人员">
                    <el-option label="A" value="Chinese"></el-option>
                    <el-option label="B" value="English"></el-option>
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
                prop="person"
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
                prop="article1"
                label="已领取文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="article2"
                label="待审核文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="article3"
                label="未通过文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="article4"
                label="已返工文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="article5"
                label="已通过文章"
                align="center">
            </el-table-column>
            <el-table-column
                prop="triplet1"
                label="已标注三元组"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="triplet2"
                label="已通过三元组"
                width="100"
                align="center">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="已发放劳务"
                align="center">
            </el-table-column>
            <el-table-column
                prop="allsalary"
                label="总劳务"
                align="center">
            </el-table-column>
            <el-table-column
                label="劳务发放"
                width="150"
                align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="sendSalary(scope.row)">发放</el-button>
                </template>
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
import { getPersonalInfo,managePersonalInfo } from "@/api/userInfo/index";
export default {
  name: "Index",
  created(){
    this.loadData()
    let params = {
        proofreader:''
    }
    managePersonalInfo(params).then(res=>{
        console.log(res.data)
    })
  },
  data() {
    return {
        currentPage: 1,
        pageSize: 10,
        queryParams: {
            person: '',
        },
        tableData: [
            {person:'wutianyu',datatype:'A',article1:'BBBBB',article2:'BBBBB',article3:'BBBBB',article4:'BBBBB',article5:'BBBBB',triplet1:'2000',triplet2:'4000',salary:'5000',allsalary:'4000'},
            {
                person:'lubenwei',
                datatype:'A',
                article1:'BBBBB',
                article2:'BBBBB',
                article3:'BBBBB',
                article4:'BBBBB',
                article5:'BBBBB',
                triplet1:'2000',
                triplet2:'4000',
                salary:'5000',
                allsalary:'4000'
            },
            {
                person:'pengyuyan',
                datatype:'A',
                article1:'BBBBB',
                article2:'BBBBB',
                article3:'BBBBB',
                article4:'BBBBB',
                article5:'BBBBB',
                triplet1:'2000',
                triplet2:'4000',
                salary:'5000',
                allsalary:'4000'
            },
            {
                person:'caixukun',
                datatype:'A',
                article1:'BBBBB',
                article2:'BBBBB',
                article3:'BBBBB',
                article4:'BBBBB',
                article5:'BBBBB',
                triplet1:'2000',
                triplet2:'4000',
                salary:'5000',
                allsalary:'4000'
            },
            {
                person:'liuxiulei',
                datatype:'A',
                article1:'BBBBB',
                article2:'BBBBB',
                article3:'BBBBB',
                article4:'BBBBB',
                article5:'BBBBB',
                triplet1:'2000',
                triplet2:'4000',
                salary:'5000',
                allsalary:'4000'
            }
        ],
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
        console.log(this.queryParams.person)
        console.log(this.currentPage)
        console.log(this.pageSize)
    }
  },
  computed: {
    totalNum() {  
        return this.tableData.length;  
    }  
  }
};


</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
    }
</style>
  
  