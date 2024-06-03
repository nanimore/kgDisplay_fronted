<template>
    <div class="app-container">
        <el-table
            :data="tableData"
            border
            style="margin-top: 20px;"
            >
            <el-table-column
            prop="passage1"
            label="已领取文章"
            align="center">
            </el-table-column>
            <el-table-column
            prop="passage2"
            label="待审核文章"
            align="center">
            </el-table-column>
            <el-table-column
            prop="passage3"
            label="已通过文章"
            align="center">
            </el-table-column>
            <el-table-column
            prop="passage4"
            label="未通过文章"
            align="center">
            </el-table-column>
            <el-table-column
            prop="passage5"
            label="已返工文章"
            align="center">
            </el-table-column>
            <el-table-column
            prop="triple1"
            label="已标注三元组"
            align="center">
            </el-table-column>
            <el-table-column
            prop="triple1"
            label="已通过三元组"
            align="center">
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
export default {
  name: "Index",
  created(){
    // this.loadData()
  },
  data() {
    return {
        tableData: [{
            passage1: 1,
            passage2: 2,
            passage3: 3,
            passage4: 4,
            passage5: 5,
            passage6: 6,
            triple1: 7,
            triple2:8
        }]
    }
}
}

</script>
  
<style scoped lang="scss">

</style>
  
  