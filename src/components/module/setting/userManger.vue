<template>
  <div class="wrapper user-manage">
    <div class="content">
      <div class="search-bar">
        <div class="search-item">
          <span class="label">账号：</span>
          <el-input v-model.trim="conditionForm.condition[0].value"
                    placeholder="请输入账号"
                    size="mini"
                    clearable
                    @keyup.enter.native="getTableItems"></el-input>
        </div>
        <!-- v-if="$_has('userSelect-user')" -->
        <div class="search-btnT">
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     @click="searchData">查询</el-button>
          <!-- v-if="$_has('userInsert-user')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     :disabled="checkId.length !== 0"
                     @click="addItems">添加</el-button>
          <!--             v-if="$_has('userDelete-user')" -->
          <el-button class="f-left"
                     type="info"
                     size="mini"
                     :disabled="checkId.length == 0"
                     @click="deleteItems()">删除</el-button>
          <!-- v-if="$_has('userUpdate-user')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     :disabled="checkId.length !== 1"
                     @click="editItems(1)">编辑</el-button>
        </div>
      </div>
      <section v-loading="tableLoading"
               element-loading-text="数据请求中"
               element-loading-spinner="el-icon-loading">
        <!--           @row-dblclick="editItems"
        -->
        <el-table :data="tableData"
                  border
                  @selection-change="handleSelectionChange"
                  @select="checkOne">
          <el-table-column type="selection"
                           align="center"
                           width="55"></el-table-column>
          <el-table-column type="index"
                           align="center"
                           width="55"
                           label="序号"></el-table-column>
          <el-table-column prop="name"
                           min-width="100"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="账号"></el-table-column>
          <el-table-column prop="real_name"
                           min-width="150"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="用户真实姓名"></el-table-column>
          <el-table-column prop="qq"
                           min-width="120"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="qq号"></el-table-column>
          <el-table-column prop="age"
                           min-width="120"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="年龄"></el-table-column>
          <el-table-column prop="phone"
                           min-width="120"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="手机号"></el-table-column>

          <el-table-column prop="auth_account"
                           min-width="120"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="证件号"></el-table-column>
          <el-table-column prop="auth_type"
                           min-width="120"
                           sortable
                           align="center"
                           show-overflow-tooltip
                           label="证件类型">
            <template slot-scope="props">
              <span v-if="props.row.auth_type ===1">身份证</span>
              <span v-if="props.row.auth_type ===2">护照</span>
              <span v-if="props.row.auth_type ===3">港台回乡证</span>
              <span v-if="props.row.auth_type ===4">港澳居民内地通行证</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120"
                           prop="enable"
                           align="center"
                           label="启用状态">
            <template slot-scope="props">
              <el-switch v-model="props.row.enable"
                         active-value="1"
                         inactive-value="0"
                         active-color="#eb8600"
                         inactive-color="#9F9E22"
                         @change="statusSwitch($event, props.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <el-pagination background
                         class="pagination"
                         layout="total, sizes, prev, pager, next, jumper"
                         :current-page.sync="conditionForm.page.pageNum"
                         :page-sizes="[15,30,50,100]"
                         :page-size.sync="conditionForm.page.pageSize"
                         :total="conditionForm.page.total"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"></el-pagination>
        </footer>
      </section>

      <el-dialog width="800px"
                 :title="dialogTitle"
                 :close-on-click-modal="false"
                 :visible.sync="dialogFormVisible"
                 class="dialog-common-style"
                 @closed="resetForm">
        <el-form :model="userInfoForm"
                 :rules="rules"
                 ref="userInfoForm"
                 :label-width="formLabelWidth">
          <el-form-item label="账号"
                        prop="name">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.name"
                        clearable
                        size="mini"
                        placeholder="请输入账号"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="真实姓名"
                        prop="realName">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.realName"
                        clearable
                        size="mini"
                        placeholder="请输入真实姓名"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="证件类型"
                        prop="authType">
            <el-col :span="22">
              <el-select clearable
                         v-model="userInfoForm.authType">
                <el-option v-for="(item,index) in authTypeOptions"
                           :key="index"
                           :label="item.label"
                           :value="item.value*1"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="证件号"
                        prop="authAccount">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.authAccount"
                        clearable
                        size="mini"
                        placeholder="请输入证件号"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.password"
                        show-password
                        size="mini"
                        placeholder="请输入密码"
                        autocomplete="new-password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码"
                        prop="checkPass">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.checkPass"
                        show-password
                        size="mini"
                        placeholder="请再次输入密码"
                        autocomplete="new-password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="phone">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.phone"
                        clearable
                        size="mini"
                        placeholder="请输入手机号"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="qq"
                        prop="qq">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.qq"
                        clearable
                        size="mini"
                        placeholder="请输入qq"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="年龄"
                        prop="age">
            <el-col :span="22">
              <el-input v-model.trim="userInfoForm.age"
                        clearable
                        size="mini"
                        min="0"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        placeholder="请输入年龄"
                        autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色"
                        prop="roles">
            <el-col>
              <el-select class="palte"
                         v-model="userInfoForm.roles"
                         multiple
                         placeholder="请选择">
                <el-option v-for="(item,index) in options"
                           :key="index"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button size="mini"
                     type="primary"
                     :loading="submitLoading"
                     @click="submitFom">提 交</el-button>
          <el-button size="mini"
                     type="info"
                     @click="resetForm">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import treeSelect from '@/components/common/treeSelect.vue'
import Crypto from '@/assets/js/cryptojs.js'
export default {
  components: {
    treeSelect,
  },
  name: 'userManage',
  data() {
    // 过滤特殊字符
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'))
      }
      if (this.haveCode === true) {
        callback()
      } else {
        callback(new Error('该数据已存在或不合法,请重新输入'))
      }
    }
    var checkCode = (rule, value, callback) => {
      if (!value || value == "''" || value == 'null' || value == '""') {
        return callback(new Error('请输入合法账号'))
      } else {
        callback()
      }
      // if (this.haveCode === true) {
      //   callback();
      // } else {
      //   callback(new Error("该数据已存在或不合法,请重新输入"));
      // }
    }
    var validateCheckId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'))
      } else {
        if (!/(^\d{15}$)|(^\d{17}([0-9]|X))$/.test(this.userInfoForm.authAccount)) {
          callback(new Error('身份证号码有误，请重填'))
          return false
        } else {
          callback()
        }
      }
    }
    var validateCheckPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.userInfoForm.phone)) {
          callback(new Error('手机号码有误，请重填'))
          return false
        } else {
          callback()
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.userInfoForm.checkPass) {
          this.$refs.userInfoForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfoForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      norid: [],
      itemId: '',
      options: [],
      checkId: [],
      haveCode: '',
      key: 0,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: '', // 初始ID（可选）
      valueId2: '', // 初始ID（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'label',
        children: 'children',
      },
      partmentArr: [], //部门
      staffOptions: [],
      roleOptions: [],
      conditionForm: {
        condition: [{ attribute: 'name', operate: 'like', value: '' }],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0,
          orders: [],
        },
      },
      params: {
        condition: [],
        page: {
          pageNum: 1,
          pageSize: 15,
          total: 0,
          orders: [],
        },
      },
      tableData: [],
      tableLoading: false,
      submitLoading: false,
      dialogFormVisible: false,
      dialogTitle: '新增账号',
      formLabelWidth: '100px',
      staffObj: {},
      userInfoForm: {
        rolesId: '',
        age: '',
        auth_account: '',
        auth_type: '',
        enable: '',
        id: '',
        name: '',
        password: '',
        phone: '',
        qq: '',
        sex: '',
        sort: '',
        checkPass: '',
        roles: [],
        realName: '',
      },
      authTypeOptions: [
        {
          value: '1',
          label: '身份证',
        },
        // {
        //   value: "2",
        //   label: "护照"
        // },
        // {
        //   value: "3",
        //   label: "港台回乡证"
        // },
        // {
        //   value: "4",
        //   label: "港澳居民内地通行证"
        // }
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
        authType: [{ required: true, message: '请选择证件类型' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        authAccount: [{ required: true, validator: validateCheckId, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validateCheckPass, trigger: 'blur' }],
        phone: [{ required: true, validator: validateCheckPhone, trigger: 'blur' }],
        roles: [{ required: true, message: '请选择角色' }],
      },
    }
  },
  created() {},
  mounted() {
    this.getTableItems()
    this.getRole()
  },
  methods: {
    getValue(value) {
      this.valueId = value
      this.conditionForm.departmentId = this.valueId
    },
    getValue2(value) {
      this.valueId2 = value
      this.userInfoForm.departmentId = this.valueId2
      this.filtDepart(this.partmentArr, 0, '')
    },
    filtDepart(arr, depth, ptit) {
      for (let v of arr) {
        if (v.id == this.valueId2) {
          // console.log(v.companyId, depth, ptit);
          this.userInfoForm.companyId = v.companyId
        }
        if (v.hasOwnProperty('children') && v.children.length) {
          this.filtDepart(v.children, depth + 1, v.id)
        }
      }
    },

    getParamData(oldData) {
      let formData = new FormData()
      let keys = Object.keys(oldData)
      keys.forEach((element) => {
        formData.append(element, oldData[element])
      })
      return formData
    },

    searchData() {
      this.conditionForm.page = {
        pageNum: 1,
        pageSize: 15,
        total: 16,
        orders: [],
      }
      this.getTableItems()
    },
    /**
     * 获取表格数据
     */
    getTableItems() {
      this.tableLoading = true
      this.$axios.post(`${globalConfig.server1}user/query`, this.conditionForm).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.tableData.map((ele, index) => {
            ele.enable += ''
            this.itemId = ele.id
            console.log(ele.id, '00000')
            return ele
          })

          this.conditionForm.page.total = res.data.data.total
        }
        setTimeout(() => {
          this.tableLoading = false
        }, 500)
      })
    },

    /**
     * 状态 - 启用/禁用
     * @param { sid } 员工唯一标识
     */
    statusSwitch(event, uid) {
      this.$axios
        .post(`${globalConfig.server1}user/updateUserState`, {
          id: uid.id,
          enable: event,
        })
        .then((res) => {
          this.$message[res.data.code === 200 ? 'success' : 'error'](res.data.message)
        })
    },

    /**
     * 新增账号
     */
    addItems() {
      this.dialogTitle = '新增账号'

      this.haveCode = false
      this.dialogFormVisible = true
      this.key += 1
    },

    checkOne(section, row) {},

    /**
     * 编辑账号信息
     */
    editItems(obj) {
      this.dialogTitle = '编辑账号'
      let id = this.checkId[0].id
      this.$axios.get(`${globalConfig.server1}user/detail/${id}`).then((res) => {
        let form = {
          roles: [],
          age: '',
          auth_account: '',
          auth_type: '',
          enable: '',
          id: '',
          name: '',
          password: '',
          phone: '',
          qq: '',
          sex: '',
          sort: '',
        }
        form.id = res.data.data.id
        form.age = res.data.data.age
        form.authAccount = res.data.data.authAccount
        form.name = res.data.data.name
        form.phone = res.data.data.phone
        form.password = res.data.data.password
        form.qq = res.data.data.qq
        form.authType = res.data.data.authType
        form.realName = res.data.data.realName
        form.checkPass = res.data.data.password
        let roleNames = res.data.data.roles.map((item, index) => {
          return item.id
        })
        form.roles = roleNames
        this.userInfoForm = JSON.parse(JSON.stringify(form))
      })
      this.dialogFormVisible = true
    },

    /**content-view
     * 提交表单
     */
    submitFom() {
      var filter = /^\s*[.0-9]{5,11}\s*$/
      if (!filter.test(this.userInfoForm.qq) && this.userInfoForm.qq) {
        this.$message.error('请输入正确qq号')
        return false
      } else {
        let infoForm = this.userInfoForm.roles.map((item, index) => {
          return { id: item }
        })
        let params = { ...this.userInfoForm }
        params.roles = infoForm
        console.log(params)

        this.$refs['userInfoForm'].validate((valid) => {
          if (valid) {
            let url = this.userInfoForm.id ? 'user/saveOrUpdate' : 'user/save'
            this.$axios.post(`${globalConfig.server1}${url}`, params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.dialogFormVisible = false
                this.getTableItems()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      }
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.userInfoForm = {
        companyId: '',
        id: '',
        authAccount: '',
        loginPassword: '',
        loginName: '',
        departmentId: '',
        status: '1',
        birthDate: '',
        sex: '',
        duty: '',
        dutyLev: '',
        phonenum: '',
        telephone: '',
        phonenum: '',
        roles: '',
        realName: '',
        qq: '',
      }
      this.valueId2 = ''
      this.valueId = ''
      // this.staffObj = {};
      this.$refs['userInfoForm'].resetFields()
      this.submitLoading = false
      this.dialogFormVisible = false
    },
    handleSelectionChange(val) {
      console.log(val)
      this.checkId = val
    },
    /**
     * 删除账号信息
     * @param id 唯一标识co
     */
    deleteItems() {
      this.$confirm('确定删除该条账号信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let arr = []
          this.checkId.forEach((item) => {
            arr.push(item.id)
          })
          this.$axios.post(`${globalConfig.server1}user/delete`, arr).then((res) => {
            this.$message[res.data.code === 200 ? 'success' : 'error'](res.data.message)
            this.getTableItems()
          })
        })
        .catch(() => {})
    },
    // 获取角色下拉框
    getRole() {
      this.$axios.post(`${globalConfig.server1}role/query`, this.params).then((res) => {
        if (res.data.code === 200) {
          let datas = res.data.data.records
          this.options = datas.map((item, index) => {
            this.norid = item.id
            return { label: item.roleName, value: item.id }
          })
        }
      })
    },

    /**
     * 分页操作
     * @param value
     */
    handleSizeChange(value) {
      this.conditionForm.pageNum = 1
      this.conditionForm.pageSize = value
      this.getTableItems()
    },
    handleCurrentChange(value) {
      this.conditionForm.pageNum = value
      this.getTableItems()
    },
  },
}
</script>
<style scoped  >
@import '../../../assets/css/base.css';
.user-manage .el-form {
  display: flex;
  flex-flow: row wrap;
}
.el-form-item {
  flex: 0 0 50%;
}
.user-manage .el-form-item .wrapper .search-bar > div.search-btnT .el-button {
  padding: 10px 20px !important;
}
.palte {
  width: 100%;
}
</style>
