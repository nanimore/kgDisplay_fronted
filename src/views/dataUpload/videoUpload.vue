<template>
    <div class="app-container">
        <el-dialog title="上传视频" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="视频名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择文件">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :limit="1"
                        :before-upload="beforeUpload"
                        :on-exceed="handleExceed">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="数据源名称" prop="dataSourceName">
                    <el-select v-model="form.dataSourceName" placeholder="请选择">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据源网址" prop="url">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实例名称" prop="entityName">
                    <el-select v-model="form.entityName" placeholder="请选择">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype">
                    <el-select v-model="form.targettype" placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间" prop="publicTime" style="margin-bottom: 0;"> 
                    <el-date-picker
                        v-model="form.publicTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('form')">上传</el-button>
                <el-button @click="resetForm('form')">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上传视频" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="数据源名称" prop="dataSourceName">
                    <el-select v-model="form.dataSourceName" placeholder="请选择">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实例名称" prop="entityName">
                    <el-select v-model="form.entityName" placeholder="请选择">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype">
                    <el-select v-model="form.targettype" placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间" prop="publicTime" style="margin-bottom: 0;"> 
                    <el-date-picker
                        v-model="form.publicTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('form')">上传</el-button>
                <el-button @click="resetForm('form')">取 消</el-button>
            </div>
        </el-dialog>
        <el-form :model="queryParams" ref="queryParams"  :inline="true" >
            <el-form-item>
                <el-button type="primary" @click="dialogFormVisible = true" style="background-color: #00bfbf;color: white;border-color: #00bfbf">上传视频</el-button>
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
            <el-form-item label="目标类型" prop="targetType">
                <el-select v-model="queryParams.targetType" placeholder="请选择">
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
                prop="datasource"
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
                label="目标类型"
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
            targetType:'',
            person: '',
            publicTime:'',
            uploadTime: ''
        },
        tableData:[
            {videoName:'视频1',datasource:'Bilibili',url:'https://www.youtube.com/watch?v=Z8gIcrJkJdQ',entityName:'CVN- 68尼米兹号航空母舰',entityType:'飞行器',person:'任家松',publicTime:'2024-4-15',uploadTime:'2024-4-16'}
        ],
        labelPosition:'right',
        dialogFormVisible:false,
        form: {
          name: '',
          language: '',
          url:'',
          targettype:'',
          publicTime:'',
          entityName:'',
          dataSourceName:''
        },
        rules: {
          name: [
            { required: true, message: '请输入视频名称'},
          ],
          dataSourceName: [
            { required: true, message: '请选择数据源名称'},
          ],
          url: [
            { required: true, message: '请输入数据源网址'},
          ],
          targettype:[
            { required: true, message: '请选择目标类型'},
          ],
          entityName:[
            { required: true, message: '请选择实例名称'},
          ],
          publicTime:[
            { required: true, message: '请选择发布时间'},
          ],
        },
        currentPage: 1,
        pageSize: 10,
        totalNum: 100,
    };
  },
  methods: {
    resetQuery(){
        this.resetForm("queryParams")
        this.handleQuery()
    },
    handleQuery(){
        console.log(this.queryParams)
    },
    beforeUpload(file) {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        this.$message.error('只能上传视频文件!');
      }
      return isVideo;
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSizeChange(){
        this.handleQuery()
    },
    handleCurrentChange(){
        this.handleQuery()
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('上传成功!');
            this.resetForm(formName)
            this.dialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
  }
};
</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
    }
    .el-select{
        width: 100%;
    }
</style>
  
  