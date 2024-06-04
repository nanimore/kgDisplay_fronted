<template>
    <div class="app-container">
        <el-dialog title="批量编辑文档" :visible.sync="multiEditDialog" center :close-on-click-modal="false" width="35%" custom-class="my-dialog">
            <el-form :model="multiform" ref="multieditform" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="语言" prop="language">
                    <el-select v-model="multiform.language" placeholder="请选择语言">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本是否可以复制" prop="iscopy">
                    <el-select v-model="multiform.iscopy" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype">
                    <el-select v-model="multiform.targettype" placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="书籍源" prop="booksource"  style="margin-bottom: 0;">
                    <el-select v-model="multiform.booksource" placeholder="请选择">
                        <el-option label="书籍1" value="书籍1"></el-option>
                        <el-option label="书籍2" value="书籍2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="multiEditForm('multieditform')">确定</el-button>
                <el-button @click="multiEditDialog=false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上传文档" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="上传文档">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :before-upload="beforeUpload"
                        :limit="1"
                        :on-exceed="handleExceed">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文档名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="书籍源" prop="booksource">
                    <el-select v-model="form.booksource" placeholder="请选择书籍源">
                        <el-option label="书籍1" value="书籍1"></el-option>
                        <el-option label="书籍2" value="书籍2"></el-option>
                    </el-select>
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
                    <el-select v-model="form.targettype" placeholder="请选择">
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
        <el-dialog title="批量上传文档" :visible.sync="multidialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="multiuploadform" ref="multiuploadform" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="上传文档" prop="upload">
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
                <el-form-item label="书籍源" prop="booksource">
                    <el-select v-model="multiuploadform.booksource" placeholder="请选择书籍源">
                        <el-option label="书籍1" value="书籍1"></el-option>
                        <el-option label="书籍2" value="书籍2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="language">
                    <el-select v-model="multiuploadform.language" placeholder="请选择语言">
                        <el-option label="中文" value="Chinese"></el-option>
                        <el-option label="英文" value="English"></el-option>
                        <el-option label="日文" value="Japanese"></el-option>
                        <el-option label="韩文" value="Korean"></el-option>
                        <el-option label="俄文" value="Russian"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本是否可以复制" prop="iscopy">
                    <el-select v-model="multiuploadform.iscopy" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标类型" prop="targettype" style="margin-bottom: 0;">
                    <el-select v-model="multiuploadform.targettype" placeholder="请选择">
                        <el-option label="舰船" value="舰船"></el-option>
                        <el-option label="飞行器" value="飞行器"></el-option>
                        <el-option label="三" value="3"></el-option>
                        <el-option label="四" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="multiupload('multiuploadform')">上传</el-button>
                <el-button @click="multiuploadreset('multiuploadform')">取 消</el-button>
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
                    <el-select v-model="form1.targettype" placeholder="请选择">
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
                <el-button type="primary" @click="dialogFormVisible = true">上传文档</el-button>    
                <el-button type="primary" @click="multidialogFormVisible = true">批量上传文档</el-button>              
            </el-form-item>
            <el-form-item label="文档名称" prop="wordName">
                <el-input
                v-model="queryParams.wordName"
                placeholder="请输入文档名称"
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
            <el-form-item label="书籍源" prop="booksource">
                <el-select v-model="queryParams.source" placeholder="请选择书籍源">
                    <el-option label="一" value="1"></el-option>
                    <el-option label="二" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传人" prop="person"  style="margin-bottom: 0;">
                <el-select v-model="queryParams.person" placeholder="请选择上传人">
                    <el-option label="A" value="Chinese"></el-option>
                    <el-option label="B" value="English"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传时间" prop="time"  style="margin-bottom: 0;">
                <el-date-picker
                    v-model="queryParams.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
                <el-button type="primary" @click="handleQuery()">检索</el-button>
                <el-button  @click="resetQuery()" class="resetbutton">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-bottom: 15px; float: right;" @click="editAll()">批量编辑</el-button>
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
                prop="name"
                label="文档名称"
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
                label="数据类型"
                align="center">
            </el-table-column>
            <el-table-column
                prop="booksource"
                label="书籍源"
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
export default {
  name: "Index",
  data() {
    return {
        multidialogFormVisible : false,
        multipleSelection: [],
        queryParams: {
            wordName: '',
            language: '',
            target: '',
            source:'',
            person: '',
            time: ''
        },
        multiform: {
            language: '',
            iscopy:'',
            targettype:'',
            booksource:''
        },
        labelPosition:'right',
        dialogFormVisible: false,
        editdialog:false,
        multiEditDialog: false,
        form: {
            name: '',
            language: '',
            booksource:'',
            iscopy:'',
            targettype:''
        },
        form1: {
            name: '',
            language: '',
            booksource:'',
            iscopy:'',
            targettype:''
        },
        multiuploadform: {
            language: '',
            booksource:'',
            iscopy:'',
            targettype:''
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
            { required: true, message: '请选择目标类型'},
          ],
          booksource:[
            { required: true, message: '请选择书籍源'},
          ]
        },
        tableData:[
            {name:'世界航母雷达与电子战系统手册1',language:'中文',iscopy:'1',targettype:'舰船',booksource:'一',person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册2',language:'中文',iscopy:'0',targettype:'飞行器',booksource:'一',person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册3',language:'中文',iscopy:'1',targettype:'舰船',booksource:'一',person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册4',language:'中文',iscopy:'0',targettype:'飞行器',booksource:'一',person:'潘博彦',time:'2022-10-2'},
            {name:'世界航母雷达与电子战系统手册5',language:'中文',iscopy:'1',targettype:'舰船',booksource:'一',person:'潘博彦',time:'2022-10-2'},
        ],
        currentPage: 1,
        pageSize: 10,
        totalNum: 100,
    };
  },
  methods: {
    multiEditForm(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$message.success('批量编辑成功!');
            this.multiEditDialog = false;
            console.log(this.multiform)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
    },
    editAll() {
        const selectedRows = this.multipleSelection;  
        if (selectedRows.length < 2) { 
            this.$message.error('请至少选择两行数据进行批量编辑！');  
            return;  
        }  
        // 假设我们比较 'name' 和 'value' 字段  
        const fieldsToCheck = ['language', 'iscopy','datatype','booksource'];  
        let allEqual = true;  
        // 获取第一行的数据作为基准  
        const firstRow = selectedRows[0];  
        // 遍历其他行进行比较  
        for (let i = 1; i < selectedRows.length; i++) {  
            const currentRow = selectedRows[i];  
            for (const field of fieldsToCheck) {  
                if (firstRow[field] !== currentRow[field]) {  
                    allEqual = false;  
                    break;  
                }  
            }  
            // 如果在内部循环中设置了 allEqual 为 false，则无需继续检查其他字段或行  
            if (!allEqual) break;  
        }  
        if (allEqual) {  
            this.multiEditDialog = true;  
            this.multiform = this.multipleSelection[0]
        } else {  
            this.$message.error('请选择一致的数据进行批量编辑！');  
        }  
    },  
    handleSelectionChange(val) {
        this.multipleSelection = val;
        
    },
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
            this.multidialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    multiupload(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('上传成功!');
            this.resetForm(formName)
            this.multidialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    multiuploadreset(formName){
        this.$refs[formName].resetFields();
        this.multidialogFormVisible = false;
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
    ::v-deep .my-dialog {
        border-radius: 10px !important;
        // background-color: rgba(2,59,83,1);
    }
    ::v-deep .el-dialog__header {
        background-color: rgba(1,84,120,1);
        padding: 10px !important;
        span{
            color: white !important;
            padding-bottom: 10px;
        }
        .el-dialog__headerbtn{
            top: 15px;
            font-size: 20px;
        }
    }
</style>
  
  