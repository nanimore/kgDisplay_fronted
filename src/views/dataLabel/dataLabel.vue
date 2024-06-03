<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item>
                <el-button type="primary" @click="dialogFormVisible = true">领取数据</el-button>
            </el-form-item>
            <el-form-item label="状态" style="margin-left: 10px;" prop="docStatus">
                <el-radio-group v-model="queryParams.docStatus" fill="#008080" @input="handleQuery()">
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
                    <span :class="getStatusClass(item.status)" class="status">{{ getStatusText(item.status) }}</span>
                    <span>{{item.title}}</span>
                    <span class="typeclass">{{item.dataType}}</span>
                </div>
                <div class="newsFather " style="font-size: 12px !important;">
                    <span class="adminclass" :class="{ hidden: item.isAdminAssign==0 }">管理员分配</span>
                    <span>{{item.source}}</span>
                    <span>采集时间：{{item.createTime}}</span>
                    <span>分配时间：{{item.assignTime}}</span>
                    <span>发布时间：{{item.publishTime}}</span>
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
import { labelNewsList,getinitDocType,getInitDocCategory } from "@/api/datalabel/label";
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
  },
  data() {
    return {
        initDocTypeList:[],
        pageStatus:1,
        initDocCategory:[],
        queryParams: {
            keyword: '',
            distributiontime:[],
            dataType:'',
            docType:'',
            publishtime:[],
            docStatus:1
        },
        labelPosition:'right',
        dialogFormVisible: false,
        newDataList:
        [{status:1,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:1,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:2,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:0,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:3,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:1,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:4,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:0,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:5,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:0,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:6,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:0,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'},
        {status:7,title:'亚特兰大级轻型巡洋舰',dataType:'舰船',isAdminAssign:0,source:'武器百科',createTime:'2019-10-06   00:00:00',assignTime:'2019-10-06   00:00:00',publishTime:'2019-10-06   00:00:00'}
        ],
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
    resetQuery(){
        this.resetForm("queryParams")
        this.handleQuery()
    },
    handleQuery(){
        let disstartDate ='';
        let disendDate = '';
        let pubstartDate = ''
        let pubendDate = ''
        if(this.queryParams.distributiontime.length === 2){
            disstartDate = this.formatDate(this.queryParams.distributiontime[0]);
            disendDate = this.formatDate(this.queryParams.distributiontime[1]);
        }
        if(this.queryParams.publishtime.length === 2){
            pubstartDate = this.queryParams.publishtime[0];
            pubendDate = this.queryParams.publishtime[1];
        }
        const params = {
          docType: this.queryParams.docType,
          dataType: this.queryParams.dataType,
          keyword:this.queryParams.keyword,
          docStatus:this.queryParams.docStatus,
          createTimeStart:disstartDate,
          createTimeEnd:disendDate,
          publishTimeStart:pubstartDate,
          publishTimeEnd:pubendDate,
          pageStatus:1,
          page:this.currentPage,
          size:this.pageSize
        };
        labelNewsList(params).then(res => {
            console.log(res)
        });
    },
    handleSizeChange(pageSize){
        this.pageSize = pageSize
        this.handleQuery()
    },
    handleCurrentChange(currentpage){
        this.currentPage = currentpage
        this.handleQuery()
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
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
</style>
  
  