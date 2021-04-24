<template>
  <div class="wrapper menu-manage"
       :key="key">
    <el-container>
      <el-aside width="300px"
                hight="100%"
                :style="boxHeight">
        <div class="btn-group">
          <!-- v-if="$_has('menu-resourceInsert-menu-resource')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     @click="addItems(0)"
                     :disabled="disabledfalse">新增</el-button>
          <!-- v-if="$_has('menu-resourceUpdate-menu-resource')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     @click="editItems(0)"
                     :disabled="disabledfalse || clicknode.id === '1'">编辑</el-button>
          <!-- v-if="$_has('menu-resourceDelete-menu-resource')" -->
          <el-button class="f-left"
                     type="info"
                     size="mini"
                     @click="deleteItems(0)"
                     :disabled="disabledfalse || clicknode.id === '1'">删除</el-button>
          <!-- v-if="$_has('menu-resourceSort-menu')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     @click="sortClick">排序</el-button>
        </div>
        <el-scrollbar>
          <div class="menu-tree">
            <el-tree :expand-on-click-node="false"
                     :data="departTreeData"
                     :props="defaultProps"
                     :default-expanded-keys="morenArr"
                     node-key="id"
                     default-expand-all
                     highlight-current
                     ref="tree"
                     @node-click="triggerNode">
              <!-- <span slot-scope="{ node, data }" :class="nodeStyle(node)">{{ node.name }}</span> -->
            </el-tree>
          </div>
        </el-scrollbar>
      </el-aside>
      <section>
        <h3>资源列表</h3>
        <el-form :inline="true"
                 onsubmit="return false">
          <div style="float:right">
            <el-form-item style="margin-right: 0;">
              <el-button class="f-left"
                         type="success"
                         size="mini"
                         :disabled="(zyName && idBatch.length==0)?false:true "
                         @click="addItems(1)">添加</el-button>
              <el-button class="f-left"
                         type="primary"
                         size="mini"
                         @click="editItems(1)"
                         :disabled="editLimit === 1">编辑</el-button>
              <el-button class="f-left"
                         type="info"
                         size="mini"
                         @click="deleteItems(1)"
                         :disabled="idBatch.length>0?false:true">删除</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table ref="multipleTable"
                  :data="userTableData"
                  tooltip-effect="dark"
                  :min-width="800"
                  class="tablemenu"
                  border
                  @selection-change="handleSelectionChange">
          <el-table-column align="center"
                           type="selection"
                           width="55"></el-table-column>
          <el-table-column align="center"
                           prop="resourceKey"
                           show-overflow-tooltip
                           label="资源值"></el-table-column>
          <el-table-column align="center"
                           prop="path"
                           show-overflow-tooltip
                           label="资源地址"></el-table-column>
          <el-table-column align="center"
                           prop="name"
                           show-overflow-tooltip
                           label="资源名称"></el-table-column>
        </el-table>
        <footer>
          <el-pagination background background
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"
                         :current-page="params.pageNum"
                         :page-sizes="[15, 30, 45, 60]"
                         :page-size="params.pageCount"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"></el-pagination>
        </footer>
      </section>
    </el-container>
    <!-- 菜单弹窗 -->
    <el-dialog width="450px"
               v-
               :title="menuTitle"
               :close-on-click-modal="false"
               :visible.sync="addMenuDialogVisible"
               class="dialog-common-style"
               @close="closeDialog">
      <el-form :model="form"
               ref="form"
               label-width="110px">
        <el-form-item label="菜单层级">
          <el-col :span="22">
            <el-input v-model="form.grade"
                      size="mini"
                      disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="上级菜单名称"
                      v-show="form.parentId !== '1' && menuTitle === '新增菜单'">
          <el-col :span="22">
            <el-input v-model="form.parentName"
                      size="mini"
                      disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单名称"
                      required>
          <el-col :span="22">
            <el-input v-model.trim="form.name"
                      size="mini"
                      clearable></el-input>
          </el-col>
        </el-form-item>
        <!--  -->
        <el-form-item label="菜单图标"
                      required
                      v-show="form.parentId === '1' || form.grade === '一级菜单'">
          <el-col :span="22">
            <el-input v-model.trim="form.icon"
                      size="mini"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单路径"
                      required
                      v-show="menuTitle === '新增菜单' || form.position === 1"
                      clearable>
          <el-col :span="22">
            <el-input v-model.trim="form.path"
                      size="mini"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="首页封面"
                      required
                      v-if="form.grade=='一级菜单'">
          <el-col :span="22">
            <el-upload class="avatar-uploader"
                       :action="uri"
                       name="file"
                       with-credentials
                       :show-file-list="false"
                       :on-success="uploadFiles"
                       :before-upload="beforeAvatarUpload"
                       accept=".png, .jpg"
                       ref="upwenjiancreate">
              <img v-if="form.pic"
                   :src="form.pic" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="mini"
                   type="success"
                   @click="sureSubmit"
                   :loading="submitLoading">提 交</el-button>
        <el-button @click="addMenuDialogVisible = false"
                   type="info">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 资源弹窗 -->
    <el-dialog width="400px"
               class="dialog-common-style"
               v-
               :title="resourceTitle"
               :close-on-click-modal="false"
               :visible.sync="addUserDialogVisible"
               @close="closeDialog">
      <el-form :model="form"
               label-width="100px">
        <el-form-item label="菜单名称">
          <div style="font-size: 16px;font-weight: bolder;">{{zyName}}</div>
        </el-form-item>
        <el-form-item label="资源值"
                      required>
          <el-col :span="22">
            <el-input v-model="form.resourceKey"
                      size="mini"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="资源地址"
                      required>
          <el-col :span="22">
            <el-input v-model="form.path"
                      size="mini"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="资源名称"
                      required>
          <el-col :span="22">
            <el-input v-model="form.name"
                      size="mini"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="success"
                   @click="sureSubmit"
                   :loading="submitLoading">提 交</el-button>
        <el-button @click="addUserDialogVisible = false"
                   type="info">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 排序弹窗 -->
    <el-dialog title="排序"
               width="360px"
               v-
               :close-on-click-modal="false"
               :visible.sync="sortdialogFormVisible"
               class="dialog-common-style">
      <el-tree :props="defaultProps1"
               :data="sortData"
               :allow-drop="collapse"
               node-key="id"
               default-expand-all
               draggable
               @node-drop="handleDrop"></el-tree>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="success"
                   @click="sortgaibianTrue"
                   :loading="submitLoading">提 交</el-button>

        <el-button @click="sortdialogFormVisible = false"
                   type="info">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'menuManage',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      boxHeight: '',
      boxWidth: '',
      key: 0,
      menuTree: [],
      addMenuDialogVisible: false, //添加部门弹窗
      addUserDialogVisible: false, //添加用户弹窗
      sortdialogFormVisible: false, //单位排序隐藏firstStyle
      disabledfalse: true,
      //添加用户表单
      params: {
        //查询数据传值
        bianhao: '1',
        name_cn: '',
        department_id: '',
        pageNum: 1,
        pageCount: 15,
        role_name: '',
      },
      sectionOptions: [], //添加部门下拉框数据
      roleOptions: [], //角色下拉框
      jueseOptions: [], //角色名称下拉
      total: 0, //数据总条数
      idBatch: [], //多选用户删除
      departmentOptions: [], //部门下拉框
      departTreeData: [],
      defaultProps1: {
        children: 'children',
        label: 'name',
      },
      submitLoading: false,
      userTableData: [], //查询用户表格数据
      sortData: [], //排序弹窗数据
      clicknode: {}, //点击的节点数据
      morenArr: ['1'], //默认展开
      sortChuanzhi: [],
      sortCan: [],
      menuTitle: '新增菜单',
      resourceTitle: '新增资源',
      form: {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        path: '',
        grade: '',
        icon: '',
        resourceMenu: '', // 0菜单、1资源
        resourceKey: '',
        menuId: '',
        position: '',
        reserved1: '',
        pic: '',
      },
      zyId: '',
      zyName: '',
      lev: null,
      editLimit: 1,
      uri: '', //上传软件地址
      menuForm: {
        condition: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0,
          orders: [],
        },
      },
    }
  },
  created() {
    // this.menuTree = JSON.parse(sessionStorage.getItem("roleaside"));
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.boxHeight = document.body.clientHeight
        this.boxWidth = document.body.clientWidth
      })()
    }
    this.getTableItems()
    this.getMenuTreeData()
  },
  watch: {
    boxHeight() {
      this.key += 1
    },
    boxWidth() {
      this.key += 1
    },
  },
  // computed: {
  //   boxHeight() {
  //     let viewHeight = document.body.clientHeight;
  //     let boxHeight = viewHeight - 85 - 90 - 40;
  //     return `height: ${boxHeight}px`;
  //   }
  // },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.message('error', '上传图片大小不能超过2MB！')
      }
      return isLt2M
    },
    uploadFiles(response, file, fileList) {
      if (file.response.code == '500') {
        fileList.splice(fileList.indexOf(file), 1)
        this.message('warning', file.name + '上传失败')
      } else {
        this.form.pic = URL.createObjectURL(file.raw)
        this.form.reserved1 = file.response.data
      }
    },

    /**
     * 获取菜单树
     */
    getMenuTreeData() {
      let data1 = []
      let data2 = []
      this.sortData = []
      this.departTreeData = []
      this.sortData = this.menuTree
      this.$axios.get(globalConfig.server1 + 'menu-resource/select-menu').then((res) => {
        if (res.data.code === 200) {
          data1.push(res.data.data)
          data2.push(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
        this.departTreeData = data1
        this.sortData = data2
      })
    },

    /**
     * 根绝节点信息，获取右侧表格数据
     */
    triggerNode(val) {
      // console.log(val);
      this.disabledfalse = false
      this.zyId = !val.leaf ? val.id : ''
      // this.zyName = val.leaf ? val.label : "";
      this.zyName = val.children.length == 0 ? val.label : ''
      this.lev = val.leaf
      this.clicknode = val
      this.getTableItems()
    },

    /**
     * 获取表格数据
     */
    getTableItems() {
      this.$axios.post(globalConfig.server1 + 'menu-resource/query', this.menuForm).then((res) => {
        if (res.data.code === 200) {
          this.userTableData = res.data.data ? res.data.data.records : []
          this.total = res.data.data ? res.data.data.totalCount : 0
        } else {
          this.userTableData = []
          this.$message.error(res.data.message)
        }
      })
    },

    /**
     * 数据增删改
     * @param type 0:菜单、1:资源
     */
    addItems(type) {
      this.uri = globalConfig.server1 + 'uploadFile/insert-file'
      this.menuTitle = '新增菜单'
      this.resourceTitle = '新增资源'
      this.form.resourceMenu = type
      this.form.parentId = this.form.menuId = this.clicknode.id
      if (type) {
        this.addUserDialogVisible = true
      } else {
        switch (this.clicknode.grade) {
          case null:
            this.form.grade = '一级菜单'
            break
          case '一级菜单':
            this.form.grade = '二级菜单'
            break
          case '二级菜单':
            this.form.grade = '三级菜单'
            break
          case '三级菜单':
            this.form.grade = '四级菜单'
            break
          default:
            break
        }
        this.form.id = ''
        this.form.parentName = this.clicknode.label
        this.addMenuDialogVisible = true
      }
    },

    /**
     * 统一编辑
     */
    editItems(type) {
      this.uri = globalConfig.server1 + 'uploadFile/insert-file'
      this.menuTitle = '编辑菜单'
      this.resourceTitle = '编辑资源'
      this.form.resourceMenu = type
      this.form.grade = this.clicknode.grade

      if (type) {
        this.form.parentId = this.form.menuId = this.idBatch[0].menuId
        this.form.id = this.idBatch[0].id
        this.form.resourceKey = this.idBatch[0].resourceKey
        this.form.path = this.idBatch[0].path
        this.form.name = this.idBatch[0].name
        this.addUserDialogVisible = true
      } else {
        this.form.parentId = this.form.menuId = this.clicknode.parent_id
        this.form.id = this.clicknode.id
        this.form.name = this.clicknode.label
        this.form.icon = this.clicknode.icon
        this.form.path = this.clicknode.path
        this.form.position = this.clicknode.leaf
        this.form.pic = this.clicknode.pic ? globalConfig.server1 + this.clicknode.pic.substring(1) : ''
        this.addMenuDialogVisible = true
      }
    },

    /**
     * 统一删除
     */
    deleteItems(type) {
      let list = type ? this.idBatch.map((ele) => ele.id) : [this.clicknode.id]
      if (list.length) {
        this.$confirm(`此操作将永久删除选中${this.form.resourceMenu ? '资源' : '菜单'}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning',
        })
          .then(() => {
            this.$axios.post(globalConfig.server1 + 'menu-resource/delete', list).then((res) => {
              if (res.data.code === 200) {
                if (!type) this.clicknode = {}
                if (type) {
                  this.getTableItems()
                } else {
                  this.getMenuTreeData()
                  this.zyId = ''
                  this.getTableItems()
                }
                this.addMenuDialogVisible = false
                this.addUserDialogVisible = false
                this.$message.success(res.data.message)
              } else {
                this.$message.error(res.data.message)
              }
            })
          })
          .catch(() => {})
      } else {
        this.$message.warning('未选择删除项')
      }
    },
    /**
     * 提交操作
     */
    sureSubmit() {
      if (!this.form.name) {
        return this.$message.warning('请完善必填项！')
      }
      if (this.form.resourceMenu) {
        if (!this.form.resourceKey || !this.form.path) {
          return this.$message.warning('请完善必填项！')
        }
      } else {
        if (this.clicknode.id === '1' || this.clicknode.label === '菜单树') {
          if (!this.form.icon || !this.form.path || !this.form.pic) {
            return this.$message.warning('请完善必填项！')
          }
        } else {
          if (!this.form.path) {
            return this.$message.warning('请完善必填项！')
          }
        }
      }
      this.submitLoading = true
      if (this.menuTitle === '新增菜单' || this.resourceTitle === '新增资源') {
        this.$axios.post(globalConfig.server1 + 'menu-resource/saveOrUpdate', this.form).then((res) => {
          if (res.data.code === 200) {
            if (this.form.resourceMenu) {
              this.getTableItems()
              this.addUserDialogVisible = false
            } else {
              this.getMenuTreeData()
              this.addMenuDialogVisible = false
            }
            this.$message.success(res.data.message)
          } else {
            this.$message.warning(res.data.message)
          }
          this.submitLoading = false
        })
      } else {
        this.$axios.post(globalConfig.server1 + 'menu-resource/saveOrUpdate', this.form).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            if (this.form.resourceMenu) {
              this.getTableItems()
              this.addUserDialogVisible = false
            } else {
              this.getMenuTreeData()
              this.addMenuDialogVisible = false
            }
          } else {
            this.$message.error(res.data.message)
          }
          this.submitLoading = false
        })
      }
    },

    /**
     * 批量选择
     */
    handleSelectionChange(val) {
      if (val.length > 1 || val.length == 0) {
        this.editLimit = 1
      } else {
        this.editLimit = 0
        Object.assign(this.form, val[0])
      }
      this.idBatch = val
    },

    /**
     * 分页操作
     * @param val
     */
    handleSizeChange(val) {
      this.params.pageCount = val
      this.getTableItems()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableItems()
    },

    /**
     * 关闭模态框
     */
    closeDialog() {
      this.form = {
        id: '',
        parentId: '',
        parentName: '',
        name: '',
        path: '',
        grade: '',
        icon: '',
        resourceMenu: '',
        resourceKey: '',
        menuId: '',
        position: '',
        reserved1: '',
        pic: '',
      }
    },

    //排序拖拽
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // 节点对应的node,最后进入节点，放置位置
      let arr = dropNode.parent.data.children ? dropNode.parent.data.children : dropNode.parent.data //父级下的新数据排序
      let arr1 = []
      // return false;
      arr.forEach((item, index) => {
        let obj = {
          id: item.id,
          sort: index,
        }
        arr1.push(obj)
      })
      this.sortChuanzhi = [...arr1, ...this.sortChuanzhi]
      this.sortCan = []
      for (var i = 0; i < this.sortChuanzhi.length; i++) {
        var flag = true
        for (var j = 0; j < this.sortCan.length; j++) {
          if (this.sortChuanzhi[i].id == this.sortCan[j].id) {
            flag = false
          }
        }
        if (flag) {
          this.sortCan.push(this.sortChuanzhi[i])
        }
      }
      this.sortChuanzhi = JSON.parse(JSON.stringify(this.sortCan))
    },
    //排序确认
    sortgaibianTrue() {
      if (this.sortCan.length == 0) {
        this.sortdialogFormVisible = false
      } else {
        this.submitLoading = true
        this.$http.post(globalConfig.server1 + 'menu-resource/sort-menu', this.sortCan).then((res) => {
          if (res.data.code == '200') {
            this.$message({
              message: '修改成功，请重新登录',
              type: 'success',
            })
            this.sortCan = []
            this.sortdialogFormVisible = false
            this.getMenuTreeData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            })
          }
          this.submitLoading = false
        })
      }
    },
    nodeStyle(node) {
      if (node.level == 1) {
        return 'firstStyle'
      } else if (node.level == 2) {
        return 'secondStyle'
      }
    },
    sortClick() {
      this.sortdialogFormVisible = true
    },
    collapse(moveNode, inNode, type) {
      if (moveNode.level == 1 && inNode.level == 1) {
        return type == 'prev'
      }
      if (moveNode.level == 2 && inNode.level == 2) {
        if (moveNode.parent.id == inNode.parent.id) {
          return type == 'prev'
        } else {
        }
      }
      if (moveNode.level == 3 && inNode.level == 3) {
        if (moveNode.parent.id == inNode.parent.id) {
          return type == 'prev'
        } else {
        }
      }
      if (moveNode.level == 4 && inNode.level == 4) {
        if (moveNode.parent.id == inNode.parent.id) {
          return type == 'prev'
        } else {
        }
      }
    },
  },
}
</script>

<style  scoped>
@import '../../../assets/css/base.css';
.menu-manage {
  height: calc(100vh - 160px);
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0px 1px 21px 0px rgba(51, 51, 51, 0.08);
  display: flex;
  flex-direction: row;
}
.menu-manage .el-aside {
  /* // min-height: 500px; */
  margin-right: 20px;
  overflow: hidden;
  background-color: rgba(241, 241, 241, 0.3);
  display: flex;
  flex-direction: column;
}
.menu-manage .btn-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  padding-left: 10px;
  background-color: rgba(241, 241, 241, 0.3);
}

.menu-manage .el-scrollbar {
  /* // height: 100%; */
}
.menu-manage .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-tree {
  padding: 0 10px 20px;
  background-color: rgba(241, 241, 241, 0.3);
}
.menu-tree .el-tree .el-tree-node:focus > .el-tree-node__content {
  background-color: #eeeeee;
}

.menu-tree .el-tree .el-tree-node__content:hover {
  background-color: rgba(238, 238, 238, 0.5);
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eeeeee;
}

section::-webkit-scrollbar {
  display: none;
  overflow-y: scroll;

  width: 100%;
  height: 100% !important;
}

/* // flex: 1; */

section h3 {
  color: #333333;
  font-size: 18px;
  font-weight: bolder;
}

section .el-upload .avatar-uploader-icon {
  width: 275px;
  height: 200px;
  color: #c0c4cc;
  font-size: 50px;
  line-height: 200px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
section .el-upload .avatar-uploader-icon:hover {
  border-color: #c0c4cc;
}

.firstStyle {
  /* // color: #333333; */
  font-size: 15px;
  font-weight: bolder;
  line-height: 30px;
}

.secondStyle {
  color: #666666;
  font-size: 14px;
  font-weight: bolder;
  line-height: 18px;
}
.tablemenu {
  width: 700px;
  height: 350px;
  overflow-y: scroll;
}
</style>
