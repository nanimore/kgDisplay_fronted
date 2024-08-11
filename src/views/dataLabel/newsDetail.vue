<template>
    <div class="newListDetailContainer">
      <el-dialog :visible.sync="imageDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog :title="isEditEntityName1?'添加实例':'编辑实例'" :visible.sync="dialogFormVisible"	:modal="false" v-draggable center :close-on-click-modal="false" width="35%" custom-class="my-dialog">
        <el-dialog
          width="30%"
          title="名称规范示例"
          :visible.sync="innerVisible"
          center
          append-to-body>
          <span style="color: red;">如果要添加的实例名称不在以下规范中，请点击<a style="text-decoration: underline;margin-left: 5px;">新规范</a></span>
          <p>{{ this.regularText }}</p>
        </el-dialog>
            <el-form :model="addEntityForm" ref="addEntityForm" :rules="rules" :label-position="labelPosition" label-width="100px">
                <el-form-item :label="selfdefine?'自定义类型:':'实例类型:'" prop="entityType" v-if="isEditEntityName1">
                  <el-select v-if="!selfdefine" v-model="addEntityForm.entityType" filterable placeholder="请选择实例类型" style="width: 300px;">
                    <el-option
                            v-for="group in addEntityTypeList"
                            :key="group.index"
                            v-if="group.children==null"
                            :label="group.name"
                            :value="group.name"
                        ></el-option>
                        <el-option-group
                            v-for="group in addEntityTypeList"
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
                  <el-input v-else v-model="addEntityForm.entityType" placeholder="请输入内容" style="width: 300px;"></el-input>
                  <span @click="changeSelfDefine()" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">自定义类型</span>
                </el-form-item>
                <el-form-item label="实例类型:" v-else style="color: white;">
                  {{ nowlabelEntityType }}
                </el-form-item>
                <el-form-item label="实例名称:" prop="entityName">
                    <el-select v-model="addEntityForm.entityName" allow-create filterable remote :remote-method="remoteMethod" placeholder="请选择实例名称" style="width: 300px;">
                        <el-option v-for="item in entityNameList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span @click="getNameRegualation()" v-show="!selfdefine" style="color: #FFFF00;margin-left: 15px;cursor: pointer;font-size: 12px;">名称规范示例</span>
                </el-form-item>
                <el-form-item label="文本:" prop="text" style="margin-bottom: 0;">
                    <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelecting()">
                    <el-input v-model="addEntityForm.text" style="width: 275px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click="submitForm('addEntityForm')" style="background-color: rgba(0,191,191,1);">立即提交</el-button>
            </div>
        </el-dialog>
        <div class="newDetail">
          <div class="newsTitle">
            <div class="newsTitleContent">
              <span :class="getStatusClass(passageDetail.docStatus)" class="status">{{ getStatusText(passageDetail.docStatus) }}</span>
              <span class="passageTitle">{{ passageDetail.title }}</span>
            </div>
            <div class="newsTitleContent1" style="margin-bottom: 5px;font-size: 12px;height: 35px;line-height: 35px;">
              <span><a :href="passageDetail.url" style="color:#02A7F0;margin-right: 30px;">{{passageDetail.datasourceName}}</a></span>
              <span style="color: #6498BB;">{{ passageDetail.createTime }}</span>
              <span class="newsTitleContentright">
                <el-input v-model="searchQuery" @input="highlightText" placeholder="" style="width: 150px;" prefix-icon="el-icon-search"></el-input>  
                <el-button type="primary" size="mini" @click="dropOutPassage()" style="margin-left: 30px;">丢弃</el-button>
              </span>
            </div>
          </div>
          <div class="newsContent" v-html="highlightedContent"></div>
        </div>
        <div class="entityDetail" v-if="isDetail">
          <div class="entityTitle">
            <el-button type="primary" style="background-color: #03afb0;" v-loading.fullscreen.lock="fullscreenLoading" @click="extractText()" >抽取文本</el-button>
            <img src='../../assets/images/u1890.svg' @click="back()" style="width: 30px;height: 30px;float: right;cursor: pointer;"></img>
          </div>
          <div class="addEntity" @click="addEntity('addEntityForm')"><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span>添加实例</span></div>
          <div class="entityListContainer">
            <ul class="entityList" >
              <li v-for="item in extractData" :key="item.id" style="display: flex;justify-content: space-between;">
                <span class="entityListLeftContainer">
                  <span>{{ item.entityName }}</span>
                  <span class="entityListLabel" v-if="item.isSaveProp">已经保存属性</span>
                  <span class="entityListLabel" v-if="item.isSaveRel">已经保存关系</span>
                  <span style="color: #95F204;" v-if="item.isCustomNorm">新规范</span>
                  <span style="color:#D9001B;" v-for="data in item.extractOrigin" @click="aliasFindHighLight()">{{ data }}</span>
                </span>
                <span class="entityListRightContainer" v-if="item.isCustomOntoType">
                  <span style="color: #F59A23;">[ 自定义类型 ]</span>
                  <span style="color: white;border-radius: 15px;padding:0 6px;background-color:#bfbf00;">{{ item.entityType }}</span>
                  <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity(item)">
                </span>
                <span class="entityListRightContainer" v-else>
                  <span style="color: #02A7F0;" :class="{ 'text-with-star': item.propontoModify }" @click="enterProp(item)">实例属性</span>
                  <span style="color: #00bfbf;" :class="{ 'text-with-star': item.relontoModify }" @click="enterRel(item)">实例关系</span>
                  <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity(item)">
                </span>
              </li>
            </ul>
          </div>
          <div class="entityDetailFooter" v-if="extractData && extractData.length > 0">
            <el-button type="primary" style="background-color: #03afb0;margin-right: 30px;"  @click="submitReview()" >提交审核</el-button>
            <el-button type="primary"  @click="back()" >返回</el-button>
          </div>
        </div>
        <div class="entityDetail" v-else>
          <div class="entityDetailInnerTitle">
            <span class="entityLabel">实例名称: <span style="color: white;font-weight: 500">{{ nowlabelEntityName }}</span></span>
            <span class="entityLabel">实例类型: <span style="color: white;font-weight: 500;">{{ nowlabelEntityType}}</span></span>
            <el-button type="primary" size="mini" @click="isEditEntityName()">修改实例名称/文本</el-button>
            <span style="float: right;display: flex;align-items: center;margin-top: 3px;">
              <img src="../../assets/images/u1782.svg" alt="" @click="dropEntity()" style="width:20px;height: 20px;cursor: pointer;margin-right: 10px;">
              <img src='../../assets/images/u1890.svg' @click="backToEntityList()" style="width:20px;height: 20px;cursor: pointer;"></img>
            </span>
          </div>
          <el-tabs class="entityDetailInnerContent" v-model="activeName" style="margin-top: 10px;color: #02A7F0;">
            <el-tab-pane label="实例属性" name="first">
                <div class="addSelfProp" @click="addSelfProp()" ><img src="../../assets/images/u1895.svg" style="width: 15px;height: 15px;margin-right: 8px;"></img><span style="cursor: pointer;">自定义属性</span></div>
                <div style="height: 62vh;overflow-y: auto;">
                <div v-if="formVisible">
                  <el-form :model="selfDefinePropForm" class="selfDefinePropForm" label-width="60px">
                    <el-form-item :label="item.label" v-for="item in selfDefinePropForm.items" :key="item.label">
                      <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getSelectedText(item.id)">
                      <el-input v-model="item.value" style="margin-right: 20px;"></el-input>
                      <span v-if="item.id==0">
                        <el-button type="primary" size="mini"  style="background-color: #00BFBF;text-align: center;margin-right: 20px;">添加别名</el-button>
                        <span class="selfDefinePropFormSpan"  @click="removeForm()">暂存</span>
                        <span class="selfDefinePropFormSpan" @click="removeForm()">取消</span>
                        <span class="selfDefinePropFormSpan" @click="removeForm()">清除</span>
                      </span>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-for="(form, index) in propForm" :key="form.index">
                  <div v-if="form.editing">
                    <el-form :model="form" ref="form" class="propFormClass" label-width="80px">
                      <div v-if="form.dataType === 'PICTURE'">
                        <el-form-item :label="form.name">
                            <el-upload
                              action="http://localhost:8081/proofread/uploadImg"
                              list-type="picture-card"
                              :on-preview="handlePictureCardPreview"
                              :on-remove="handleRemove" 
                              :on-success="(response, file, fileList) => handleSuccess(response, file, fileList, index)"
                              :file-list="form.fileList"
                              style="display: inline-block;margin-left: 20px;"
                              >
                              <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                      </div>
                      <div v-else>
                        <el-form-item :label="form.name" style="position: relative;">
                          <div v-for="(item,indexAlisa) in form.propertyAlias" :key="indexAlisa" style="color: #F59A23;font-size: 12px;position: absolute;left: -60px;top: -20px;">
                            <span @click="aliasSearchFunction(item)" style="cursor: pointer;">{{ item }}</span>
                          </div>
                          <div v-for="(form1,index1) in form.propertyValueList" :key="'form1-' + index1">
                            <el-form :model="form1" ref="form1" class="propFormClass">
                                  <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedTextObject(index,index1)">
                                  <el-input v-model="form1.object" style="width: 150px;display: inline-block;"></el-input>
                                  <el-select v-if="form.unit.length && !form1.isCustomUnit" v-model="form1.chosenUnit" style="width: 85px;margin-left: 15px;" size="mini"> 
                                      <el-option v-for="item in form.unit" :key="item" :label="item" :value="item"></el-option>
                                  </el-select>
                                  <el-input v-if="form.unit.length && form1.isCustomUnit" v-model="form1.chosenUnit" style="width: 85px;display: inline-block;margin-left: 15px;"></el-input>
                                  <el-button v-if="form.unit.length && !form1.isCustomUnit" type="primary" size="mini"  style="background-color: #F59A23; border-color: #F59A23; text-align: center;margin-left: 10px;" @click="form1.isCustomUnit = true">自定义单位</el-button>
                                  <el-button v-if="form.unit.length && form1.isCustomUnit" type="primary" size="mini"  style="background-color: #F59A23;border-color: #F59A23;text-align: center;margin-left: 10px;" @click="form1.isCustomUnit = false">取消</el-button>
                                  <el-button v-if="index1==0" type="primary" size="mini"  style="background-color: #169BD5;text-align: center;margin-left: 10px;" @click="addPropFormValueItem(index)">添加值</el-button>
                                  <el-button v-if="index1==0" type="primary" size="mini"  style="background-color: #00BFBF;text-align: center;margin-left: 10px;" @click="addFormValueAliasInput(index)">添加别名</el-button>
                                  <span v-if="index1==0" @click="saveTripletPropValueList(index)" style="cursor:pointer;margin-left: 10px;color: #D7D7D7;font-size: 14px;">暂存</span>
                                  <span v-if="index1==0" @click="cancelEditPropFunction(index)" style="cursor:pointer;margin-left: 10px;color: #D7D7D7;font-size: 14px;">取消</span>
                                  <span v-if="index1==0" @click="clearEditPropFunction(index)" style="cursor:pointer;margin-left: 10px;color: #D7D7D7;font-size: 14px;">清除</span>
                              <el-form-item>
                                <label @click="handleTextLabelClick(index,index1)" style="display: inline-block;margin-right: 10px;cursor: pointer;color: white;">文本</label>
                                <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedText(index,index1)">
                                <el-input v-model="form1.tripleText" style="width: 250px;"></el-input>
                              </el-form-item>
                              <el-form-item>
                                <label style="display: inline-block;margin-right: 10px;cursor: pointer;color: white;">备注</label>
                                <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedTextComment(index,index1)">
                                <el-input v-model="form1.comment" style="width: 250px;"></el-input>
                              </el-form-item>
                            </el-form>
                          </div>
                          <div v-for="(aliasform,index4) in form.propertyAlias" :key="'aliasform-' + index4">
                            <label style="display: inline-block;margin-right: 10px;cursor: pointer;color: white;">属性别名</label>
                            <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedTextAlias(index,index4)">
                            <el-input v-model="form.propertyAlias[index4]" style="width: 250px;"></el-input>
                            <!-- <span @click="addPropFormValueListAlias(index,index4)" style="cursor:pointer;margin-left: 10px;color: #D7D7D7;font-size: 14px;">添加</span> -->
                            <span @click="deletePropFormValueListAlias(index,index4)" style="cursor:pointer;margin-left: 10px;color: #D7D7D7;font-size: 14px;">删除</span>
                          </div>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                  <div v-else>
                    <el-form :model="form" ref="form" class="propFormClass">
                      <div v-if="form.dataType !== 'PICTURE'">
                        <div v-if="form.propertyValueList.length">
                          <div v-for="(form2,index2) in form.propertyValueList" :key="index2">
                            <el-form :model="form2" ref="form" class="propFormClass">
                              <el-form-item style="position: relative">
                                <div v-for="(item,indexalisa1) in form.propertyAlias" :key="indexalisa1" style="color: #F59A23;font-size: 12px;position: absolute;left: 40px;top: -20px;z-index: 1111;">
                                  <span @click="aliasSearchFunction(item)" style="cursor: pointer;">{{ item }}</span>
                                </div>
                                <label v-if="index2 == 0" @click="handleCustomLabelClick(index)" style="width: 70px;text-align: right;display: inline-block;margin-right: 35px;cursor: pointer;">{{form.name}}</label>
                                <label v-if="index2 != 0" @click="handleCustomLabelClick(index)" style="width: 70px;text-align: right;display: inline-block;margin-right: 35px;cursor: pointer;"></label>
                                <span v-if="form.propertyValueList" style="margin-right: 15px" :class="getStatusClass2(index)">{{form2.object}}</span>
                                <span v-if="form.propertyValueList && form.isEnsure == 0 && form.isExtract && index2 == 0" style="cursor: pointer;" @click="propConfirmFunction(index)">[确定]</span>
                                <span v-if="form.propertyValueList && form.isEnsure == 1 && form.isExtract && index2 == 0" style="cursor: pointer;color:#FFFF00" @click="propCancelFunction(index)">[取消]</span>
                                <span v-if="form.propertyValueList && form.missingText && form.isExtract && index2 == 0" style="color:#C280FF;margin-left:15px">[待填写文本]</span>
                              </el-form-item>
                              <el-form-item>
                                <label @click="handleTextLabelClick(index,index2)" style="width: 70px;text-align: right;display: inline-block;margin-right: 10px;cursor: pointer;color: white;">文本</label>
                                <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedText(index,index2)">
                                <el-input v-model="form2.tripleText" style="width: 250px;" :disabled="form.isEnsure == 1" :class="getStatusClass3(index)"></el-input>
                              </el-form-item>
                            </el-form> 
                          </div>
                        </div>
                          <div v-else>
                            <el-form-item>
                                <label  @click="handleCustomLabelClick(index)" style="width: 70px;text-align: right;display: inline-block;margin-right: 35px;cursor: pointer;">{{form.name}}</label>
                              </el-form-item>
                              <el-form-item>
                                <label  @click="handleTextLabelClickSingle(index)" style="width: 70px;text-align: right;display: inline-block;margin-right: 10px;cursor: pointer;color: white;">文本</label>
                                <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="getPropListSelectedTextSingle(index)">
                                <el-input v-model="form.tripleText" style="width: 250px;" :disabled="form.isEnsure == 1" :class="getStatusClass3(index)"></el-input>
                              </el-form-item>
                          </div>
                      </div>
                      <div v-else>
                        <el-form-item>
                          <label  @click="handleCustomLabelClick(index)" style="width: 70px;text-align: right;display: inline-block;margin-right: 35px;cursor: pointer;">{{form.name}}</label>
                          <el-image 
                            style="width: 100px; height: 100px"
                            v-for="url in form.imageList" 
                            :key="url"
                            :src="url" 
                            :preview-src-list="imageList">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>
                        </el-form-item>
                      </div>
                    </el-form> 
                  </div>
                </div>
              </div>
              <div style="text-align: center;padding: 10px 0;padding-bottom: 0;">
                <el-button type="primary" size="mini" style="background-color: #00BFBF;" @click="saveAllPropertie()">保存全部属性</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实例关系" name="second">
              <div class="addRelClass">
                <span class="addRelClassContainer" @click="addEntity('addEntityForm')"><img src="../../assets/images/u3832.svg" class="addClass">添加实例</span>
                <span class="addRelClassContainer" @click="addrelForm()" style="margin-left: 20px;"><img src="../../assets/images/u3832.svg" class="addClass">添加关系</span>
              </div>
              <div style="height: 62vh;overflow-y: auto;">
                <div v-for="(form, index) in relforms" :key="form.index" style="border-bottom: 1px solid #aaaaaa;">
                  <div v-if="form.editing">
                    <el-form :model="form" label-width="90px" ref="form" class="relform">
                      <el-row>
                        <el-col :span="14" >
                          <el-form-item label="头实例名称">
                            <span v-if="form.isChangeSort" style="color: #FFFF00;">{{ nowlabelEntityName }}</span>
                            <el-select v-else v-model="form.entityName1" allow-create filterable remote :remote-method="remoteMethodEntityList" placeholder="请选择实例名称" style="width: 100%;" @change="nowremoteIndex = index">
                                <el-option v-for="item in form.entityNameListbyRel" :key="item" :label="item" :value="item"></el-option>
                            </el-select>  
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <el-input v-model="form.entity1num" style="width: 100px;"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="自定义关系" v-if="form.isSelfDefinedRel">
                            <el-input v-model="form.relation" style="width:  100%;"></el-input>
                          </el-form-item>
                          <el-form-item label="关系名称" v-else>
                            <el-select v-model="form.relation" filterable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in relNameList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>   
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <div v-if="form.isSelfDefinedRel" style="color:#F59A23;font-weight: 700;margin-top: 7px;margin-left: 15px;cursor: pointer;font-size: 14px;" @click="cancelChangeRelType(index)" >取消</div>
                          <div v-else style="color:#F59A23;font-weight: 700;margin-top: 7px;margin-left: 15px;cursor: pointer;font-size: 14px;" @click="changeRelType(index)" >自定义关系</div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="尾实例名称">
                            <el-select v-if="form.isChangeSort" v-model="form.entityName1" remote :remote-method="remoteMethodEntityList" allow-create filterable placeholder="请选择实例名称" style="width: 100%;" @focus="nowremoteIndex = index">
                                <el-option v-for="item in form.entityNameListbyRel" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                            <span v-else style="color: #FFFF00;">{{ nowlabelEntityName }}</span>                  
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <el-input v-model="form.entity2num" style="width: 100px;"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                          <el-col :span="14">
                            <el-form-item label="备注" class="teshu">
                              <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelectingRelNote(index)">
                              <el-input v-model="form.note" style="width: 90%;"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <span v-if="form.editing" style="color: yellow;cursor: pointer;margin-left: 15px;" @click="resetRelform(index)">还原</span>
                          </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="文本" class="teshu">
                            <img src="../../assets/images/u1933.svg" style="width: 15px;height: 15px;cursor: pointer;margin-right: 10px;" @click="startSelectingRelText(index)">
                            <el-input v-model="form.text" style="width: 90%"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <div>
                            <span v-if="form.editing" style="color: red;cursor: pointer;margin-left: 15px;" @click="clearRelform(index)">清除</span>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="editrelForm(index)" v-if="!form.editing">编辑</el-button>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="saveForm(index)" v-if="form.editing">暂存</el-button>
                            <el-button type="primary" style="background-color: #aaaaaa;margin-right: 10px;margin-left: 15px;" @click="getRelListFunction(nowEditEntityId)" v-if="form.editing">取消</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                  <div v-else>
                    <el-form :model="form" label-width="90px">
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="头实例名称">
                            <div v-if="form.isChangeSort" :class="getStatusClass1(index)">{{ nowlabelEntityName }}</div>
                            <div v-else :class="getStatusClass1(index)"> {{ form.entityName1 }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <div :class="getStatusClass1(index)"> {{ form.entity1num }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="关系名称">
                            <div :class="getStatusClass1(index)"> {{ form.relation }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="尾实例名称">
                            <div v-if="form.isChangeSort" :class="getStatusClass1(index)"> {{ form.entityName1 }}</div>
                            <div v-else :class="getStatusClass1(index)">{{ nowlabelEntityName }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item label="数量">
                            <div :class="getStatusClass1(index)"> {{ form.entity2num }}</div>            
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14">
                          <el-form-item label="文本" class="teshu">
                            <div :class="getStatusClass1(index)"> {{ form.text }}</div>            
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <div>
                            <span v-if="form.isAbstact&&form.isqueding == 0" style="color: yellow;cursor: pointer;margin-left: 15px;" @click="quedingFunction(index)">确定</span>
                            <span v-if="form.isAbstact&&form.isqueding == 1" style="color: red;cursor: pointer;margin-left: 15px;" @click="cancelFunction(index)">取消</span>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="editrelForm(index)" v-if="!form.editing">编辑</el-button>
                            <el-button type="primary" style="background-color: #03afb0;margin-right: 10px;margin-left: 15px;" @click="saveForm(index)" v-if="form.editing">暂存</el-button>
                            <el-button type="primary" style="background-color: #aaaaaa;margin-right: 10px;margin-left: 15px;" @click="getRelListFunction(nowEditEntityId)" v-if="form.editing">取消</el-button>
                            <el-button type="danger" style="margin-right: 10px;margin-left: 15px;" @click="deleteEntityRel(index)">删除</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </div>
              </div>
              <div style="text-align: center;padding: 10px 0;padding-bottom: 0;">
                <el-button type="primary" size="mini" style="background-color: #00BFBF;" @click="saveAllRelation()">保存全部关系</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

    </div>
</template>

<script>
import { annotationFistPage,getEntityList,getRelList,discard,confirmOrCancel,saveTriplets,saveAllRelations,getEntityNameByEntityType,deleteEntity,getPropList,saveAllProperties,chineseAnnotation,getAllLeafEntityTypes,similarInstanceNames,addInstance,getRelationByEntityType,getEntityByRelation } from "@/api/datalabel/label";
import { getAllEntityType } from "@/api/index";
export default {
  props:['params'],
  name: "newsDetail",
  created(){
    let annotationFistPageParams = {
      docId:this.params.articleId,
      docPhase:this.params.docPhase,
      docType:this.params.docType
    }
    annotationFistPage(annotationFistPageParams).then(res=>{
      this.passageDetail = res.data
      this.highlightText()
    })
    this.getEntityListFunction()
    this.getAllEntityType()
  },
  data() {
    return {
        extractData:[],
        fullscreenLoading: false,
        form:{},
        formItems:[],
        propForm:{},
        relforms:[],
        imageDialogVisible:false,
        nowremoteIndex:0,
        isDetail:true,
        passageDetail:{},
        dialogFormVisible:false,
        selfdefine:false,
        addEntityTypeList:[],
        relNameList:[],
        relFormTemp:[],
        addEntityForm:{
          entityType:'',
          entityName:'',
          text:''
        },
        propFormDataTemp:[],
        dialogImageUrl:'',
        disabled:false,
        nowEditEntityId:'',
        relform: {}, // 用于存储表单数据的对象  
        entityNameList:[],
        entityTypeList:[],
        activeName: 'first',
        formVisible:false,
        isEditEntityName1:true,
        searchQuery: '',
        highlightedContent: '',  
        regularText:'规范1',
        nowhuaciPropIndexInner:'',
        innerVisible:false,
        labelPosition:'right',
        nowlabelEntityName:'',
        nowlabelEntityType:'',
        nowhuaciPropIndex:'',
        nowhuaciIndex:'',
        selfDefinePropForm:{
          items: [
          { id:0,label: '属性名', value: '' },
          { id:1,label: '属性值', value: '' },
          { id:2,label: '单位', value: '' },
          { id:3,label: '备注', value: '' },
          { id:4,label: '文本', value: '' },
        ]
        },
        rules: {
          entityType: [
            { required: true, message: '请选择实例类型'},
          ],
          entityName: [
            { required: true, message: '请选择实例名称'},
          ],
          text: [
            { required: true, message: '请输入文本'},
          ],
        },
    };
  },
  methods: {
    extractText(){
      this.fullscreenLoading = true;
      chineseAnnotation(this.passageDetail).then(res=>{
        this.passageDetail = res.data
        this.highlightText()
        this.getEntityListFunction()
        this.fullscreenLoading = false;
      })
    },
    addSelfProp(){
      this.formVisible = true;
    },
    removeForm() {
      this.formVisible = false;
    },
    getAllEntityType(){
      getAllEntityType().then(res=>{
        this.entityTypeList = res.data
      })
      getAllLeafEntityTypes().then(res=>{
        this.addEntityTypeList = res.data
      })
    },
    addrelForm() {
      this.relforms.push({
        entityName1: '',
        relation: '',
        text:'',
        note:'',
        editing: true,
        entity2num:0,
        entity1num:0,
        isSelfDefinedRel:false,
        isAbstact:false,
        isqueding:0,
        entityNameListbyRel:[],
        isChangeSort:true,
      });
    },
    saveForm(index) {
      // 假设这里有一个API接口保存表单数据
      // axios.post('/api/forms', form).then(() => {
      //   this.$set(this.forms, index, { ...form, editing: false });
      // });
      console.log(this.relforms[index].isqueding)
      if(this.relforms[index].entityName1==''||this.relforms[index].relation==''||this.relforms[index].text==''){
        this.$message.error("关系名称、尾实例名称、文本不能为空！")
        return false
      }
      let idTemp
      if(this.relforms[index].id){
        idTemp = this.relforms[index].id
      }else{
        idTemp = ''
      }
      let params ={
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:[{
          id:idTemp,
          comment:this.relforms[index].note,
          object:this.relforms[index].entityName1,
          objectAmount:this.relforms[index].entity1num,
          predicate:this.relforms[index].relation,
          predicateType:2,
          isEnsure:this.relforms[index].isqueding,
          subjectAmount:this.relforms[index].entity2num,
          subject:this.nowlabelEntityName,
          tripleText:this.relforms[index].text
          }
        ]
      }
      saveTriplets(params).then(res=>{
        if(res.code == 200){
          this.getRelListFunction(this.nowEditEntityId)
        }
      })
    },
    editrelForm(index) {
      this.$set(this.relforms, index, { ...this.relforms[index], editing: true });
    },
    clearRelform(index){
      this.$set(this.relforms, index, { ...this.relforms[index], text: '', relation: '',note:'',entityName1:'',entity1num:0,entity2num:0 });
    },
    changeRelType(index){
      this.$set(this.relforms, index, { ...this.relforms[index], relation: '' });
      this.$set(this.relforms, index, { ...this.relforms[index], isSelfDefinedRel: true });
    },
    cancelChangeRelType(index){
      this.$set(this.relforms, index, { ...this.relforms[index], relation: '' });
      this.$set(this.relforms, index, { ...this.relforms[index], isSelfDefinedRel: false });
    },
    dropEntity(item){
      let id 
      if(this.nowEditEntityId){
        id = this.nowEditEntityId
      }else{
        id = item.uuid
      }
      let deleteEntityParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id
      }
      this.$confirm('是否删除该实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteEntity(deleteEntityParams).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.isDetail = true;
              this.getEntityListFunction()
            }
          })
        });
    },
    back(){
      sessionStorage.setItem('fromDetail', true);
      this.$router.back()
    },
    getEntityListFunction(){
      let getEntityListParams = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType
      }
      getEntityList(getEntityListParams).then(res => {
        this.extractData = res.data
      })
    },
    addEntity(formName){
      this.isEditEntityName1 = true
      delete this.addEntityForm.entityName
      delete this.addEntityForm.entityType
      this.entityNameList =[]
      this.dialogFormVisible = true
    },
    quedingFunction(index){
      let params ={
        idAndTextList:[{
          id:this.relforms[index].id,
          tripleText:this.relforms[index].text
        }
      ],
        isEnsure:1
      }
      confirmOrCancel(params).then(res=>{
        if(res.code == 200){
          this.$set(this.relforms, index, { ...this.relforms[index], isqueding: 1 });
        }
      })
    },
    cancelFunction(index){
      let params ={
        idAndTextList:[{
          id:this.relforms[index].id,
          tripleText:this.relforms[index].text
        }
      ],
        isEnsure:0
      }
      confirmOrCancel(params).then(res=>{
        if(res.code == 200){
          this.$set(this.relforms, index, { ...this.relforms[index], isqueding: 0 });
        }
      })
    },
    dropOutPassage(){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType
      }
      this.$confirm('是否丢弃该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          discard(params).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            setTimeout(() => {
              this.back()
            }, 1000);
          })
        });
    },
    startSelectingRelNote(index){
      this.nowhuaciIndex = index
      document.addEventListener('mouseup', this.handleTextSelectionRelNote);
    },
    handleTextSelectionRelNote(){
      const selectedText = window.getSelection().toString();
      console.log(selectedText)
      if (selectedText) {
        this.$set(this.relforms, this.nowhuaciIndex, { ...this.relforms[this.nowhuaciIndex], note: selectedText + ' ' });
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionRelNote);
    },
    startSelectingRelText(index){
      this.nowhuaciIndex = index
      document.addEventListener('mouseup', this.handleTextSelectionRelText);
    },
    handleTextSelectionRelText(){
      const selectedText = window.getSelection().toString();
      console.log(selectedText)
      if (selectedText) {
        this.$set(this.relforms, this.nowhuaciIndex, { ...this.relforms[this.nowhuaciIndex], text: selectedText + ' ' });
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionRelText);
    },
    startSelecting() {
      document.addEventListener('mouseup', this.handleTextSelection);
    },
    handleTextSelection() {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        this.addEntityForm.text += selectedText + ' ';
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelection);
    },
    getPropListSelectedText(index,index1){
      this.nowhuaciPropIndex = index
      this.nowhuaciPropIndexInner = index1
      document.addEventListener('mouseup', this.handleTextSelectionPropText);
    },
    getPropListSelectedTextComment(index,index1){
      this.nowhuaciPropIndex = index
      this.nowhuaciPropIndexInner = index1
      document.addEventListener('mouseup', this.handleTextSelectionPropTextComment);
    },
    getPropListSelectedTextObject(index,index1){
      this.nowhuaciPropIndex = index
      this.nowhuaciPropIndexInner = index1
      document.addEventListener('mouseup', this.handleTextSelectionPropTextObject);
    },
    getPropListSelectedTextSingle(index){
      this.nowhuaciPropIndex = index
      document.addEventListener('mouseup', this.handleTextSelectionPropTextSingle);
    },
    getPropListSelectedTextAlias(index,index1){
      this.nowhuaciPropIndex = index
      this.nowhuaciPropIndexInner = index1
      document.addEventListener('mouseup', this.handleTextSelectionPropAlias);
    },
    handleTextSelectionPropAlias(){
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        this.propForm[this.nowhuaciPropIndex].propertyAlias[this.nowhuaciPropIndexInner]= selectedText + ' ' ;
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionPropAlias);
      this.$forceUpdate()
    },
    handleTextSelectionPropTextSingle(){
      const selectedText = window.getSelection().toString();
      console.log(this.nowhuaciPropIndex,this.nowhuaciPropIndexInner)
      if (selectedText) {
        this.propForm[this.nowhuaciPropIndex].tripleText= selectedText + ' ' ;
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionPropTextSingle);
    }, 
    handleTextSelectionPropTextObject(){
      const selectedText = window.getSelection().toString();
      console.log(this.nowhuaciPropIndex,this.nowhuaciPropIndexInner)
      if (selectedText) {
        this.propForm[this.nowhuaciPropIndex].propertyValueList[this.nowhuaciPropIndexInner].object= selectedText + ' ' ;
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionPropTextObject);
    }, 
    handleTextSelectionPropTextComment(){
      const selectedText = window.getSelection().toString();
      console.log(this.nowhuaciPropIndex,this.nowhuaciPropIndexInner)
      if (selectedText) {
        this.propForm[this.nowhuaciPropIndex].propertyValueList[this.nowhuaciPropIndexInner].comment= selectedText + ' ' ;
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionPropTextComment);
    }, 
    handleTextSelectionPropText(){
      const selectedText = window.getSelection().toString();
      console.log(this.nowhuaciPropIndex,this.nowhuaciPropIndexInner)
      if (selectedText) {
        this.propForm[this.nowhuaciPropIndex].propertyValueList[this.nowhuaciPropIndexInner].tripleText= selectedText + ' ' ;
      }
          // 停止监听鼠标抬起事件
      document.removeEventListener('mouseup', this.handleTextSelectionPropText);
    },
    deletePropFormValueListAlias(index,index1){
      this.propForm[index].propertyAlias.splice(index1, 1)
    },
    remoteMethodEntityList(query){
      console.log(this.nowremoteIndex)
      let params = {
          entityType:this.nowlabelEntityType,
          relation:this.relforms[this.nowremoteIndex].relation,
          text: query
        }
        if (query !== '') {
            getEntityByRelation(params).then(res=>{
              console.log(res.data)
              this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], entityNameListbyRel: res.data.entityList });
              if(res.data.entityLocation == 0){
                this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], isChangeSort: true });
              }else{
                this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], isChangeSort: false });
              }
            })
        } else {
          this.$set(this.relforms, this.nowremoteIndex, { ...this.relforms[this.nowremoteIndex], entityNameListbyRel: [] });;
        }
    },
    enterProp(item){
      this.isDetail = false
      this.nowlabelEntityName = item.entityName
      this.nowlabelEntityType = item.entityType
      this.getEntityNameByEntityTypeFunction()
      this.getRelationByEntityTypeFunction()
      this.getPropListFunction(item.uuid)
      this.getRelListFunction(item.uuid)
      this.nowEditEntityId = item.uuid
      this.activeName = 'first'
    },
    enterRel(item){
      this.isDetail = false
      this.nowlabelEntityName = item.entityName
      this.nowlabelEntityType = item.entityType
      this.getEntityNameByEntityTypeFunction()
      this.getRelationByEntityTypeFunction()
      this.getPropListFunction(item.uuid)
      this.getRelListFunction(item.uuid)
      this.nowEditEntityId = item.uuid
      this.activeName = 'second'
    },
    getRelationByEntityTypeFunction(){
      let params = {
        entityType:this.nowlabelEntityType
      }
      getRelationByEntityType(params).then(res=>{
        this.relNameList = res.data
      })
    },
    deleteEntityRel(index){
      let params ={
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:[{
          id:this.relforms[index].id,
          comment:'',
          object:'',
          objectAmount:'',
          predicate:'',
          predicateType:2,
          isEnsure:0,
          subjectAmount:'',
          subject:'',
          tripleText:''
          }
        ]
      }
      this.$confirm('是否删除该实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveTriplets(params).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getRelListFunction(this.nowEditEntityId)
            }
          })
        });
    },
    propConfirmFunction(index){
      let params ={
        idAndTextList:[{
          id:this.propForm[index].propertyValueList[0].id,
          tripleText:this.propForm[index].propertyValueList[0].tripleText
        }],
        isEnsure:1
      }
      confirmOrCancel(params).then(res=>{
        if(res.code == 200){
          this.$set(this.propForm, index, { ...this.propForm[index], isEnsure: 1 });
          this.$set(this.propForm, index, { ...this.propForm[index], missingText: false });
        }
      })
    },
    propCancelFunction(index){
      let params ={
        idAndTextList:[{
          id:this.propForm[index].propertyValueList[0].id,
          tripleText:this.propForm[index].text
        }],
        isEnsure:0
      }
      confirmOrCancel(params).then(res=>{
        if(res.code == 200){
          this.$set(this.propForm, index, { ...this.propForm[index], isEnsure: 0 });
        }
      })
    },
    getRelListFunction(id){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id,
        dataType:this.nowlabelEntityType
      }
      let dataList = []
      getRelList(params).then(res=>{
          dataList = res.data
          this.relforms = []
          this.relFormTem = []
          dataList.forEach(item => {
            this.relforms.push({
              id: item.id,
              entityName1: item.object,
              relation: item.relationName,
              text:item.tripleText,
              note:item.comment,
              editing: false,
              entity2num:item.objectAmount,
              entity1num:item.subjectAmount,
              isSelfDefinedRel:item.isCustomRel,
              isAbstact:item.isExtract,
              isqueding:item.isEnsure,
              entityNameListbyRel:[],
              isChangeSort:true,
          });
          this.relFormTemp.push({
              id: item.id,
              entityName1: item.object,
              relation: item.relationName,
              text:item.tripleText,
              note:item.comment,
              editing: false,
              entity2num:item.objectAmount,
              entity1num:item.subjectAmount,
              isSelfDefinedRel:item.isCustomRel,
              isAbstact:item.isExtract,
              isqueding:item.isEnsure,
              entityNameListbyRel:[],
              isChangeSort:true,
          });
        });
      })
    },
    getPropListFunction(id){
      let params = {
        docId:this.params.articleId,
        docStatus:this.params.docStatus,
        docType:this.params.docType,
        uuid:id
      }
      let dataList = []
      getPropList(params).then(res=>{
          dataList = res.data
          this.propForm = []
          this.propForm = dataList.map(item => ({
              id: item.id,
              tripleText:'',
              editing: false,
              name:item.name,
              propertyValueList: item.propertyValueList !== null? item.propertyValueList:[],
              isEnsure:item.isEnsure,
              isExtract:item.isExtract,
              dataType:item.dataType,
              missingText:this.getMissingText(item),
              object:'',
              propertyAlias: item.propertyAlias !== null? item.propertyAlias:[],
              unit: item.unit !==null? item.unit:[],
              fileList:[]
          }));
          this.propFormDataTemp =JSON.parse(JSON.stringify(dataList.map(item => ({
              id: item.id,
              tripleText:'',
              editing: false,
              name:item.name,
              propertyValueList: item.propertyValueList !== null? item.propertyValueList:[],
              isEnsure:item.isEnsure,
              isExtract:item.isExtract,
              dataType:item.dataType,
              missingText:this.getMissingText(item),
              object:'',
              propertyAlias: item.propertyAlias !== null? item.propertyAlias:[]
          })))) 
      })
      console.log(this.propFormDataTemp)
    },
    submitForm(formName) {
      console.log(this.addEntityForm.entityName)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              Verify:{
                tripleText:this.addEntityForm.text,
                subject:this.addEntityForm.entityName,
                object:this.addEntityForm.entityType
              },
              EquipOrSplitReq:{
                id:this.passageDetail.id,
                docType:this.passageDetail.docType
              }
            }
            addInstance(params).then(res => {
              if(res.code == 200){
                this.$message.success('添加成功!');
                this.dialogFormVisible = false;
                this.resetForm(formName)
                this.getEntityListFunction()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    remoteMethod(query) {
        let params = {
          subject: query
        }
        if (query !== '') {
          setTimeout(() => {
            similarInstanceNames(params).then(res=>{
              this.entityNameList = res.data
            })
          }, 200);
        } else {
          this.entityNameList = [];
        }
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.imageDialogVisible = true;
    },
    handleSuccess(response, file, fileList, index) {
      this.propForm[index].fileList = fileList;
      let saveTripletReqListTemp = []
      this.propForm[index].propertyValueList.forEach(item => {
        saveTripletReqListTemp.push({
            object:response.data,
            predicate:this.propForm[index].name,
            predicateType:1,
            subject:this.nowlabelEntityName,
            tripleText:"PITCTUE"
          });
      })
      let params = {
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:saveTripletReqListTemp
      }
      saveTriplets(params).then(res=>{
        if(res.code == 200){
            this.$message.success('上传成功！')
        }
      })
    },
    getEntityNameByEntityTypeFunction(){
      let params = {
          entityType:this.nowlabelEntityType
        
      }
      getEntityNameByEntityType(params).then(res=>{
        this.entityNameList = res.data
      })
    },
    resetRelform(index){
      if(this.relFormTemp[index]){
        this.$set(this.relforms, index, { ...this.relforms[index], note:this.relFormTemp[index].note });
        this.$set(this.relforms, index, { ...this.relforms[index], text:this.relFormTemp[index].text });
        this.$set(this.relforms, index, { ...this.relforms[index], relation:this.relFormTemp[index].relation });
        this.$set(this.relforms, index, { ...this.relforms[index], entityName1:this.relFormTemp[index].entityName1 });
        this.$set(this.relforms, index, { ...this.relforms[index], entity1num:this.relFormTemp[index].entity1num });
        this.$set(this.relforms, index, { ...this.relforms[index], entity2num:this.relFormTemp[index].entity2num });
      }
    },
    getMissingText(item) {
      if(item.propertyValueList){
        return item.propertyValueList[0].missingText
      }else{
        return false
      }
    },
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
    getStatusClass1(index) {
      return {
        'relStatus-1': this.relforms[index].isqueding=== 1 && this.relforms[index].isAbstact == true,
        'relStatus-2': this.relforms[index].isqueding=== 0 && this.relforms[index].isAbstact == true,
        'relStatus-3': this.relforms[index].isAbstact == false,
        'relStatus-4': this.relforms[index].isqueding == 2 && this.relforms[index].isAbstact == true,
      };
    },
    clearEditPropFunction(index){
      console.log(this.propFormDataTemp[index])
        for(let i =0;i<this.propForm[index].propertyValueList.length;i++){
          this.$set(this.propForm[index].propertyValueList, i, { ...this.propForm[index].propertyValueList[i], object:'',tripleText:'',comment:'' });
        }
    },
    getStatusClass2(index) {
      return {
        'relStatus-1': this.propForm[index].isEnsure=== 1 && this.propForm[index].isExtract == true,
        'relStatus-2': this.propForm[index].isEnsure=== 0 && this.propForm[index].isExtract == true,
        'relStatus-3': this.propForm[index].isExtract == false,
        'relStatus-4': this.propForm[index].isEnsure == 2 && this.propForm[index].isExtract == true,
      };
    },
    getStatusClass3(index) {
      return {
        'relinputStatus-1': this.propForm[index].isEnsure=== 1 && this.propForm[index].isExtract == true,
        'relinputStatus-2': this.propForm[index].isEnsure=== 0 && this.propForm[index].isExtract == true,
        'relinputStatus-3': this.propForm[index].isExtract == false,
        'relinputStatus-4': this.propForm[index].isEnsure == 2 && this.propForm[index].isExtract == true,
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
    highlightText() {  
      if (!this.searchQuery) {  
        // 如果没有搜索内容，则显示原始文本  
        this.highlightedContent = this.passageDetail.content;
        return;  
      }  
      // 使用正则表达式替换匹配的文本  
      const regex = new RegExp(this.searchQuery, 'gi');  
      this.highlightedContent = this.passageDetail.content.replace(regex, '<span class="highlight">$&</span>');  
    },  
    changeSelfDefine(){
      delete this.addEntityForm.entityType;
      this.selfdefine = !this.selfdefine
    },
    getText(item){
      if(item.propertyValueList){
        return item.propertyValueList[0].tripleText
      }else{
        return ''
      }
    },
    getNameRegualation(){
      console.log(this.addEntityForm.entityType)
      console.log(this.nowlabelEntityType)
      if(this.addEntityForm.entityType){
        this.innerVisible =true
      }else{
        this.$message.error('请先选择实例类型！')
        return false
      }
    },
    addFormValueAliasInput(index) {
      this.$set(this.propForm[index].propertyAlias, this.propForm[index].propertyAlias.length, '');
    },
    aliasFindHighLight(data){
      this.searchQuery = data
      this.highlightText()
    },
    backToEntityList(){
      this.isDetail = true
      this.getEntityListFunction()
      this.nowEditEntityId = ''
      this.relforms = []
    },
    saveAllPropertie(){

    },
    handleRemove(file) {

    },
    saveAllRelation(){
      let saveTripletReqListTemp = []
      this.relforms.forEach(item => {
        saveTripletReqListTemp.push({
            id:item.id,
            comment:item.note,
            object:item.entityName1,
            objectAmount:item.entity1num,
            predicate:item.relation,
            predicateType:2,
            isEnsure:item.isqueding??'',
            subjectAmount:item.entity2num,
            subject:this.nowlabelEntityName,
            tripleText:item.text
          });
      })
      let params ={
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:saveTripletReqListTemp
      }
      saveAllRelations(params).then(res=>{
        if(res.code == 200){
          this.isDetail = true
          this.getEntityListFunction()
          this.nowEditEntityId = ''
        }
      })
    },
    saveTripletPropValueList(index){
      let saveTripletReqListTemp = []
      this.propForm[index].propertyValueList.forEach(item => {
        saveTripletReqListTemp.push({
            id:item.id,
            comment:item.comment,
            object:item.object,
            predicate:this.propForm[index].name,
            predicateType:1,
            isEnsure:this.propForm[index].isEnsure,
            subject:this.nowlabelEntityName,
            tripleText:item.tripleText,
            predicateAlias:this.propForm[index].propertyAlias,
            unit:item.chosenUnit
          });
      })
      let params = {
        docInfoReq:{
          docId:this.params.articleId,
          docStatus:this.params.docStatus,
          docType:this.params.docType,
          uuid:this.nowEditEntityId,
          dataType:this.nowlabelEntityType
        },
        saveTripletReqList:saveTripletReqListTemp
      }
      saveTriplets(params).then(res=>{
        if(res.code == 200){
          this.$set(this.propForm, index, { ...this.propForm[index], editing: false });
          for(let i =0;i<res.data.length;i++){
            this.$set(this.propForm[index].propertyValueList, i, { ...this.propForm[index].propertyValueList[i], id: res.data[i] });
          }  
        }
      })
    },
    isEditEntityName(){
      // getEntityNameByEntityType
      this.isEditEntityName1 = false
      this.addEntityForm.entityName = this.nowlabelEntityName
      this.dialogFormVisible =true
    },
    handleCustomLabelClick(index){
      this.$set(this.propForm, index, { ...this.propForm[index], editing: true });
      if (this.propForm[index].propertyValueList.length === 0) {
        this.propForm[index].propertyValueList.push({ object: '', tripleText: '',comment:'',isCustomUnit:false });
      }
    },
    addPropFormValueItem(index){
      this.propForm[index].propertyValueList.push({ object: '', tripleText: '',comment:'',isCustomUnit:false });
      this.$forceUpdate()
    },
    cancelEditPropFunction(index){
      if(this.propFormDataTemp[index].propertyValueList){
        this.$set(this.propForm, index, { ...this.propForm[index], propertyValueList:JSON.parse(JSON.stringify(this.propFormDataTemp[index].propertyValueList)) });
      }else{
        this.$set(this.propForm, index, { ...this.propForm[index], propertyValueList:[] });
      }
      this.$set(this.propForm, index, { ...this.propForm[index], editing: false });
    },
    handleTextLabelClick(index,index1){
      this.searchQuery = this.propForm[index].propertyValueList[index1].tripleText
      this.highlightText()
    },
    handleTextLabelClickSingle(index){
      this.searchQuery = this.propForm[index].tripleText
      this.highlightText()
    },
    aliasSearchFunction(text){
      this.searchQuery = text
      this.highlightText()
    },
    getSelectedText(index) {
      let selectedText = '';
      if (window.getSelection) {
        selectedText = window.getSelection().toString();
      } else if (document.selection && document.selection.type !== "Control") {
        selectedText = document.selection.createRange().text;
      }
      this.$set(this.selfDefinePropForm.items, index, {
        ...this.selfDefinePropForm.items[index],
        value: selectedText
      });
    }
  },
  computed: {
    
  },
};
</script>

<style lang="scss" scoped>
.entityListContainer{
  margin-top: 20px;
}
.entityList{
  color: #CECECE;
  list-style-type: none;
  padding-left: 0;
  font-size: 12px;
  max-height: 60vh;
  overflow-y: auto;
  li{
    border-bottom: 1px solid #cecece;
    padding-bottom: 5px;
    margin-bottom: 30px;
    .entityListRightContainer{
      display: flex;
      align-items: center;
      span{
        margin-right: 10px;
        cursor: pointer;
      }
      img {
        cursor: pointer;
      }
    }
  }
}
.entityListLeftContainer{
  display: flex;
  align-items: center;
}
.entityListLeftContainer span{
  margin-right: 10px;
}
.entityListLabel{
  color:#D9001B;
  border: 1px solid #D9001B;;
  border-radius: 15px;
  padding: 2px 5px;
}

.newListDetailContainer{
  display: flex;
  padding: 30px;
}
.newDetail{
  flex:1;
  border-radius: 20px;
  border: 1px solid rgba(129,211,248,1);
  height: 84vh;
  background-color: rgba(28,42,57,1);
  padding: 10px;
}
.entityDetail{
  flex:1;
  margin-left: 50px;
}
.entityTitle{
  padding: 15px 0;
}
.addEntity{
  color: #02a7f0;
  cursor: pointer;
  margin-top: 10px;
}
.newsTitle{
  border-bottom: 1px dashed #6498bb;
}
.newsTitleContent{
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
  width: 100%;
}
.newsTitleContent1{
  .newsTitleContentright{
    display: flex;
    align-items: center;
    float: right;
    .el-button--mini{
      padding: 5px 10px;
      font-size: 10px;
    }
  }
}
.passageTitle{
  font-size: 20px;
  color: white;
}
.newsContent{
  color: #CECECE;
  padding: 10px 0;
  height:71vh;
  overflow-y: scroll;
  font-size: 14px;
}

::v-deep .el-dialog{
  .el-form-item__label{
    color: #00FFFF;
    font-weight: 500;
  }
}
::v-deep .el-dialog__wrapper {
  pointer-events: none; /* 使el-dialog__wrapper不拦截鼠标事件 */
}
::v-deep .el-dialog {
  pointer-events: all; /* 确保el-dialog内部可以交互 */
  top: 15%;
}
::v-deep .highlight {  
  background-color: yellow;  
  color: black;
}
::v-deep .highlight {  
  background-color: yellow;  
}
::v-deep  .el-input__inner {
  height: 30px;
}
.entityDetailFooter{
  text-align: center;
}
.text-with-star {
    position: relative;
    display: inline-block;
}

.text-with-star::after {
    content: '★'; /* 星星符号 */
    color: red; /* 红色 */
    font-size: 7px; /* 调整星星的大小 */
    position: absolute;
    top: -5px; /* 调整星星的位置 */
    right: -5px; /* 调整星星的位置 */
}
.entityDetailInnerTitle{
  color: #02A7F0;
  font-weight: 700;
  border-top-left-radius: 15px;
  .entityLabel{
    margin-right: 15px;
  }
  margin-top: 15px;
}
::v-deep .el-tabs__nav{
  width: 100%;
  color: black;
}
::v-deep .el-tabs__item.is-active{
  background-color: #02A7F0;
  color: white;
  font-weight: 700;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
    background-color: #02A7F0;
    color: white;
    font-weight: 700;
}
::v-deep .el-tabs__item{
  width: 50%;
  text-align: center;
  font-size: 16px;
  background-color: rgba(195,195,197,1);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
::v-deep .el-tabs__active-bar{
  display: none;
}
::v-deep .selfDefinePropForm {
  .el-input{
    display: inline-block;
    width: 180px;
  }
  .selfDefinePropFormSpan{
    margin-right: 15px;
    cursor: pointer;
  }
}
.addRelClass{
  color: white;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  height: 20px;
  line-height: 20px;
}
.addRelClassContainer{
  display:flex;
  cursor: pointer;
}
.addClass{
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
::v-deep .el-form-item__label{
    color: #02A7F0;
}
::v-deep .teshu{
  .el-form-item__label{
    color: white !important;
    width: 70px !important;
  }
  .el-form-item__content{
    margin-left: 70px !important
  }
}
.relStatus-1{
  color: #95F204;
}
.relStatus-2{
  color: #FFFF00;
}
.relStatus-3{
  color: white;
}
.relStatus-4{
  color: #D9001B;
}
::v-deep .relinputStatus-1{
  .el-input__inner{
    color: #95F204;
    background-color: #111725;
  }
}
::v-deep .relinputStatus-2{
  .el-input__inner{
    color: #FFFF00;
    background-color: #111725;
  }
}
::v-deep .relinputStatus-3{
  .el-input__inner{
    color: white;
    background-color: #111725;
  }
}
::v-deep .relinputStatus-4{
  .el-input__inner{
    color: #D9001B;
    background-color: #111725;
  }
}
.propFormClass{
  .el-form-item{
    margin-bottom: 5px;
  }
}
::v-deep .el-upload-list--picture-card .el-upload-list__item{
  width: 70px;
  height: 70px;
}
::v-deep .el-upload--picture-card{
  width: 70px;
  height: 70px;
  line-height: 80px;
}
</style>