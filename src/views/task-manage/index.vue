<template>
  <div class="task">
    <div class="task-list">
      <div class="task-top">
        <div class="task-title">
          <div class="line"></div>
          <div>项目列表</div>
        </div>
        <div class="task-operation">
          <el-input ref="search" suffix="ios-search" placeholder="请输入搜索内容" style="margin: 0 10px; width: auto;" :search="true" @on-search="taskSearch"/>
          <el-button size="large" type="primary" @click="showAlltaskHandler" v-show="isShowAlltask">显示全部</el-button>
          <span>|</span>
          <el-button size="large" type="primary" @click="taskModal = true" style="margin: 0 10px;">新建</el-button>
          <el-button size="large" type="primary" @click="delHandler" :disabled="!checkedTask.length">删除</el-button>
        </div>
      </div>

      <div class="table-content">
                    <!-- :gridOptions = 'gridOptions'  -->
          <!-- :enableBrowserTooltips='true' -->
          <!-- :columnVisible = 'hideColum' -->
          <!-- @gridReady = 'onGridReady' -->
        <ag-grid-vue style='width: 100%; height:360px ' class='ag-grid ag-theme-material'
          enableColResize
          enableFilter
          rowDeselection
          rowMultiSelectWithClick
          suppressRowClickSelection
          suppressToolPanel
          suppressColumnVirtualisation
          suppressCopyRowsToClipboard
          toolPanelSuppressPivotMode
          toolPanelSuppressPivots
          toolPanelSuppressRowGroups
          toolPanelSuppressSideButtons
          toolPanelSuppressValues
          showToolPanel 
          headerHeight = "40"
          rowHeight = "40"
          rowSelection = 'multiple'
          :columnDefs = 'taskInfo'
          :rowData = 'taskData'    

          @selectionChanged = 'rowSelected'
          @cellClicked = 'cellClicked'
          @rowDoubleClicked = 'showSlidePanel'
          >
        </ag-grid-vue>
        <!-- <el-table 
          border 
          stripe
          height="600"
          ref="taskInfo"
          :loading="isLoading"
          :data="taskInfoData"
          :highlight-row="true"
          @on-selection-change="getChecked"
          @on-row-dblclick='goDetail($event)'>
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column><el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column><el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
        </el-table> -->
        <el-pagination 
          :total="pageData.total" 
          @pageChange="pageChange" 
          @pageSizeChange="pageSizeChange" 
          style="margin: 10px 0;text-align:right;"></el-pagination>

      </div>
    </div>
    <!-- 任务弹框 -->
    <el-dialog 
      :visible.sync="taskModal"
      status-icon
      width="50%"
      :title="isedit ? '修改任务' : '新建任务'">
      <el-form 
        ref="taskDetailForm" 
        label-position="left" 
        label-width=100
        :model="taskDetailForm" 
        :rules="taskDetailRules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目编号:" prop="id">
              <el-input v-model.number="taskDetailForm.id" placeholder="请输入项目编号" :disabled="isedit"></el-input>
            </el-form-item>
          </el-col>
                    
          <el-col :span="12">
            <el-form-item label="项目名称:" prop="name">
              <el-input v-model="taskDetailForm.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="备注:">
              <el-input v-model="taskDetailForm.remark" type="textarea" :autosize="{minRows: 10,maxRows: 20}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogClose">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        </div>
    </el-dialog>
    
  </div>
</template>
<script>
import {
  validTaskid,
  validTaskname,
} from "@/api/task";
// import Pagination from "@/components/Pagination.vue";
import { mapGetters } from "vuex";
import { constants } from 'fs';
// function timeFormatter(params) {
//   console.log(new Date(params.value),this)
//   return this.$util(new Date(params.value), "YYYY-MM-DD HH:mm:ss")
// }
export default {
  name: "taskManagement",
  data() {
    const validateId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('项目编号不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        validTaskid().then(response => {
          // console.log('validTaskid',response)
          if (response && response.some(id => id == value)) {
            callback(new Error('项目编号不能重复'));
          } else {
            callback();
          }
        })
      }
    };
    const validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("项目名称不能为空"));
      } else {
        validTaskname().then(response => {
          // console.log('validTaskname',response)
          if (response && response.some(name => name == value)) {
            callback(new Error('项目名称不能重复'));
          } else {
            callback();
          }
        })
      }
    };
    return {
      taskInfo: [
        {
          headerName: "序号",
          editable: false,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          headerCheckboxSelection: true,
          checkboxSelection: true
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "项目编号",
          editable: false,
          field: "id"
          // menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "项目名称",
          editable: false,
          field: "name",
          // menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建日期",
          editable: false,
          field: "createTime",
          // menuTabs: ["columnsMenuTab"],
          valueFormatter: params => {
            return this.$util.parseJavaTime(
              new Date(params.value),
              "YYYY-MM-DD HH:mm:ss"
            );
          }
        },
        {
          headerName: "创建者",
          editable: false,
          field: "operator",
          // menuTabs: ["columnsMenuTab"],
        },
        {
          headerName: "协助专家",
          editable: false,
          field: "professor",
          // menuTabs: ["columnsMenuTab"],
          valueFormatter: params => { return params.value.length ? params.value.map(item => item.cnname).join("、") : "无" },
        },
        {
          headerName: "鉴定状态",
          editable: false,
          field: "status",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: params => { return params.value ? "已鉴定" : `未鉴定<a>去鉴定</a>` },
          cellStyle: params => { return { color: params.value ? "green" : "red" } },
        },
        {
          headerName: "送检语音",
          editable: false,
          field: "fileNum",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "备注",
          editable: false,
          field: "remark",
          menuTabs: ["columnsMenuTab"]
        }
      ],
      taskInfoData: [],
      pageData: {},
      current: 1,
      pageSize: 10,
      //用于过滤项目编号,名称
      filtVal: "",
      //用于过滤项目创建时间
      filtTime: "",
      //项目编号
      taskId: "",
      taskModal: false,
      isedit: false,
      //选中的任务
      checkedTask: [],
      //是否显示全部按钮的标志
      isShowAlltask: false,
      isLoading: false,
      //用于标记保存项目的按钮是新建,为真时则为修改
      ttype: false,
      taskDetailForm: {
        id: "",
        name: "",
        remark: "",
        age: ''
      },
      taskDetailRules: {
        name: [{ validator: validateName, trigger: "blur" }],
        id: [{ validator: validateId, trigger: "blur" }]
      }
    };
  },
  components: {
    // Pagination,
  },
  computed: {
    ...mapGetters(["taskData", "avatar", "device"]),
    isMultiple() {
      return !this.checkedTask.length;
    }
  },
  methods: {
    timeFormatter(params) {
      // this.$util.parseJavaTime(params.value, "YYYY-MM-DD HH:mm:ss")
      return;
    },
    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if (window.innerWidth < 1600) {
        this.Utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    rowSelected(v) {
      console.log(`------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      let arr = this.gridOptions.api.getSelectedRows();
      // console.log(this.gridOptions.api.getSelectedRows().length!=0)

      //edit
      arr.length === 1 ? (this.edit = false) : (this.edit = true);

      //train
      this.trainJudge(arr) ? (this.train = false) : (this.train = true);
      // arr.length === 1 ? this.train = false : this.train = true

      //offline
      this.offlineJudge(arr) ? (this.offline = false) : (this.offline = true);

      //online
      this.onlineJudge(arr) ? (this.online = false) : (this.online = true);

      //delete
      this.deleteJudge(arr) ? (this.mydelete = false) : (this.mydelete = true);

      this.selectArr = this.gridOptions.api.getSelectedRows();
    },
    cellClicked(e) {
      if (e.colDef.field == "onlineState") {
        this.gridOptions.api.deselectAll();
        e.node.setSelected(true);
        if (e.value) {
          this.confirmOffline();
        } else {
          this.confirmOnline();
        }
      }
    },
    showSlidePanel(e, uploadFlag) {
      // console.log('this.gridEvent:', this.gridEvent) // 神一样的存在
      console.log("e:", e);
      console.log("uploadFlag:", uploadFlag);

      if (uploadFlag) {
        e = this.gridEvent;
        // console.log('uploadFlag = true 时的 e/this.gridEvent:', e)
      }
      this.gridEvent = e;

      this.gridOptions.api.deselectAll();
      e.node.setSelected(true);

      this.SPEAKERID(e.data.id);
      this.$refs.compSlide.clickCloseBtn(true);

      let arr = ["root", "train", "raw"],
        tasks = [],
        speakerId = null;

      speakerId = e.data.id;
      getSingleSpeaker(speakerId)
        .then(res => {
          if (res.status === 200) {
            this.myMessage = []; // 先清空
            this.myMessage.push(
              { label: "raw", children: [] },
              { label: "train", children: [] }
            );
            let rawVoiceList = res.data.rawVoices,
              trainVoiceList = res.data.trainVoices;

            if (rawVoiceList) {
              rawVoiceList.map(el => {
                this.myMessage[0].children.push({
                  label: el.fileName,
                  value: el.id,
                  // sharepath: _train[k].sharepath,
                  localPath: el.url,
                  fileName: el.fileName,
                  format: el.format,
                  id: el.id,
                  fileType: 0
                });
              });
            }
            if (trainVoiceList) {
              trainVoiceList.map(el => {
                this.myMessage[1].children.push({
                  label: el.fileName,
                  value: el.id,
                  // sharepath: _train[k].sharepath,
                  localPath: el.url,
                  fileName: el.fileName,
                  format: el.format,
                  id: el.id,
                  fileType: 1
                });
              });
            }
          }
        })
        .catch(err => {
          console.error("getSingleSpeaker--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    goDetail({ id, status }) {
      this.$router.push({ path: `/taskNav/taskDetail` });
      this.$store.commit("saveTaskid", id);
      this.$store.commit("saveTaskStatus", status);
    },
    //获取项目信息列表
    getTaskData() {
      this.isLoading = true; //分页时会出现闪烁
      let params = Object.assign(
        {},
        {
          pageno: this.current,
          pagesize: this.pageSize,
          taskid: this.filtVal,
          time: this.filtTime
        }
      );
      get_task_data(params).then(res => {
        // console.log('get_task_data',res);
        this.taskInfoData = res.data;
        this.pageData = res.page;
        this.isLoading = false;
      });
    },
    //分页
    pageChange(index) {
      // console.log('index',index);
      this.current = index;
      this.getTaskData();
    },
    pageSizeChange(size) {
      // console.log('size',size);
      this.pageSize = size;
      this.getTaskData();
    },
    //项目搜索
    taskSearch(value) {
      // console.log('value',value);
      this.filtVal = value;
      this.isShowAlltask = true;
      this.getTaskData();
      this.$refs.search.currentValue = "";
      this.filtVal = "";
    },
    //搜索全部
    showAlltaskHandler() {
      this.isShowAlltask = false;
      this.getTaskData();
    },
    //获取选中的任务
    getChecked(val) {
      this.checkedTask = val;
    },
    getDelResult(id) {
      return new Promise(resolve => {
        del_task(id).then(res => {
          if (res.status) {
            resolve(res.status);
          }
        });
      });
    },
    //批量删除
    async delHandler() {
      let promises = this.checkedTask.map(item => this.getDelResult(item.id));
      let results = await Promise.all(promises);
      console.log("results", results);
      if (results.every(el => el === true)) {
        this.getTaskData();
      }
    },
    async dialogSubmit() {
      const { id, name, remark } = this.taskDetailForm;
      let params = this.$util.objectMerge({ id, name, remark }, { operator: this.$store.state.user.name })

      if (this.isedit) {
        //修改
        this.$refs["taskDetailForm"].validate(valid => {
          if (valid) {
            edit_task(params.id, params).then(res => {
              // console.log('edit_task',res);
              if (res.status) {
                this.$Message.info(res.msg);
                this.getTaskData();
                this.dialogClose();
              }
            });
          } else {
            this.$Message.error("请按要求填写表单！");
          }
        });
      } else {
        //新增
        //验证项目编号和名称
        // let result1 = await this.getValidateId(id);
        // let result2 = await this.getValidateName(name);
        let self = this;
        this.$refs["taskDetailForm"].validate(valid => {
            if (valid) {
              console.log('valid',params)
              // self.$store.dispatch("task/addTask",params)
              return
              // delete params.completiontime;
              add_items(params).then(res => {
                // console.log('add_items',res)
                if (res.status) {
                  this.$Message.info(res.msg);
                  this.getTaskData();
                  this.dialogClose();
                }
              });
            } else {
              this.$Message.error("请按要求填写表单！");
            }
          });
      }
    },
    dialogClose() {
      this.taskModal = false;
      this.dialogReset();
    },
    dialogReset() {
      this.isedit = false;
      this.taskDetailForm.id = "";
      this.taskDetailForm.name = "";
      this.taskDetailForm.remark = "";
    },
    getValidateId(id) {
      return new Promise(resolve => {
        task_id().then(res => {
          if (res.some(item => item === id)) {
            this.$Message.warning({ content: "项目编号已存在，请重新输入" });
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },
    getValidateName(name) {
      return new Promise(resolve => {
        task_name().then(res => {
          if (res.some(item => item === name)) {
            this.$Message.warning({ content: "项目名称已存在，请重新输入" });
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }
  },
  created() {
    // this.userid = this.$store.state.user_info.id;
    // this.getTaskData();
    const params = {
      pagesize: this.pageSize,
      pageno: this.current
    };
    this.$store
      .dispatch("task/getTask", params)
      .then(() => {
        // this.$router.push({ path: this.redirect || "/" });
        // this.loading = false;
      })
      .catch(() => {
        // this.loading = false;
      });
  }
};
</script>
<style lang="scss" scoped>
// @import "../../assets/less/var.less";
.task {
  width: 100%;
  height: 100%;
  padding: 10px;
  // min-width: @main_width;
  .task-list {
    width: 100%;
    height: 100%;
    // min-width: @main_width;
    background-color: #fff;
    padding: 20px 20px 0;
    border-radius: 5px;
    .task-top {
      padding-left: 10px;

      display: flex;
      justify-content: space-between;
      .task-title {
        font-family: SourceHanSansCN-Bold;
        // font-size: @large_font_size;
        font-weight: 700;
        color: #333;
        // padding-top: 5px;
        display: flex;
        // border-left: 2px solid @theme_color;
        align-items: center;
        .line {
          width: 4px;
          height: 16px;
          margin-right: 10px;
          // background-color: @theme_color;
        }
      }
      .task-operation {
        // display: flex;
      }
    }
    .table-content {
      margin-top: 10px;
    }
  }
  // .task-main-con-wrap {
  //   width: 100%;
  //   height: 100%;
  //   background-color: #dedede;
  //   max-height: 1200px;
  //   overflow: auto;
  //   box-shadow: 0px 16px 19px 1px rgba(0, 0, 0, 0.35);
  //   /* 设置滚动条的样式 */
  //   &::-webkit-scrollbar {
  //     width: 30px;
  //     background-color: #bfbfbf;
  //   }
  //   /* 滚动槽 */
  //   &::-webkit-scrollbar-track {
  //     box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  //     border-radius: 10px;
  //   }
  //   /* 滚动条滑块 */
  //   &::-webkit-scrollbar-thumb {
  //     border-radius: 30px;
  //     // height: 16px;
  //     background: #7d7d7d;
  //     box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  //   }
  //   .task-main-con-outer {
  //     padding-right: 55px;
  //     .task-main-con {
  //       width: 100%;
  //       height: 100%;
  //       background-color: #fff;
  //       box-shadow: 0px 16px 19px 1px rgba(0, 0, 0, 0.35);
  //       padding: 0 30px;
  //       .create-search {
  //         width: 100%;
  //         height: 80px;
  //         padding-top: 40px;
  //         text-align: center;
  //       }
  //       .task-info {
  //         .title {
  //           font-family: MicrosoftYaHei-Bold;
  //           font-weight: 700;
  //           color: #441515;
  //           font-size: @common_font_size;
  //           margin-bottom: 10px;
  //         }
  //       }
  //       .abbreviation {
  //         margin-top: 20px;
  //       }
  //       .abbreviation-item {
  //         width: 100%;
  //         height: 35px;
  //         line-height: 35px;
  //         background-color: #7a7d6c;
  //         border-style: solid;
  //         border-width: 4px;
  //         border-image: linear-gradient(0deg,#46413f 0%,#696f4e 100%);
  //         // border-image-slice: 1;
  //         border: solid 4px #46413f;
  //         border-radius: 4px;
  //         margin-bottom: 20px;
  //         color: #fff;
  //         font-size: @large_font_size;
  //         text-align: center;
  //         position: relative;
  //         // margin: 0 auto;
  //         .task-name {
  //           font-size: 14px;
  //           position: absolute;
  //           padding-left: 50px;
  //         }
  //       }
  //       .abbreviation-item-detail {
  //         width: 100%;
  //         background-color: #eeebe8;
  //         border-radius: 10px;
  //         padding-bottom: 40px;
  //         .title {
  //           display: flex;
  //           // justify-content: space-between;
  //           .title-con {
  //             width: 40%;
  //             height: 60px;
  //             color: #441515;
  //             font-size: 17px;
  //             font-family: MicrosoftYaHei-Bold;
  //             padding: 10px;
  //             font-weight: 700;
  //             display: flex;
  //             align-items: center;
  //             > ul {
  //               margin-left: 20px;
  //               > li {
  //                 float: left;
  //                 width: 36px;
  //                 height: 40px;
  //                 line-height: 40px;
  //                 border-radius: 0px 10px 0px 0px;
  //                 // border: solid 2px transparent;
  //                 margin-right: 10px;
  //                 font-family: AdobeHeitiStd-Regular;
  //                 font-size: 30px;
  //                 color: #fefeff;
  //                 text-align: center;
  //                 // background-color: #a0a0a0;
  //                 background-image: linear-gradient(0deg,
  //               #9c9b9b 0%,
  //               #9d9b9b 51%,
  //               #7f7f7f 100%);
  //                 &.active {
  //                   background-color: #558960;
  //                   border: solid 2px #52433c;
  //                   background-image: none;
  //                 }
  //               }
  //             }
  //           }
  //           .icon {
  //             width: 30%;
  //             text-align: center;
  //           }
  //           .btns {
  //             width: 30%;
  //             text-align: right;
  //             padding: 10px 10px 0;
  //           }
  //         }
  //         .form {
  //           padding: 10px;
  //           padding-bottom: 0;
  //           .inspect-report-main {
  //             border: 2px solid rgb(0, 0, 0);
  //             font-size: 16px;
  //             >ul {
  //               >li {
  //                 border: 1px solid #999;
  //                 margin-bottom: 1px;
  //                 display: flex;
  //                 &:last-child {
  //                   margin-bottom: 0px;
  //                 }
  //                 .con-title {
  //                   padding: 10px;
  //                   text-align: center;
  //                   width: 100px;
  //                 }
  //                 .content {
  //                   flex: 1;
  //                   border-left: 1px solid #999;
  //                   text-align: center;
  //                   padding: 10px;
  //                   display: flex;
  //                   flex-direction: column;
  //                   .sign-date {
  //                     height: 20px;
  //                     text-align: right;
  //                   }
  //                 }
  //               }
  //             }
  //           }

  //         }
  //         .table {
  //           padding: 0 10px;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>


