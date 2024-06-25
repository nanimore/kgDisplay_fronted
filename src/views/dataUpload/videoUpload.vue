<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryParams"  :inline="true" >
            <el-form-item>
                <el-button type="primary" @click="handleQuery" style="background-color: #00bfbf;color: white;border-color: #00bfbf">上传视频</el-button>
            </el-form-item>
            <el-form-item label="视频名称" prop="videoName">
                <el-input
                v-model="queryParams.videoName"
                placeholder="请输入书籍名称"
                clearable
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="所属实例" prop="entityName">
                <el-select v-model="queryParams.entityName" placeholder="请选择">
                    <el-option label="中文" value="Chinese"></el-option>
                    <el-option label="英文" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据源名称" prop="dataSourceName">
                <el-select v-model="queryParams.dataSourceName" placeholder="请选择">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据源名称" prop="targetName">
                <el-select v-model="queryParams.targetName" placeholder="请选择">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布时间" prop="publicTime">
                <el-date-picker
                    v-model="queryParams.publicTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="上传人" prop="person">
                <el-select v-model="queryParams.person" placeholder="请选择上传人">
                    <el-option label="A" value="Chinese"></el-option>
                    <el-option label="B" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传时间" prop="uploadTime">
                <el-date-picker
                    v-model="queryParams.uploadTime"
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
        <el-table
            :data="tableData"
            @selection-change="handleSelectionChange"
            border>
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center">
            </el-table-column>
            <el-table-column
                prop="videoName"
                label="视频名称"
                width="120"
                align="center">
            </el-table-column>
            <el-table-column
                prop="language"
                label="数据源"
                align="center">
            </el-table-column>
            <el-table-column
                prop="url"
                label="数据源网址"
                align="center"
                width="180">
            </el-table-column>
            <el-table-column
                prop="entityName"
                label="实例名称"
                align="center">
            </el-table-column>
            <el-table-column
                prop="entityType"
                label="实例类型"
                align="center">
            </el-table-column>
            <el-table-column
                prop="person"
                label="上传人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="publicTime"
                label="发布时间"
                align="center">
            </el-table-column>
            <el-table-column
                prop="uploadTime"
                label="上传时间"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="180"
                align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small">查看</el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
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
export default {
  name: "Index",
  data() {
    return {
        queryParams: {
            videoName: '',
            entityName: '',
            dataSourceName: '',
            targetName:'',
            person: '',
            publicTime:'',
            uploadTime: ''
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
  
  