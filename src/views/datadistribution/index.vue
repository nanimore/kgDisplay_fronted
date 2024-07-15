<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryParams" :inline="true">
          <el-form-item label="分配状态" style="margin-left: 10px;" prop="docStatus" v-if="isDropData">
              <el-radio-group v-model="queryParams.docStatus" fill="#008080" @input="onselectChange()">
                  <el-radio-button label="0" >未分配</el-radio-button>
                  <el-radio-button label="1" >已分配</el-radio-button>
              </el-radio-group>
          </el-form-item>
          <div class="break-line-div" v-if="isDropData"></div>
          <el-form-item label="数据源类型" prop="docType">
              <el-select v-model="queryParams.docType" placeholder="请选择" style="width: 150px;" @change="handleDataSourceTypeChange()">
                  <el-option v-for="item in initDocTypeList" :label="item" :value="item" :key="item"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="数据源名称" prop="datasourceName">
              <el-select v-model="queryParams.datasourceName" placeholder="请选择" style="width: 150px;">
                  <el-option v-for="item in initDocNameList" :label="item" :value="item" :key="item"></el-option>
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
          <el-form-item label="关键词检索" prop="keyword">
              <el-input v-model="queryParams.keyword" placeholder="请输入"/>
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
          <el-form-item label="丢弃人" prop="proofreader1" v-if="!isDropData">
            <el-select v-model="queryParams.proofreader1" placeholder="请选择" style="width: 150px;">
                <el-option v-for="item in userList" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="handleQuery()">检索</el-button>
              <el-button  @click="resetQuery()" class="resetbutton">重置</el-button>
          </el-form-item>
          <el-form-item label="标注人" prop="proofreader">
            <el-select v-model="queryParams.proofreader" placeholder="请选择" style="width: 150px;">
                <el-option v-for="item in userList" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="queryParams.docStatus == 0" @click="handleAssign" type="primary" style="background-color: #00BFBF;">分配数据</el-button>
            <el-button v-else @click="handleAssignCancel" type="primary" style="background-color: #00BFBF;">取消分配</el-button>
          </el-form-item>
        </el-form>
        <div style="text-align: right;color: white;">全选<input type="checkbox" v-model="selectAllChecked" @change="toggleSelectAll" style="cursor: pointer;padding-top: 3px;"/></div> 
        <div class="newListContainer">
            <div v-for="(item,index) in newDataList" :key="index" style="border-bottom: 1px dashed #548aa2;margin-bottom: 20px;">
                <div class="newsFather" >
                    <span style="width: 10px;margin-right: 10px;display: inline-block;">{{ index+1 }}</span>
                    <span style="margin-right: 10px;"><input type="checkbox" :value="item" v-model="selectedNews" style="display: inline-block;cursor: pointer;" /></span>
                    <span :class="getStatusClass(item.docStatus)" class="status">{{ getStatusText(item.docStatus) }}</span>
                    <span style="cursor: pointer;" @click="goToNewsDetail(item)">{{item.title}}</span>
                    <span class="typeclass" v-if="item.dataType">{{item.dataType}}</span>
                </div>
                <div class="newsFather" style="font-size: 12px !important;">
                    <span class="adminclass" v-if="item.isAdminAssign && pageStatus!=4" :class="{ hidden: item.isAdminAssign==0 }">管理员分配</span>
                    <span><a :href="item.url" style="color:#02A7F0;">{{ item.datasourceName }}</a></span>
                    <span v-if="item.createTime">采集时间：{{item.createTime}}</span>
                    <span v-if="item.assignTime && queryParams.docStatus==1">分配时间：{{item.assignTime}}</span>
                    <span v-if="item.publishTime">发布时间：{{item.publishTime}}</span>
                    <span v-if="item.proofreader && queryParams.docStatus==1">标注人：{{item.proofreader}}</span>
                    <span v-if="item.proofreader && pageStatus==4" style="color: red;">丢弃人：{{item.proofreader}}</span>
                    <img src="../../assets/images/u1782.svg" alt="" @click="deleteArticle(item)" style="width:15px;height: 15px;cursor: pointer;margin-left: 20px;">
                </div>
            </div>
            <div class="block" style="margin-top: 30px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40, 60, 80, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
  
<script>
import { labelNewsList,getinitDocType,getInitDocCategory,getInitDatasourceName,getInitProofreaders,assignArticle,cancelAssignArticle,deleteArticle } from "@/api/datalabel/label";
export default {
  props:['params'],
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
    getInitProofreaders().then(res=>{
        this.userList = res.data
    })

  },
  mounted(){
    console.log(this.params)
    if(this.params){
        if(this.params.itemTitles=='丢弃数据'){
        this.isDropData = false
        this.pageStatus = 4
        }else{
            if(this.params.itemTitles=='相似数据'){
                if(this.params.itemTitles == '全部'){
                    this.queryParams.dataType = ''
                }else{
                    this.queryParams.dataType = this.params.itemTitles
                }
            }else{
                this.queryParams.docType = this.params.parentTitles
                if(this.params.itemTitles == '全部'){
                    this.queryParams.dataType = ''
                }else{
                    this.queryParams.dataType = this.params.itemTitles
                }
            } 
        }
        let params = {
            docType:this.params.parentTitles
        }
        getInitDatasourceName(params).then(res=>{
            this.initDocNameList = res.data
        })
    }
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
        pageStatus:2,
        initDocCategory:[],
        form:{
            docType:'',
            worknum:'',
            dataType:''
        },
        assignStatus:0,
        userList:[],
        selectedNews: [],  
        isAllSelected: false,
        isDropData:true,
        rules: {
        docType: [
            { required: true, message: '请选择数据源类型'},
          ],
          worknum: [
            { required: true, message: '请选择数据类型'},
          ],
          dataType: [
            { required: true, message: '请输入任务数量'},
            ]
        },
        initDocNameList:[],
        selectAllChecked:false,
        queryParams: {
            keyword: '',
            distributiontime:[],
            dataType:'',
            docType:'',
            datasourceName:'',
            publishtime:[],
            docStatus:0,
            createTime:[],
            proofreader:'',
            proofreader1:''
        },
        labelPosition:'right',
        newDataList:[],
        currentPage: 1,
        pageSize: 10,
        totalNum: 100,
    };
  },
  methods: {
    handleDataSourceTypeChange(){
        let params = {
            docType:this.queryParams.docType
        }
        getInitDatasourceName(params).then(res=>{
            this.initDocNameList = res.data
        })
    },
    getStatusClass(status) {
      return {
        'status-8': status === 0,
        'status-9': status === 1,
      };
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return '未分配';
        case 1:
          return '已分配';
        default:
          return '';
      }
    },
    goToNewsDetail(item){
        let params = item
        this.$router.push({name:'detail',params:{params}});
        // Cookies.set('newListParams',JSON.stringify(this.queryParams))
    },
    resetQuery(){
        this.resetForm("queryParams")
        this.handleQuery()
    },
    toggleSelectAll() {
      if (this.selectAllChecked) {
        this.selectedNews = [...this.newDataList];
      } else {
        this.selectedNews = [];
      }
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
        let proofreaderTemp
        if(this.queryParams.docStatus==0){
            proofreaderTemp=''
        }else{
            proofreaderTemp = this.queryParams.proofreader1 ||this.queryParams.proofreader
        }
        const params = {
          docType: this.queryParams.docType,
          datasourceName: this.queryParams.datasourceName,
          dataType: this.queryParams.dataType,
          keyword:this.queryParams.keyword,
          docStatus:this.queryParams.docStatus,
          assignTimeStart:disstartDate,
          assignTimeEnd:disendDate,
          createTimeStart:createstartDate,
          createTimeEnd:createendtDate,
          publishTimeStart:pubstartDate,
          publishTimeEnd:pubendDate,
          pageStatus:this.pageStatus,
          page:currentPageTemp,
          size:pagesizeTemp,
          proofreader:proofreaderTemp
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
        this.currentPage = 1
        this.pageSize = 10
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
    deleteArticle(item){
        let deleteParams = {
        docId:item.articleId,
        docStatus:item.docStatus,
        docType:item.docType,
        uuid:item.articleId
      }
      this.$confirm('是否删除该新闻?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteArticle(deleteParams).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              setTimeout(() => {
              this.handleQuery()
            }, 1000);
            }
          })
        });
    },
    handleAssign() {
        if(this.queryParams.proofreader){
            if(this.selectedNews.length == 0){
                this.$message.error('请选择需要分配的新闻！')
            }else{
                let newArray = this.selectedNews.map(item => ({ docId: item.articleId, docType: item.docType, docStatus:item.docStatus,dataType:item.dataType,uuid:item.articleId }));  
                let params = {
                    proofreader:this.queryParams.proofreader,
                    articleReqList:newArray,
                }
                assignArticle(params).then(res=>{
                    this.$message.success('分配成功！')
                    this.assignStatus = 1
                    setTimeout(() => {
                        this.handleQuery()
                        this.selectedNews =[]
                    }, 2000);
                })
                
            }
        }else{
            this.$message.error('请选择标注人员！')
        }
        
    },
    handleAssignCancel(){
        if(this.selectedNews.length == 0){
                this.$message.error('请选择需要取消分配的新闻！')
            }else{
                let newArray = this.selectedNews.map(item => ({ docId: item.articleId, docType: item.docType, docStatus:item.docStatus,dataType:item.dataType,uuid:item.articleId }));  
                let params = {
                    articleReqList:newArray
                }
                cancelAssignArticle(params).then(res=>{
                    this.$message.success('取消分配成功！')
                    setTimeout(() => {
                        this.handleQuery()
                        this.selectedNews =[]
                    }, 2000);
                })
                
        }
    }
  },
  watch:{
    selectedNews(newVal) {
      this.selectAllChecked = newVal.length === this.newDataList.length;
    }
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
        display: flex;
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
  
  