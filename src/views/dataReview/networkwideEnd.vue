<template>
    <div class="app-container">
        <el-dialog title="上传书籍" :visible.sync="dialogFormVisible" center :close-on-click-modal="false"  width="35%" custom-class="my-dialog">
            <el-form :model="form" ref="form" :rules="rules" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="选择文件">
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

        <el-dialog title="编辑" :visible.sync="entityEditSingleDialog" center :close-on-click-modal="false" width="35%" custom-class="my-dialog">
            <el-form :model="entityEditSingleForm" ref="entityEditSingleForm" :label-position="labelPosition"  label-width="140px">
                <el-form-item label="实例名称" prop="entityName">
                    <span style="margin-right: 20px;color: white">{{entityEditSingleForm.entityName}}</span>
                    <el-button type="primary" size="mini" style="background-color:rgba(0,191,191,1);">翻译</el-button>
                </el-form-item>
                <el-form-item label="对齐名称" prop="dqEntityName">
                    <el-input v-model="entityEditSingleForm.dqEntityName"></el-input>
                </el-form-item>
                <el-form-item label="实例类型" prop="name">
                    <span style="margin-right: 20px;color: white">{{entityEditSingleForm.entityType}}</span>
                    <el-button type="primary" size="mini" style="background-color:rgba(0,191,191,1);">翻译</el-button>
                </el-form-item>
                <el-form-item label="对齐类型" prop="dqEntityType">
                    <el-input v-model="entityEditSingleForm.dqEntityType"></el-input>
                </el-form-item>
                <el-form-item label="数据源名称" prop="dataSourceName">
                    <el-input v-model="entityEditSingleForm.dataSourceName"></el-input>
                </el-form-item>
                <el-form-item label="数据源网址" prop="dataSourceUrl">
                    <el-input v-model="entityEditSingleForm.dataSourceUrl"></el-input>
                </el-form-item>
                <el-form-item label="源网页快照">
                    <span v-if="entityEditSingleForm.dataSourceImage" style="color: #81D3F8;cursor:pointer">查看</span>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed">
                        <el-button type="primary" size="mini" style="background-color:#f59a23;border-color:#f59a23">上传快照</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="中文快照" style="margin-bottom: 0;">
                    <span v-if="entityEditSingleForm.chineseImage" style="color: #81D3F8;cursor:pointer">查看</span>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed">
                        <el-button type="primary" size="mini" style="background-color:#f59a23;border-color:#f59a23">上传快照</el-button>
                    </el-upload>                
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="editForm('entityEditSingleForm')">上传</el-button>
                <el-button @click="resetForm('entityEditSingleForm')">取 消</el-button>
            </div>
        </el-dialog>

        <el-form :model="queryParams" ref="queryParams" :inline="true">
            <el-form-item label="状态" prop="docStatus">
                <el-radio-group v-model="queryParams.docStatus" fill="#008080" @input="onselectChange()">
                    <el-radio-button label="1" >未对齐</el-radio-button>
                    <el-radio-button label="2" >已对齐</el-radio-button>
                </el-radio-group>            
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="queryParams.type" fill="#008080" @input="onselectChange()">
                    <el-radio-button label="1" >实例名称及类型</el-radio-button>
                    <el-radio-button label="2" >属性</el-radio-button>
                    <el-radio-button label="3" >关系</el-radio-button>
                </el-radio-group>            
            </el-form-item>
            <el-form-item label="本体修改状态" prop="btStatus">
                <el-select v-model="queryParams.btStatus" placeholder="请选择" style="width: 160px;">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select>
            </el-form-item>
            <div class="break-line-div"></div>
            <el-form-item label="对齐人" prop="person">
                <el-select v-model="queryParams.person" placeholder="请选择" style="width: 160px;">
                    <el-option label="蔡徐坤" value="蔡徐坤"></el-option>
                    <el-option label="刘秀磊" value="刘秀磊"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对齐时间" prop="time">
                <el-date-picker
                    v-model="queryParams.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" style="width: 280px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="实例名称" prop="entityName">
                <el-select v-model="queryParams.entityName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对齐实例名称" prop="dqentityName">
                <el-select v-model="queryParams.dqentityName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 1" label="实例类型" prop="entityType">
                <el-select v-model="queryParams.entityType" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 1 || queryParams.type == 2" label="对齐实例类型" prop="dqentityType">
                <el-select v-model="queryParams.dqentityType" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 3" label="对齐头实例名称" prop="dqHeadentityName">
                <el-select v-model="queryParams.dqHeadentityName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 3" label="对齐头实例类型" prop="dqHeadentityType">
                <el-select v-model="queryParams.dqHeadentityType" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 3" label="尾实例名称" prop="endentityName">
                <el-select v-model="queryParams.endentityName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 3" label="对齐尾实例名称" prop="dqendentityName">
                <el-select v-model="queryParams.dqendentityName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryParams.type == 3" label="对齐尾实例类型" prop="dqendentityType">
                <el-select v-model="queryParams.dqendentityType" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryParams.type == 2" label="属性名称" prop="propertyName">
                <el-select v-model="queryParams.propertyName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryParams.type == 2" label="对齐单位" prop="dqunit">
                <el-select v-model="queryParams.dqunit" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryParams.type == 2" label="对齐属性名称" prop="dqpropertyName">
                <el-select v-model="queryParams.dqpropertyName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryParams.type == 3" label="关系名称" prop="relationName">
                <el-select v-model="queryParams.relationName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="queryParams.type == 3" label="对齐关系名称" prop="dqrelationName">
                <el-select v-model="queryParams.dqrelationName" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据源名称" prop="dataSourceName">
                <el-select v-model="queryParams.dataSourceName" placeholder="请选择" style="width: 160px;"> 
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据源网址" prop="dataSourceUrl">
                <el-select v-model="queryParams.dataSourceUrl" placeholder="请选择" style="width: 160px;">
                    <el-option label="舰船" value="Jianchuan"></el-option>
                    <el-option label="飞行器" value="Feixingqi"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery()">检索</el-button>
                <el-button  @click="resetQuery()" class="resetbutton">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            v-show="queryParams.type == 1"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"
                align="center">
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="对齐状态"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dqStatus==1" class='redClass'>已对齐</span>
                        <span v-else class='greenClass'>未对齐</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="本体修改状态"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.btChangeStatus==1" class='redClass'>是</span>
                        <span v-else class='greenClass'>否</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="对齐人"
                    align="center"
                    prop="dqPeople"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="校对时间"
                    align="center"
                    width="150">
                </el-table-column>
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="entityName"
                    label="实例名称"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="对齐实例名称"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="entityType"
                    label="实例类型"
                    align="center"
                    width="100">
                </el-table-column> 
                <el-table-column
                    label="对齐实例类型"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityType}}</span>
                    </template>
                </el-table-column>       
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceName"
                    label="数据源"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceUrl"
                    label="数据源网址"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="源网页快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="kzUrl1"
                    label="中文快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>    
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClickDeleteAll()" type="danger" size="mini">批量删除</el-button>
                    <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofreadAll()" type="warning" size="mini">批量校对完成</el-button>
                    <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBaseAll()" type="warning" size="mini">批量入库</el-button>
                </template>
                <el-table-column
                    label="操作"
                    width="350"
                    align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClickEditSingleEntityFunciton(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button @click="handleClick(scope.row)" type="success" size="mini">本体修改</el-button>
                        <el-button @click="handleClickDelete(scope.row)" type="danger" size="mini">删除</el-button>
                        <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofread(scope.row)" type="warning" size="mini">校对完成</el-button>
                        <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBase(scope.row)" type="warning" size="mini">入库</el-button>
                    </template>
                </el-table-column> 
            </el-table-column>
        </el-table>
        <el-table
            v-show="queryParams.type == 2"
            :data="tableData"
            border>
            <el-table-column
                type="selection"
                width="55"
                align="center">
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="对齐状态"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dqStatus==1" class='redClass'>已对齐</span>
                        <span v-else class='greenClass'>未对齐</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="本体修改状态"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.btChangeStatus==1" class='redClass'>是</span>
                        <span v-else class='greenClass'>否</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="对齐人"
                    align="center"
                    prop="dqPeople"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="对齐时间"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="entityName"
                    label="实例名称"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="对齐实例名称"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="对齐实例类型"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityType}}</span>
                    </template>
                </el-table-column>  
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="propertyName"
                    label="属性名称"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="dqpropertyName"
                    label="对齐属性名称"
                    align="center"
                    width="100">
                </el-table-column>  
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="propertyValue"
                    label="属性值"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="dqpropertyValue"
                    label="对齐属性值"
                    align="center"
                    width="100">
                </el-table-column>  
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dqUnit"
                    label="对齐单位"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceName"
                    label="数据源"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceUrl"
                    label="数据源网址"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="源网页快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="kzUrl1"
                    label="中文快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>    
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClickDeleteAll()" type="danger" size="mini">批量删除</el-button>
                    <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofreadAll()" type="warning" size="mini">批量校对完成</el-button>
                    <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBaseAll()" type="warning" size="mini">批量入库</el-button>
                </template>
                <el-table-column
                    label="操作"
                    width="350"
                    align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button @click="handleClick(scope.row)" type="success" size="mini">本体修改</el-button>
                        <el-button @click="handleClickDelete(scope.row)" type="danger" size="mini">删除</el-button>
                        <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofread(scope.row)" type="warning" size="mini">校对完成</el-button>
                        <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBase(scope.row)" type="warning" size="mini">入库</el-button>
                    </template>
                </el-table-column> 
            </el-table-column>
        </el-table>
        <el-table
            v-show="queryParams.type == 3"
            :data="tableData"
            border>
            <el-table-column
                type="selection"
                width="55"
                align="center">
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="对齐状态"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dqStatus==1" class='redClass'>已对齐</span>
                        <span v-else class='greenClass'>未对齐</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="本体修改状态"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.btChangeStatus==1" class='redClass'>是</span>
                        <span v-else class='greenClass'>否</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="对齐人"
                    align="center"
                    prop="dqPeople"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="校对时间"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="entityName"
                    label="实例名称"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="对齐实例名称"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="对齐实例类型"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span class='redClass'>{{scope.row.dqEntityType}}</span>
                    </template>
                </el-table-column>  
                <el-table-column
                    prop="entityNum"
                    label="实例数量"
                    align="center"
                    width="100">
                </el-table-column> 
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="relationName"
                    label="关系名称"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="dqrelationName"
                    label="对齐关系名称"
                    align="center"
                    width="100">
                </el-table-column>  
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="endEntityName"
                    label="尾实例名称"
                    align="center"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="dqendEntityName"
                    label="对齐尾实例名称"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="dqendEntityType"
                    label="对齐尾实例类型"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="endEntityNum"
                    label="尾实例数量"
                    align="center"
                    width="100">
                </el-table-column>  
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceName"
                    label="数据源"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="mini">批量编辑</el-button>
                </template>
                <el-table-column
                    prop="dataSourceUrl"
                    label="数据源网址"
                    align="center"
                    width="120">
                </el-table-column>   
            </el-table-column>
            <el-table-column
                align="center">
                <el-table-column
                    label="源网页快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="kzUrl1"
                    label="中文快照"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.kzUrl" style="color: #81D3F8;cursor: pointer;">查看</span>
                    </template>
                </el-table-column>    
            </el-table-column>
            <el-table-column
                align="center">
                <template slot="header" slot-scope="scope">
                    <el-button @click="handleClickDeleteAll()" type="danger" size="mini">批量删除</el-button>
                    <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofreadAll()" type="warning" size="mini">批量校对完成</el-button>
                    <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBaseAll()" type="warning" size="mini">批量入库</el-button>
                </template>
                <el-table-column
                    label="操作"
                    width="350"
                    align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="primary" size="mini">编辑</el-button>
                        <el-button @click="handleClick(scope.row)" type="success" size="mini">本体修改</el-button>
                        <el-button @click="handleClickDelete(scope.row)" type="danger" size="mini">删除</el-button>
                        <el-button v-if="queryParams.docStatus == 1" @click="handleClickProofread(scope.row)" type="warning" size="mini">校对完成</el-button>
                        <el-button v-if="queryParams.docStatus == 2" @click="handleClickSaveDataBase(scope.row)" type="warning" size="mini">入库</el-button>
                    </template>
                </el-table-column> 
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
            time: '',
            docStatus:1,
            type:1,
            btStatus:'',
            dqentityName:'',
            entityName:'',
            entityType:'',
            dqentityType:'',
            dataSourceUrl:'',
            propertyName:'',
            dqpropertyName:'',
            relationName:'',
            dqrelationName:'',
            dqendentityType:'',
            dqendentityName:'',
            endentityName:'',
            dqHeadentityName:'',
            dqHeadentityType:'',
            dqunit:''
        },
        entityEditSingleDialog:false,
        labelPosition:'right',
        dialogFormVisible: false,
        editdialog:false,
        form: {
          name: '',
          language: '',
          iscopy:'',
          targettype:[]
        },
        entityEditSingleForm:{
            dqEntityName:'',
            entityName:'',
            dqEntityType:'',
            entityType:'',
            dataSourceName:'',
            dataSourceUrl:'',
            fileList1:[],
            fileList2:[]
        },
        multipleSelection:[],
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
          ]
        },
        tableData:[
            {dqStatus:0,btChangeStatus:0,dqPeople:'刘秀磊',time:'2022-10-2',entityName:'xxx舰船',dqEntityName:'xxxx舰船',entityType:'舰船',dqEntityType:"舰船"},
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
    onselectChange(){
        console.log(123)
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
    handleSelectionChange(val){
        this.multipleSelection = val;
    },
    handleClickDelete(data){
        console.log(data)
      this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //   deleteEntity(deleteEntityParams).then(res=>{
        //     if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
        //       this.isDetail = true;
        //       this.getEntityListFunction()
        //     }
        //   })
        });
    },
    handleClickDeleteAll(){
        if(this.multipleSelection.length>0){
            this.$confirm('是否批量删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //   deleteEntity(deleteEntityParams).then(res=>{
                //     if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    });
                //       this.isDetail = true;
                //       this.getEntityListFunction()
                //     }
                //   })
            });
        }else{
            this.$message.error("请选择需要批量删除的数据！")
        }
    },
    handleClickEditSingleEntityFunciton(data){
        this.entityEditSingleForm = data
        this.entityEditSingleDialog = true;
    },
    handleClickProofread(data){
        console.log(data)
      this.$confirm('是否校对完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //   deleteEntity(deleteEntityParams).then(res=>{
        //     if(res.code == 200){
              this.$message({
                type: 'success',
                message: '校对成功!',
              });
        //       this.isDetail = true;
        //       this.getEntityListFunction()
        //     }
        //   })
        });
    },
    handleClickSaveDataBase(data){
        console.log(data)
      this.$confirm('是否入库?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //   deleteEntity(deleteEntityParams).then(res=>{
        //     if(res.code == 200){
              this.$message({
                type: 'success',
                message: '入库成功!',
              });
        //       this.isDetail = true;
        //       this.getEntityListFunction()
        //     }
        //   })
        });
    },
    handleClickSaveDataBaseAll(){
        if(this.multipleSelection.length>0){
            this.$confirm('是否批量入库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //   deleteEntity(deleteEntityParams).then(res=>{
                //     if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '批量入库成功!',
                    });
                //       this.isDetail = true;
                //       this.getEntityListFunction()
                //     }
                //   })
            });
        }else{
            this.$message.error("请选择需要批量入库的数据！")
        }
    },
    handleClickProofreadAll(){
        if(this.multipleSelection.length>0){
            this.$confirm('是否批量校对完成?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                //   deleteEntity(deleteEntityParams).then(res=>{
                //     if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '批量校对完成!',
                    });
                //       this.isDetail = true;
                //       this.getEntityListFunction()
                //     }
                //   })
            });
        }else{
            this.$message.error("请选择需要批量校对的数据！")
        }
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
        this.entityEditSingleDialog = false
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
    .container {  
        display: flex; /* 启用Flexbox布局 */  
        justify-content: space-between; /* 两端对齐，这样span和button会分别靠向容器的两边 */  
        align-items: center; /* 垂直居中，这样span和button会在垂直方向上居中对齐（可选） */  
        /* 其他样式，如padding, margin等，根据需要添加 */  
    }
    .el-select{
        width: 100%;
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
    .redClass{
        color:#95F204;
    }
    .greenClass{
        color:#Ec808D;
    }
    ::v-deep .el-dialog__wrapper .el-form-item__label{
        color: #02A7F0
    }
</style>
  
  