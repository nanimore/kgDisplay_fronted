<template>
    <div class="app-container">
        <el-dialog title="领取数据" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="数据源类型" prop="docType">
                    <el-select v-model="form.docType" placeholder="请选择" filterable >
                        <el-option v-for="item in initDocTypeList" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据类型" prop="dataType">
                    <el-select v-model="form.dataType" placeholder="请选择"  filterable>
                        <el-option
                            v-for="group in initDocCategory"
                            :key="group.index"
                            v-if="group.children==null"
                            :label="group.name"
                            :value="group.name"
                        ></el-option>
                        <el-option-group
                            v-for="group in initDocCategory"
                            :key="group.name"
                            v-if="group.children"
                            :label="group.name"
                        >
                            <el-option
                            v-for="item in group.children"
                            :key="item"
                            :label="item"
                            :value="item"
                            ></el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务数量" prop="quantity" style="margin-bottom: 0;">
                    <el-input v-model="form.quantity" placeholder="请输入任务数量1-100"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('form')">立即提交</el-button>
            </div>
        </el-dialog>
        <el-form :model="queryParams" ref="queryParams" :inline="true">

            <el-form-item>
                <el-button type="primary" @click="dialogFormVisible = true">领取数据</el-button>
            </el-form-item>
            <el-form-item label="状态" style="margin-left: 10px;" prop="docStatus">
                <el-radio-group v-model="queryParams.docStatus" fill="#008080" @input="onselectChange()">
                    <el-radio-button label="1" >未标注</el-radio-button>
                    <el-radio-button label="2" >已标注</el-radio-button>
                    <el-radio-button label="3" >未通过</el-radio-button>
                    <el-radio-button label="4" >已通过</el-radio-button>
                    <el-radio-button label="5" >已返工</el-radio-button>
                    <el-radio-button label="6" >待审核</el-radio-button>
                    <el-radio-button label="7" >待补充</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <div class="break-line-div"></div>
            <el-form-item label="数据源类型" prop="docType">
                <el-select v-model="queryParams.docType" placeholder="请选择" style="width: 150px;">
                    <el-option v-for="item in initDocTypeList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章类别" prop="dataType">
                <el-select v-model="queryParams.dataType" placeholder="请选择" style="width: 150px;">
                    <el-option
                        v-for="group in initDocCategory"
                        :key="group.index"
                        v-if="group.children==null"
                        :label="group.name"
                        :value="group.name"
                    ></el-option>
                    <el-option-group
                        v-for="group in initDocCategory"
                        :key="group.name"
                        v-if="group.children"
                        :label="group.name"
                    >
                        <el-option
                        v-for="item in group.children"
                        :key="item"
                        :label="item"
                        :value="item"
                        ></el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="采集时间" prop="createTime">
                <el-date-picker
                    v-model="queryParams.createTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 250px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="分配时间" prop="distributiontime">
                <el-date-picker
                    v-model="queryParams.distributiontime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 250px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="发布时间" prop="publishtime">
                <el-date-picker
                    v-model="queryParams.publishtime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 250px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字" prop="keyword">
                <el-input v-model="queryParams.keyword" placeholder="请输入实例名称"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery()">检索</el-button>
                <el-button  @click="resetQuery()" class="resetbutton">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="newListContainer">
            <div v-for="(item,index) in newDataList" :key="index" style="border-bottom: 1px dashed black;margin-bottom: 10px;">
                <div class="newsFather" >
                    <span :class="getStatusClass(item.docStatus)" class="status">{{ getStatusText(item.docStatus) }}</span>
                    <span style="cursor: pointer;" @click="goToNewsDetail(item)">{{item.title}}</span>
                    <span class="typeclass" v-if="item.dataType">{{item.dataType}}</span>
                </div>
                <div class="newsFather " style="font-size: 12px !important;">
                    <span class="adminclass" v-if="item.isAdminAssign" :class="{ hidden: item.isAdminAssign==0 }">管理员分配</span>
                    <span><a :href="item.url" style="color:#02A7F0;">{{ item.datasourceName }}</a></span>
                    <span v-if="item.createTime">采集时间：{{item.createTime}}</span>
                    <span v-if="item.assignTime">分配时间：{{item.assignTime}}</span>
                    <span v-if="item.publishTime">发布时间：{{item.publishTime}}</span>
                    <span v-if="item.submitTime && queryParams.docStatus != 1 && queryParams.docStatus != 2">标注时间：{{item.submitTime }}</span>
                    <span v-if="item.reviewTime && queryParams.docStatus != 1 && queryParams.docStatus != 2">审核时间：{{item.reviewTime}}</span>
                </div>
            </div>
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
    </div>
</template>
  
<script>
import { labelNewsList,getinitDocType,getInitDocCategory,pullData } from "@/api/datalabel/label";
export default {
  name: "dataLabel",
  created(){
    let params ={
        pageStatus:this.pageStatus
    }
    getinitDocType(params).then(res=>{
        this.initDocTypeList = res.data
    })
    getInitDocCategory(params).then(res=>{
        this.initDocCategory = res.data
    })
    // if(Cookies.get("newListParams")){
    //     let keyword = Cookies.get("newListParams")
    //     this.queryParams = JSON.parse(keyword)
    // }
  },
  mounted(){
    const savedSearchCriteria = sessionStorage.getItem('searchCriteria');
    if (sessionStorage.getItem('fromDetail') && savedSearchCriteria) {
      this.queryParams = JSON.parse(savedSearchCriteria);
      sessionStorage.removeItem('fromDetail'); // 重置状态
    }
    this.handleQuery()
  },
  data() {
    return {
        initDocTypeList:[],
        pageStatus:1,
        initDocCategory:[],
        form:{
            docType:'',
            quantity:'',
            dataType:''
        },
        rules: {
          docType: [
            { required: true, message: '请选择数据源类型'},
          ],
          dataType: [
            { required: true, message: '请选择数据类型'},
          ],
          quantity: [
            { required: true, message: '请输入任务数量'},
            ]
        },
        queryParams: {
            keyword: '',
            distributiontime:[],
            dataType:'',
            docType:'',
            publishtime:[],
            docStatus:1,
            createTime:[]
        },
        labelPosition:'right',
        dialogFormVisible: false,
        newDataList:[],
        currentPage: 1,
        pageSize: 10,
        totalNum: 100,
    };
  },
  methods: {
    getStatusClass(status) {
      return {
        'status-1': status === 1,
        'status-2': status === 2,
        'status-3': status === 3,
        'status-4': status === 4,
        'status-5': status === 5,
        'status-6': status === 6,
        'status-7': status === 7,
      };
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '未标注';
        case 2:
          return '已标注';
        case 3:
          return '未通过';
        case 4:
          return '已通过';
        case 5:
          return '已返工';
        case 6:
          return '待审核';
        case 7:
          return '待补充';
        default:
          return '';
      }
    },
    goToNewsDetail(item){
        let params = item
        this.$router.push({name:'newsDetail',params:{params}});
        // Cookies.set('newListParams',JSON.stringify(this.queryParams))
    },
    resetQuery(){
        this.resetForm("queryParams")
        this.handleQuery()
    },
    submitForm(formName){
        let params = {
            dataType:this.form.dataType,
            docType:this.form.docType,
            quantity:this.form.quantity
        }
        this.$refs[formName].validate((valid) => {
            if (valid) {
                pullData(params).then(res=>{
                 if(res.code == 200){
                    this.$message.success(res.data)
                    this.dialogFormVisible = false
                    setTimeout
                    this.handleQuery()
                 }
                })
            }
        })
    },
    handleQuery(pageSize,currentpage){
        let disstartDate ='';
        let disendDate = '';
        let pubstartDate = '';
        let pubendDate = '';
        let createstartDate = '';
        let createendtDate = '';
        if(this.queryParams.distributiontime.length === 2){
            disstartDate = this.formatDate(this.queryParams.distributiontime[0]);
            disendDate = this.formatDate(this.queryParams.distributiontime[1]);
        }
        if(this.queryParams.publishtime.length === 2){
            pubstartDate = this.formatDate(this.queryParams.publishtime[0]);
            pubendDate = this.formatDate(this.queryParams.publishtime[1]);
        }
        if(this.queryParams.createTime.length === 2){
            createstartDate = this.formatDate(this.queryParams.createTime[0]);
            createendtDate = this.formatDate(this.queryParams.createTime[1]);
        }
        let pagesizeTemp =this.pageSize
        let currentPageTemp = this.currentPage
        if(pageSize){
            pagesizeTemp = pageSize 
        }
        if(currentpage){
            currentPageTemp = currentpage
        }
        const params = {
          docType: this.queryParams.docType,
          dataType: this.queryParams.dataType,
          keyword:this.queryParams.keyword,
          docStatus:this.queryParams.docStatus,
          assignTimeStart:disstartDate,
          assignTimeEnd:disendDate,
          createTimeStart:createstartDate,
          createTimeEnd:createendtDate,
          publishTimeStart:pubstartDate,
          publishTimeEnd:pubendDate,
          pageStatus:0,
          page:currentPageTemp,
          size:pagesizeTemp
        };
        labelNewsList(params).then(res => {
            this.newDataList = res.data.docResList
            this.totalNum = res.data.totalCount
        });
        sessionStorage.setItem('searchCriteria', JSON.stringify(this.queryParams));
    },
    handleSizeChange(pageSize){
        this.handleQuery(pageSize,this.currentPage)
    },
    handleCurrentChange(currentpage){
        this.handleQuery(this.pageSize,currentpage)
    },
    onselectChange(){
        const specialFieldValue = this.queryParams.docStatus;
        this.$refs['queryParams'].resetFields();
        this.currentPage = 1
        this.pageSize = 10
        this.queryParams.docStatus = specialFieldValue
        this.handleQuery()
    },
    resetForm(formName) {
        const specialFieldValue = this.queryParams.docStatus;
        this.$refs[formName].resetFields();
        this.currentPage = 1
        this.pageSize = 10
        this.queryParams.docStatus = specialFieldValue
        this.handleQuery()
    },
    formatDate(date) {
      const d = new Date(date);
      const year = String(d.getFullYear());  // 获取年份的后两位
      const month = String(d.getMonth() + 1).padStart(2, '0');  // 获取月份，并补零
      const day = String(d.getDate()).padStart(2, '0');  // 获取日期，并补零
      const hours = String(d.getHours()).padStart(2, '0');  // 获取小时，并补零
      const minutes = String(d.getMinutes()).padStart(2, '0');  // 获取分钟，并补零
      const seconds = String(d.getSeconds()).padStart(2, '0');  // 获取秒，并补零
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  }
};
</script>
  
<style scoped lang="scss">
    .app-container {
        padding: 25px;
        font-size: 14px;
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
    .el-radio-button{
        margin-right: 15px;
    }
    ::v-deep .el-radio-button__inner{
        border: 1px solid #DCDFE6;
        border-radius: 3px !important;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner{
        background-color: #008080;
    }
    .breakline::after {
        content: "";
        display: block;
        width: 100%;
    }
    // ::v-deep .el-form-item__label{
    //     color: white !important;
    // }
    .newsFather{
        span{
            margin-right: 20px;
        }
        margin-bottom: 10px;
    }
    .typeclass{
        padding: 3px 10px;
        border-radius: 15px;
        background-color: #f59a23;
    }
    .adminclass{
        font-size: 12px !important;
        background-color: red;
        padding: 3px 5px;
        border-radius: 15px;
    }
    .hidden {
        visibility: hidden;
    }
    ::v-deep .el-select-group{
        padding-left: 15px
    }
    .newListContainer{
        color: white;
        padding: 0 30px;
    }
</style>
  
  