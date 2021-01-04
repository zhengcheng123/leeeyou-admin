<template>
  <div class="wrapper role-manage">
    <div class="content">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{path:'/index'}">
            <i class="fa fa-shopping-bag" aria-hidden="true"></i>
            角色管理
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="search-bar">
        <div class="search-item">
          <span class="label">角色名称：</span>
          <el-input
            v-model.trim="conditionForm.condition[0].value"
            placeholder="请输入"
            size="small"
            clearable
            @keyup.enter.native="getTableItems"
          ></el-input>
        </div>
        <div class="search-btnT">
          <!--             v-if="$_has('roleSelect-role')" -->
          <el-button class="f-left" type="primary" size="small" @click="searchData">查询</el-button>
          <!-- v-if="$_has('roleInsert-role')" -->
          <el-button
            class="f-left"
            type="primary"
            size="small"
            :disabled="checkId.length !== 0"
            @click="addItems"
          >添加</el-button>
          <!-- v-if="$_has('roleManageAdd')" -->
          <!-- v-if="$_has('roleDelete-role')" -->
          <el-button
            class="f-left"
            type="info"
            :disabled="checkId.length == 0"
            @click="deleteItems()"
          >删除</el-button>
          <!-- v-if="$_has('roleUpdate-role')" -->
          <el-button
            class="f-left"
            type="primary"
            size="small"
            :disabled="checkId.length !== 1"
            @click="editItems(1)"
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
          @row-dblclick="editItems"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column type="index" align="center" width="55" label="序号"></el-table-column>
          <el-table-column
            prop="roleName"
            min-width="200"
            sortable
            align="center"
            show-overflow-tooltip
            label="角色名称"
          ></el-table-column>
          <el-table-column
            prop="roleDesc"
            min-width="150"
            sortable
            align="center"
            show-overflow-tooltip
            label="角色描述"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            min-width="220"
            sortable
            align="center"
            show-overflow-tooltip
            label="创建时间"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            min-width="220"
            sortable
            align="center"
            show-overflow-tooltip
            label="更新时间"
          ></el-table-column>

          <el-table-column width="240" align="center" label="操作">
            <template slot-scope="props">
              <el-button
                type="text"
                class="success"
                size="small"
                @click="getRootTreeInfo(props.row)"
              >设置权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <footer>
        <el-pagination
          background
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="conditionForm.page.pageNum"
          :page-sizes="[15,30,50,100]"
          :page-size.sync="conditionForm.page.pageSize"
          :total="conditionForm.page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </footer>

      <el-dialog
        width="400px"
        v-
        :title="dialogTitle"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        class="dialog-common-style"
        @closed="resetForm"
      >
        <el-form
          :model="roleInfoForm"
          :rules="rules"
          ref="roleInfoForm"
          :label-width="formLabelWidth"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-col :span="22">
              <el-input
                v-model.trim="roleInfoForm.roleName"
                clearable
                size="small"
                placeholder="请输入名称"
                autocomplete="off"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-col :span="22">
              <el-input
                v-model="roleInfoForm.roleDesc"
                clearable
                size="small"
                placeholder="请输入描述"
                autocomplete="off"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" :loading="submitLoading" @click="submitFom">提 交</el-button>
          <el-button size="small" type="info" @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        width="400px"
        v-
        title="权限配置"
        :visible.sync="dialogRootVisible"
        :close-on-click-modal="false"
        class="dialog-common-style"
        @closed="resetTree"
      >
        <el-tree
          :data="rootTreeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="hasConfigRootData"
           :default-expanded-keys="hasExpanded"
          :props="defaultProps"
          v-loading="treeLoading"
          element-loading-text="权限加载中"
          element-loading-spinner="el-icon-loading"
          default-expand-all
          ref="tree"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            type="primary"
            :loading="submitLoading"
            @click="submitRootSetting"
          >提 交</el-button>
          <el-button type="info" size="small" @click="dialogRootVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "roleManage",
  data() {
    return {
      getRoleId:"",
      checkId: [],
      conditionForm: {
        condition: [{ attribute: "roleName", operate: "like", value: "" }],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0,
          orders: []
        }
      },
      tableData: [],
      tableLoading: false,
      submitLoading: false,
      treeLoading: false,
      dialogFormVisible: false,
      dialogRootVisible: false,
      dialogTitle: "新增角色",
      formLabelWidth: "100px",
      roleInfoForm: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      rules: {
        roleName: [{ required: true, message: "请输入角色名" }],
        roleDesc: [{ required: true, message: "请输入角色描述" }]
      },
      rootTreeData: [],
      hasConfigRootData: [],
      hasExpanded:[],
      defaultProps: {
        children: "children",
        label: "name"
      },
      roleId: ""
    };
  },
  mounted() {
    this.getTableItems();
    let roleId = [];
    let arr = JSON.parse(sessionStorage.getItem("personal")).roles;
    arr.forEach(el => {
      roleId.push(el.id);
    });
    // this.getRootTreeInfo(roleId);
  },
  methods: {
    searchData() {
      this.conditionForm.page = {
        pageNum: 1,
        pageSize: 15,
        total: 16,
        orders: []
      };
      this.getTableItems();
    },
    /**
     * 获取表格数据
     */
    getTableItems() {
      this.tableLoading = true;
      this.$axios
        .post(`${globalConfig.server1}role/query`, this.conditionForm)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.records;
            this.conditionForm.page.total = res.data.data.total;
          }
          setTimeout(() => {
            this.tableLoading = false;
          }, 500);
        });
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.roleInfoForm = {
        id: "",
        roleName: "",
        roleDesc: ""
      };
      this.$refs["roleInfoForm"].resetFields();
      this.submitLoading = false;
    },

    /**
     * 新增角色
     */
    addItems() {
      this.dialogTitle = "新增角色";
      this.dialogFormVisible = true;
    },

    /**
     * 编辑角色信息
     * @param { obj } 角色信息对象
     */
    editItems(obj) {
      let custId = "";
      if (obj !== 1) {
        custId = obj.id;
      } else {
        custId = this.checkId[0].id;
        obj = this.checkId[0];
      }
      let form = JSON.parse(JSON.stringify(obj));
      Object.keys(this.roleInfoForm).forEach(ele => {
        this.roleInfoForm[ele] = form[ele];
      });
      this.dialogTitle = "编辑角色";
      this.dialogFormVisible = true;
    },

    /**
     * 提交表单
     */
    submitFom() {
      this.$refs["roleInfoForm"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let url = this.roleInfoForm.id ? "role/saveOrUpdate" : "role/save";
          this.$axios
            .post(`${globalConfig.server1}${url}`, this.roleInfoForm)
            .then(res => {
              this.getTableItems();
              this.$message[res.data.code === 200 ? "success" : "error"](
                res.data.message
              );
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 删除角色信息
     * @param sid
     */
    deleteItems() {
      this.$confirm("确定删除该条角色信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          this.checkId.forEach(item => {
            arr.push(item.id);
          });
          this.$axios
            .post(`${globalConfig.server1}role/delete`, arr)
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
     * 重置权限树
     */
    resetTree() {
      this.submitLoading = false;
      this.rootTreeData = [];
    },

    /**
     * 获取用户权限信息
     */
    getRootTreeInfo({ id }) {
      this.getRoleId = id
      this.dialogRootVisible = true;
      this.treeLoading = true;
      this.roleId = id;
      this.$axios
        .get(`${globalConfig.server1}menu-resource/select-menu`)
        .then(res => {
          if (res.data.code === 200) {
            this.rootTreeData = [res.data.data];
            this.treeLoading = false;
            let path = [];
          }
        });
        this.getRole();
    },

    //获取角色信息
    getRole() {
      // this.hasConfigRootData = []
      let param = {
        ids:this.getRoleId
      }
       this.$axios
        .post(`${globalConfig.server1}menu-resource/select-menu-resource-roles`,[this.getRoleId])
        .then(res => {
          if (res.data.code === 200) {
            let rootData = []
            rootData = res.data.data.resources.map((item)=>{
              return item.id
            })
            this.hasConfigRootData = rootData
          }
        });
    },
    /**
     * 获取角色权限配置
     */
    // getRoleRootSetting(id) {
    //   // this.dialogRootVisible = true;
    //   // this.treeLoading = true;
    //   //hasConfigRootData
    //   this.$axios
    //     .post(
    //       `${globalConfig.server1}menu-resource/select-menu-resource-roles`,
    //       [id]
    //     )
    //     .then(res => {
    //       this.roleId = id;
    //       console.log()
    //       if (res.data.code === 200) {
    //         this.$nextTick(() => {
    //           let leafArr = res.data.data.resources.map(ele => ele.id);
    //           this.$refs.tree.setCheckedKeys(leafArr);
    //         });
    //       } else {
    //         this.$refs.tree.setCheckedKeys([]);
    //       }
    //       this.treeLoading = false;
    //     });
    // },

    /**
     * 提交权限配置
     */
    submitRootSetting() {
      let datas = this.$refs.tree
        .getCheckedNodes(false, true)
        .map(ele => ele.id);
      this.$axios
        .post(`${globalConfig.server1}role/insert-permit`, {
          list: this.$refs.tree.getCheckedNodes(false, true).map(ele => ele.id),
          object: this.roleId
        })
        .then(res => {
          if (res.data.code === 200) {
            if (datas.length == []) {
              this.$message.error("请选择权限");
              return false;
            } else {
              this.$message.success("权限配置成功");
              this.dialogRootVisible = false;
            }
          } else {
            this.$message.error("权限配置失败");
          }
        });
    },

    /**
     * 分页操作
     * @param value 回调参数
     */
    handleSizeChange(value) {
      // this.conditionForm.pageNum = 1
      this.conditionForm.pageSize = value;
      this.getTableItems();
    },
    handleCurrentChange(value) {
      this.conditionForm.pageNum = value;
      this.getTableItems();
    },
    handleSelectionChange(val) {
      this.checkId = val;
    }
  }
};
</script>

<style scoped>
@import "../../../assets/css/base.css";
.role-manage {
}
.search-bar > div .search-item {
  flex: none;
  justify-content: flex-start;
  padding-right: 0;
}
.search-bar {
  justify-content: space-between;
}
</style>
