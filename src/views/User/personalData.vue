<template>
    <div class="app-container">
        <el-table
            :data="tableData"
            border
            style="margin-top: 20px;"
            >
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
            prop="passedArticle"
            label="已通过文章"
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
            prop="labeledTriplets"
            label="已标注三元组"
            align="center">
            </el-table-column>
            <el-table-column
            prop="passedTriplets"
            label="已通过三元组"
            align="center">
            </el-table-column>
            <el-table-column
            prop="confirmedTriplets"
            label="已确认三元组"
            align="center">
            </el-table-column>
            <el-table-column
            prop="notPassedArticle"
            label="未通过三元组"
            align="center">
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
import {getPersonalInfo} from "@/api/userInfo/index"
export default {
  name: "Index",
  created(){
    // this.loadData()
    getPersonalInfo().then(res=>{
        this.tableData = res.data
    })
  },
  data() {
    return {
        tableData: []
    }
}
}

</script>
  
<style scoped lang="scss">

</style>
  
  