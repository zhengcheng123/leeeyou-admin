<template>
  <div class="wrapper user-manage">
    <div class="content">
      <div class="content-title">
        <h2>系统版本</h2>
      </div>
      <div class="search-bar">
        <div class="search-item">
          <span class="label">版本号：</span>
          <el-input
            v-model.trim="params.condition[0].value"
            @keyup.enter.native="getTableItems"
            clearable
            placeholder="请输入"
          ></el-input>
        </div>
        <!--             v-if="$_has('versionQuery')"
 -->
        <div class="search-btnT">
          <el-button
            type="primary"
            size="small"
            @click="getTableItems"
          >查询</el-button>
                      <!-- v-if="$_has('versionSave')" -->
          <el-button
            type="success"
            size="small"
            :disabled="checkId.length !== 0"
            @click="addtable"
          >添加</el-button>
                      <!-- v-if="$_has('versionDelete')" -->
          <el-button
            type="info"
            size="small"
            @click="deleteItems"
            :disabled="checkId.length == 0"
          >删除</el-button>
                      <!-- v-if="$_has('versionSaveOrUpdate')" -->
          <el-button
            type="primary"
            size="small"
            :disabled="checkId.length !== 1"
            @click="uptable(1)"
          >编辑</el-button>
        </div>
      </div>
      <section
        v-loading="tableLoading"
        element-loading-text="数据请求中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table
          :data="tableData"
          border
          @selection-change="handleSelectionChange"
          @row-dblclick="uptable"
          ref="tableCon"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
          <el-table-column
            prop="number"
            min-width=" 100"
            align="center"
            sortable
            show-overflow-tooltip
            label="版本号"
          ></el-table-column>
          <el-table-column
            prop="msg"
            min-width="280"
            align="center"
            sortable
            show-overflow-tooltip
            label="版本信息"
          ></el-table-column>
          <el-table-column
            prop="issueTime"
            align="center"
            sortable
            min-width="130"
            show-overflow-tooltip
            label="发布时间"
          ></el-table-column>
          <el-table-column prop="status" align="center" show-overflow-tooltip sortable label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status==1?"提交":"暂存"}}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <footer>
        <el-pagination
          background
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="params.page.pageNum"
          :page-sizes="[15,30,50,100]"
          :page-size.sync="params.page.pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </footer>
    </div>
    <!-- 新增加/编辑弹窗 -->
    <el-dialog
      width="400px"
      v-
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      class="dialog-common-style"
      @closed="resetForm"
    >
      <el-form :model="ConInfoForm" :rules="rules" ref="ConInfoForm" :label-width="formLabelWidth">
        <el-form-item label="版本号" prop="number">
          <el-input
            v-model.trim="ConInfoForm.number"
            clearable
            maxlength="5"
            size="small"
            placeholder="输入形式：1.00"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-col :span="22" style="width:200px">
            <!-- <el-input
              v-model="ConInfoForm.status"
              clearable
              size="small"
              placeholder="请输入"
              autocomplete="off"
            ></el-input>-->
            <el-radio v-model="ConInfoForm.status" label="0">暂存</el-radio>
            <el-radio v-model="ConInfoForm.status" label="1">提交</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="发布时间" prop="issueTime">
          <el-col :span="22">
            <el-date-picker
              v-model.trim="ConInfoForm.issueTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择"
              :picker-options="pickerBeginDateBefore"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="版本信息" prop="msg" class="msg">
          <el-col :span="22">
            <el-input
              v-model.trim="ConInfoForm.msg"
              clearable
              size="small"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="请输入"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="success" :loading="submitLoading" @click="submitFom">提 交</el-button>
        <el-button size="small" type="info" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入"));
      }
      setTimeout(() => {
        if (isNaN(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      options: [],
      shipCompany: [],
      total: 0,
      checkId: [],
      params: {
        page: {
          pageNum: 1,
          pageSize: 15
        },
        condition: [
          {
            attribute: "number",
            operate: "like",
            value: ""
          }
        ]
      },
      tableData: [],
      tableLoading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: "",
      formLabelWidth: "100px",
      ConInfoForm: {
        // createId: "", //	string创建人
        // createName: "", //	string
        // createTime: "", //	string($date-time)创建时间
        // harborId: "", //	string港口id
        // id: "", //	string版本id
        // isDelete: "", //	boolean逻辑删除 0 删除 1可用
        issueTime: "", //	string($date-time)发布时间
        msg: "", //	string版本信息
        number: "", //	string版本号
        status: "" //	boolean状态 0 暂存 1提交
        // updateId: "", //	string更新者id
        // updateName: "", //	string
        // updateTime: "" //	string($date-time)更新时间
      },
      rules: {
        issueTime: [{ required: true, message: "请选择" }],
        number: [{ validator: checkAge, trigger: "blur", required: true }],
        msg: [{ required: true, message: "请输入" }],
        status: [{ required: true, message: "请选择" }]
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let _now = Date.now();
          return time.getTime() > _now + 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  mounted() {
    this.getTableItems();
  },
  methods: {
    formatState(row, column) {
      return this.filterTable(row.usingState, this.options.usingState);
    },
    handleSelectionChange(val) {
      this.checkId = val;
    },
    addtable() {
      this.dialogTitle = "新增系统版本";
      this.dialogFormVisible = true;
    },
    uptable(val) {
      if (val !== 1) {
        this.checkId[0] = val;
      }
      this.ConInfoForm = {
        id: this.checkId[0].id,
        issueTime: this.checkId[0].issueTime,
        msg: this.checkId[0].msg, //
        number: this.checkId[0].number, //
        status: JSON.stringify(this.checkId[0].status) //
      };
      this.dialogTitle = "编辑系统版本";
      this.dialogFormVisible = true;
    },
    /**
     * 获取表格数据
     */
    getTableItems() {
      this.tableLoading = true;
      this.$http
        .post(`${globalConfig.server1}version/query`, this.params)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
          }
          setTimeout(() => {
            this.tableLoading = false;
          }, 100);
        });
    },

    //  * 提交表单
    submitFom() {
      this.$refs["ConInfoForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let url = this.ConInfoForm.id
            ? "version/saveOrUpdate"
            : "version/save";
          let form = JSON.parse(JSON.stringify(this.ConInfoForm));
          this.$http.post(`${globalConfig.server1}${url}`, form).then(res => {
            this.checkId = [];
            this.getTableItems();
            this.$message[res.data.code === 200 ? "success" : "error"](
              res.data.message
            );
            this.submitLoading = false;
            this.dialogFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.checkId = [];
      this.$refs.tableCon.clearSelection();
      this.ConInfoForm = {
        issueTime: "", //	string($date-time)发布时间
        msg: "", //	string版本信息
        number: "", //	string版本号
        status: "" //	boolean状态 0 暂存 1提交
      };
      this.$refs["ConInfoForm"].resetFields();
      this.submitLoading = false;
    },

    /**
     * 删除table信息
     */
    deleteItems() {
      this.$confirm("确定删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          this.checkId.forEach(item => {
            arr.push(item.id);
          });
          let params = arr;
          this.$http
            .post(`${globalConfig.server1}version/delete`, arr)
            .then(res => {
              this.$message[res.data.code === 200 ? "success" : "error"](
                res.data.message
              );
              this.getTableItems();
            });
        })
        .catch(() => {});
    },

    /**
     * 分页操作
     * @param value
     */
    handleSizeChange(value) {
      this.params.page.pageNum = 1;
      this.params.page.pageSize = value;
      this.getTableItems();
    },
    handleCurrentChange(value) {
      this.params.page.pageNum = value;
      this.getTableItems();
    }
  }
};
</script>

 <style scope>
 @import '../../../assets/css/base.css';

.msg {
  
}
.msg  .el-textarea__inner {
    width: 200px !important;
  }

.msg  .el-pagination {
  text-align: center;
}
.user-manage {
 
}
 .user-manage .el-form {
    display: flex;
    flex-flow: row wrap;
    
  }
 .user-manage .el-form-item {
      flex: 0 0 50%;
    }
</style>
