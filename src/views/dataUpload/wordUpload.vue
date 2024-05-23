<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryParams" size="small" :inline="true" label-width="68px">
            <el-form-item>
                <el-button type="primary" @click="handleQuery">上传文档</el-button>
            </el-form-item>
            <el-form-item label="书籍名称" prop="bookName">
                <el-input
                v-model="queryParams.bookName"
                placeholder="请输入书籍名称"
                clearable
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="语言" prop="language">
                <el-select v-model="queryParams.language" placeholder="请选择语言">
                    <el-option label="中文" value="Chinese"></el-option>
                    <el-option label="英文" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="目标类型" prop="target">
                <el-select v-model="queryParams.target" placeholder="请选择目标类型">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传人" prop="person">
                <el-select v-model="queryParams.person" placeholder="请选择上传人">
                    <el-option label="A" value="Chinese"></el-option>
                    <el-option label="B" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传时间" prop="time">
                <el-date-picker
                    v-model="queryParams.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">检索</el-button>
                <el-button  @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script>
export default {
  name: "Index",
  data() {
    return {
        queryParams: {
            bookName: '',
            language: '',
            target: '',
            person: '',
            time: ''
        }
    };
  },
  methods: {
    resetQuery(){
        this.resetForm("queryParams")
        this.handleQuery()
    },
    handleQuery(){
        console.log(this.queryParams)
    }
  }
};
</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
    }
</style>
  
  