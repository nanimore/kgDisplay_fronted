<template>
    <div class="app-container">
        <el-dialog title="上传书籍" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="上传书籍">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple
                        :before-upload="beforeUpload"
                        :limit="3"
                        :on-exceed="handleExceed">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="书籍名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" prop="language">
                    <el-select v-model="form.language" placeholder="请选择语言">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本是否可以复制" prop="iscopy">
                    <el-select v-model="form.iscopy" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype" style="margin-bottom: 0;">
                    <el-select v-model="form.targettype" multiple placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('form')">上传</el-button>
                <el-button @click="resetForm('form')">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑书籍" :visible.sync="editdialog" center :close-on-click-modal="false" width="35%" custom-class="my-dialog">
            <el-form :model="form1" ref="editform" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="书籍名称" prop="name">
                    <el-input v-model="form1.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="语言" prop="language">
                    <el-select v-model="form1.language" placeholder="请选择语言">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本是否可以复制" prop="iscopy">
                    <el-select v-model="form1.iscopy" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype" style="margin-bottom: 0;">
                    <el-select v-model="form1.targettype" multiple placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="editForm('editform')">上传</el-button>
                <el-button @click="resetForm('editform')">取 消</el-button>
            </div>
        </el-dialog>

        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogFormVisible = true" style="background-color: #00bfbf;color: white;border-color: #00bfbf">上传书籍</el-button>               
            </el-form-item>
            <el-form-item label="书籍名称" prop="bookName">
                <el-input
                v-model="queryParams.bookName"
                placeholder="请输入书籍名称"
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
                <el-button type="primary" @click="handleQuery()">检索</el-button>
                <el-button  @click="resetQuery()" class="resetbutton">重置</el-button>
            </el-form-item>
        </el-form>
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
                prop="name"
                label="书籍名称"
                width="240"
                align="center">
            </el-table-column>
            <el-table-column
                prop="language"
                label="语言"
                align="center">
            </el-table-column>
            <el-table-column 
                label="文本是否可以复制"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.iscopy==1">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="targettype"
                label="目标类型"
                align="center">
            </el-table-column>
            <el-table-column
                prop="person"
                label="上传人"
                align="center">
            </el-table-column>
            <el-table-column
                prop="time"
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
import { time } from 'echarts';



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
        },
        labelPosition:'right',
        dialogFormVisible: false,
        editdialog:false,
        form: {
          name: '',
          language: '',
          iscopy:'',
          targettype:[]
        },
        form1: {
          name: '',
          language: '',
          iscopy:'',
          targettype:[]
        },
        rules: {
          name: [
            { required: true, message: '请输入书籍名称'},
          ],
          language: [
            { required: true, message: '请选择语言'},
          ],
          iscopy: [
            { required: true, message: '请选择文本是否可以复制'},
          ],
          targettype:[
            { required: true, message: '请选择文本是否可以复制'},
          ]
        },
        tableData:[
            {name:'世界航母雷达与电子战系统手册1',language:'中文',iscopy:'1',targettype:['舰船','飞行器'],person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册2',language:'中文',iscopy:'0',targettype:['舰船','飞行器'],person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册3',language:'中文',iscopy:'1',targettype:['舰船','飞行器'],person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册4',language:'中文',iscopy:'0',targettype:['舰船','飞行器'],person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册5',language:'中文',iscopy:'1',targettype:['舰船','飞行器'],person:'潘博彦',time:'2022-10-2'},
        ],
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
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSizeChange(pageSize){
        this.pageSize = pageSize
    },
    handleCurrentChange(currentpage){
        this.currentPage = currentpage
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
    editForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('编辑成功!');
            this.resetForm(formName)
            this.editdialog = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
        this.editdialog = false;
    },
    beforeUpload(file) {
      const isDoc = file.type === 'application/msword';
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isPdf = file.type === 'application/pdf';
      if (!isDoc && !isDocx && !isPdf) {
        this.$message.error('上传文件只能是 doc, docx 或 pdf 格式!');
        return false;
      }
      return true;
    },
    handleClick(row){
        this.editdialog = true;
        this.form1 = row;
    }
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
  
  