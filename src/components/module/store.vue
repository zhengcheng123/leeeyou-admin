<template>
  <div class="store-all">
    <div class="content">
      <div class="row goods-row">
        <el-button v-if="pageAction==='info'"
                   icon="el-icon-edit-outline outline"
                   size="mini"
                   @click="editItem"
                   class="f-left adds-btn">编辑</el-button>
        <el-button v-if="pageAction==='edit'"
                   icon="el-icon-close"
                   @click="cancelItem"
                   class="f-left">取消</el-button>
      </div>
      <div class="form-section">
        <div class="section-head">
          基本信息
          <el-button v-if="pageAction ==='edit'"
                     type="text"
                     class
                     :loading="saving"
                     @click="saveItem">
            <i class="el-icon-download"></i>保存
          </el-button>
        </div>
        <div class="section-body basic-info">
          <el-form :model="itemForm"
                   ref="itemForm"
                   label-width="100px"
                   class="account-form"
                   :rules="pageAction==='edit'?itemFormRules:{}">
            <el-form-item label="店铺名称："
                          prop="name">
              <span v-if="pageAction==='info'">{{itemForm.name}}</span>
              <el-input v-else
                        v-model.trim="itemForm.name"></el-input>
            </el-form-item>
            <el-form-item label="店铺地址："
                          prop="address">
              <span v-if="pageAction==='info'">{{itemForm.address}}</span>
              <el-input v-else
                        v-model.trim="itemForm.address"></el-input>
            </el-form-item>
            <el-form-item label="店铺图标："
                          prop="icon">
              <image-upload :pageAction2="pageAction"
                            name="icon"
                            :uploaderMode="pageAction === 'info'?'viewImg':'replace'"
                            ref="iconUploader"
                            :externalPreviewImages="itemForm.icon?[$GETIMGHOST + itemForm.icon]:[]"
                            :limit="1"
                            width="100px"
                            height="100px"
                            :multiple="true"
                            accept="image/*"
                            :success="setIcon"
                            :uploadUrl="$IMGHOST + 'upload'"></image-upload>
            </el-form-item>
            <el-form-item label="店铺背景："
                          prop="index_html">
              <image-upload :pageAction2="pageAction"
                            name="index"
                            :uploaderMode="pageAction === 'info'?'viewImg':'replace'"
                            ref="indexUploader"
                            :externalPreviewImages="itemForm.indexHtml ? [$GETIMGHOST + itemForm.indexHtml] : []"
                            :limit="1"
                            accept="image/*"
                            width="100px"
                            height="100px"
                            :success="updateStore"
                            :uploadUrl="$IMGHOST + 'upload'"></image-upload>
            </el-form-item>
            <el-form-item label="客服电话："
                          prop="phones">
              <span v-if="pageAction==='info'">{{itemForm.phones}}</span>
              <el-input v-else
                        v-model.trim="itemForm.phones"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-section">
        <div class="section-head">类别管理</div>
        <div class="item-body1">
          <el-table :data="tableData"
                    style="width: 100%"
                    :row-class-name="tableRowClassName">
            <el-table-column prop="index"
                             label="分类页排序"
                             width="100"
                             align="center"
                             :resizable="false">
              <template slot-scope="scope">
                <div class="tableAdd"
                     v-if="scope.row.sort == '+'">
                  <p @click="changeName('add')">{{scope.row.sort}}</p>
                </div>
                <div class="tablebtn"
                     v-else>{{scope.row.index}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="名称"
                             width="280"
                             :resizable="false">
              <template slot-scope="scope">
                <div class="tablebtn">
                  <el-button type="text"
                             class="btn"
                             @click="changeName('edit',scope.row)">{{scope.row.name}}</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="操作"
                             width="150"
                             :resizable="false">
              <template slot-scope="scope">
                <div class="table_select">
                  <div class="tablebtn"
                       v-if="scope.row.sort == '+'"></div>
                  <div class="tablebtn"
                       v-else
                       @click="changedelte(scope.row)">
                    <el-button type="text"
                               class="btn">删除</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="padding-bottom:40px">&nbsp;&nbsp;&nbsp;</div>
      </div>
      <!-- <div class="form-section">
        <div class="section-head">收款方式
          <el-button v-if="prepareAddPay" type="text" @click="prepareAddPay = null">
            <i class="el-icon-close"></i>取消
          </el-button>
          <el-button v-else type="text" @click="addPayItem">
            <i class="el-icon-circle-plus-outline"></i>新增
          </el-button>
        </div>
        <div class="section-body pay-section">
          <el-row v-for="pay in itemForm.payTypeBeans" class="pay-item">
            <el-col :span="8">{{pay.name}}</el-col>
            <el-col :span="8" :offset="2">{{pay.pay_account}}</el-col>
            <el-col :span="4">
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-delete"
                @click="confirmDeletePay(pay.id)"
              ></el-button>
            </el-col>
          </el-row>
          <div class="item" v-if="prepareAddPay">
            <el-row>
              <el-col :span="6">
                <el-select v-model="prepareAddPay.payId" size="mini">
                  <el-option
                    v-for="item in payTypes"
                    :value="item.id"
                    :key="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-input size="mini" v-model.trim="prepareAddPay.payAccount"></el-input>
              </el-col>
              <el-col :span="6" :offset="2">
                <el-button size="mini" @click="addPay" :loading="saving">添加</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>-->
      <!-- <div class="form-section">
        <div class="section-head">收款方式
          <el-button v-if="prepareAddPay" type="text" @click="prepareAddPay = null">
            <i class="el-icon-close"></i>取消
          </el-button>
          <el-button v-else type="text" @click="addPayItem">
            <i class="el-icon-circle-plus-outline"></i>新增
          </el-button>
        </div>
        <div class="section-body pay-section">
          <el-row v-for="pay in itemForm.payTypeBeans" class="pay-item">
            <el-col :span="8">{{pay.name}}</el-col>
            <el-col :span="8" :offset="2">{{pay.pay_account}}</el-col>
            <el-col :span="4">
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-delete"
                @click="confirmDeletePay(pay.id)"
              ></el-button>
            </el-col>
          </el-row>
          <div class="item" v-if="prepareAddPay">
            <el-row>
              <el-col :span="6">
                <el-select v-model="prepareAddPay.payId" size="mini">
                  <el-option
                    v-for="item in payTypes"
                    :value="item.id"
                    :key="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-input size="mini" v-model.trim="prepareAddPay.payAccount"></el-input>
              </el-col>
              <el-col :span="6" :offset="2">
                <el-button size="mini" @click="addPay" :loading="saving">添加</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>-->
    </div>
    <!-- 更改名称弹框 -->
    <el-dialog :title="ruleForm.title"
               :visible.sync="changenamedialog"
               width="20%"
               class="form-d"
               :close-on-click-modal="false">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleFormName"
               class="ruleFormc">
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name"
                    autocomplete="off"
                    placeholder="请输入名称"
                    maxlength="10"></el-input>
          <p>不超过10个字符</p>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="changeguanbi">取 消</el-button>
        <el-button type="primary"
                   @click="changenameDetermine('ruleFormName')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog title="删除类别"
               :visible.sync="deteledialog"
               width="20%"
               :close-on-click-modal="false">
      <span>删除类别时请确认，该类别下无对应商品是否删除该类别？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deteledialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="deteleTab()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import imageUpload from '../custom-componets/ImageUpload'
import Sortable from 'sortablejs'

export default {
  components: { imageUpload, Sortable },
  data() {
    var validateCheckPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.logisticsCompanyForm.contactsMobile)) {
          callback(new Error('手机号码有误，请重填'))
          return false
        } else {
          callback()
        }
      }
    }

    var validatedutySort = (rule, value, callback) => {
      let isFlag = false
      this.tableData.map((el) => {
        if (el.name == this.ruleForm.name) {
          isFlag = true
        }
      })
      if (value === '') {
        callback(new Error('请输入名称'))
      } else if (this.ruleForm.title == '新增类别名称') {
        if (isFlag) {
          callback(new Error('名称已存在'))
        } else {
          callback()
        }
      } else if ((this.ruleForm.title = '修改名称')) {
        let a = false
        let row = JSON.parse(sessionStorage.getItem('row'))
        this.tableData.map((el) => {
          if (el.name !== row.name) {
            if (el.name == value) {
              a = true
            }
          }
        })
        if (a) {
          callback(new Error('名称已存在'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pageAction: 'info',
      itemForm: {
        id: -1,
        icon: '',
        name: '',
        storeMaster: null,
        address: '',
        indexHtml: '',
        activityId: null,
        gift: null,
        level: null,
        phones: '',
      },
      itemFormVisible: false,
      saving: false,
      itemFormRules: {
        name: [{ required: true, message: '请输入店铺名称' }],
        address: [{ required: true, message: '请输入店铺地址' }],
      },
      prepareAddPay: null,
      payTypes: [],
      logisticsCompanies: [],
      logisticsCompanyRules: {
        address: [{ required: true, message: '请输入自提地址' }],
        name: [{ required: true, message: '请输入物流公司名称' }],
        // name1:[{ required: true, message: "请输入联系人姓名" }],
        contactsName: [{ required: true, message: '请输入联系人姓名' }],
        contactsMobile: [{ required: true, validator: validateCheckPhone, trigger: 'blur' }],
      },
      logisticsTypes: [
        { id: 1, name: '物流公司' },
        { id: 2, name: '自提点' },
        // { id: 3, name: "无物流" }
      ],
      tableData: [],
      category: [
        {
          date: '2016-05-02',
          name: '一',
          id: 1,
        },
        {
          date: '2016-05-04',
          name: '二',
          id: 2,
        },
        {
          date: '2016-05-01',
          name: '三',
          id: 3,
        },
        {
          date: '2016-05-03',
          name: '四',
          id: 4,
        },
      ],
      changenamedialog: false,
      deteledialog: false,
      ruleForm: {
        name: '',
        title: '',
      },
      rules: {
        name: [
          {
            required: true,
            validator: validatedutySort,
            trigger: 'blur',
          },
        ],
      },
      freight: {
        num: '',
      },
      rulesFreight: {
        num: [{ required: true, message: '运费不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    maxTableHeight() {
      // the max height of table ,depend on what above on the table
      return document.body.clientHeight - 130
    },
  },
  created() {
    this.getItem()
    this.getLogisticsCompanies()
  },
  methods: {
    getLogisticsCompanies() {
      this.tableData = []
      this.$http
        .ajax({
          url: APIHOST + 'api/store/getLogisticsCompany',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.logisticsCompanies = res.object.list
            this.goodsType = res.object.goodsType
            this.goodsType.filter((el, index) => {
              this.tableData.push({
                ['name']: el.type_name,
                ['id']: el.id,
                ['sort']: el.sort,
                ['index']: index + 1,
              })
            })
            this.tableData[this.tableData.length] = { sort: '+' }
          } else {
            this.$message({ message: '获取物流公司列表失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('获取物流公司列表接口出错')
        })
    },

    addPayItem() {
      this.prepareAddPay = { payId: '', payAccount: '' }
    },
    addPay() {
      if (!this.prepareAddPay.payId) {
        this.$message.error('请选择收款方式')
        return false
      }
      if (!this.prepareAddPay.payAccount) {
        this.$message.error('请填写收款账号')
        return false
      }
      this.saving = true
      this.$http
        .ajax({
          url: APIHOST + 'api/store/addPayType',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({ list: [this.prepareAddPay] }),
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '添加成功', type: 'success' })
            this.getItem()
            this.prepareAddPay = null
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
        .fail(() => {
          console.log('添加付款方式接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
    cancelItem() {
      this.pageAction = 'info'
    },
    editItem(item) {
      this.pageAction = 'edit'
    },
    saveItem() {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(this.itemForm.phones)) {
        this.$message.error('电话号码错误')
        return false
      }
      this.$refs['itemForm'].validate((valid) => {
        if (valid) {
          this.$refs['iconUploader'].upload()
        } else {
          this.$message({ message: '信息填写错误', type: 'error' })
        }
      })
    },
    getItem() {
      this.$http
        .ajax({
          url: APIHOST + 'api/store/myStore',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.itemForm = res.object
            this.freight.num = this.itemForm.postage / 100
          } else {
            this.$message({ message: '获取店铺信息失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('获取店铺信息接口出错')
        })
    },
    getImagePath(uploadRes) {
      if (!uploadRes.length) {
        return ''
      }
      for (let index = 0; index < uploadRes.length; index++) {
        const element = uploadRes[index]
        if (element != '') {
          return element
        }
      }
      return ''
    },
    setIcon(uploadRes) {
      this.itemForm.icon = this.getImagePath(uploadRes)
      this.$refs['indexUploader'].upload()
      // this.updateStore(1,uploadRes)
    },

    updateStore(uploadRes) {
      this.itemForm.indexHtml = this.getImagePath(uploadRes)
      this.saving = true
      this.$http
        .ajax({
          url: APIHOST + 'api/store/update',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify(this.itemForm),
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '更新成功', type: 'success' })
            this.getItem()
            this.pageAction = 'info'
          } else {
            this.$message({ message: '更新失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('更新店铺信息接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },

    confirmDeletePay(id) {
      let confirmText = '删除此收款方式吗？'
      this.$confirm(confirmText, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deletePay(id)
        })
        .catch(() => {})
    },
    deletePay(id) {
      this.$http
        .ajax({
          url: APIHOST + 'api/store/deletePayType',
          type: 'get',
          data: { ids: id },
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '删除成功', type: 'success' })
            this.getItem()
          }
        })
    },
    sortItems({ prop, order }) {
      if (prop) {
        this.conditionForm.page.sortname = prop
        if (order === 'descending') {
          this.conditionForm.page.sortorder = 'desc'
        } else {
          this.conditionForm.page.sortorder = 'asc'
        }
      } else {
        this.conditionForm.page.sortname = 'id'
        this.conditionForm.page.sortorder = 'desc'
      }
      this.getItems()
    },
    selectionChange(selections) {
      this.selectedItems = selections.map((item) => {
        return item
      })
    },
    pageSizeChange(size) {
      this.conditionForm.page.pageSize = size
      this.getItems()
    },
    pageNoChange(no) {
      this.conditionForm.page.pageNum = no
      this.getItems()
    },
    resetForm: function () {
      this.$refs['itemForm'].resetFields()
      this.itemForm = {
        id: -1,
        name: '',
        storeMaster: null,
        address: '',
        indexHtml: '',
        activityId: null,
        gift: null,
        level: null,
      }
    },
    changeName(val, row) {
      this.changenamedialog = true
      if (val == 'edit') {
        this.ruleForm.title = '修改名称'
        this.ruleForm.name = row.name
      } else if (val == 'add') {
        this.ruleForm.title = '新增类别名称'
        this.ruleForm.name = ''
      }
      sessionStorage.setItem('row', JSON.stringify(row))
    },
    changenameDetermine(ruleFormName1) {
      this.$refs[ruleFormName1].validate((valid) => {
        if (valid) {
          let urlName = ''
          let nameArray = {}
          if (this.ruleForm.title == '新增类别名称') {
            urlName = 'api/goodsType/addType'
            nameArray.name = this.ruleForm.name
          } else {
            var row = JSON.parse(sessionStorage.getItem('row'))
            urlName = 'api/goodsType/updateTypeName'
            nameArray.name = this.ruleForm.name
            nameArray.id = row.id
          }
          this.$http
            .ajax({
              url: APIHOST + urlName,
              type: 'post',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify(nameArray),
              dataType: 'json',
              context: this,
            })
            .done((res) => {
              if (res.result == 1) {
                this.$message({ message: res.msg, type: 'success' })
                this.getLogisticsCompanies()
              }
            })
          this.changenamedialog = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeguanbi() {
      this.changenamedialog = false
      this.$refs['ruleFormName'].resetFields()
    },
    changedelte(idd) {
      this.$confirm('删除类别时请确认，该类别下无对应商品是否删除该类别？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .ajax({
              url: APIHOST + 'api/goodsType/deleteGoodsType',
              type: 'post',
              contentType: 'application/json; charset=utf-8',
              data: JSON.stringify({
                id: idd.id,
              }),
              dataType: 'json',
              context: this,
            })
            .done((res) => {
              if (res.result == 0) {
                this.$message({ message: res.msg, type: 'info' })
              } else {
                this.$message({ message: '删除成功', type: 'success' })
              }
              this.getLogisticsCompanies()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    checknum(value) {
      //如果输入非数字，则替换为''
      value.num = value.num.replace(/[^\d\.]/g, '')
      //必须保证第一个为数字而不是.
      value.num = value.num.replace(/^\./g, '')
      //前两位不能是0加数字
      value.num = value.num.replace(/^0\d[0-9]*/g, '')
      //保证只有出现一个.而没有多个.
      value.num = value.num.replace(/\.{2,}/g, '.')
      //保证.只出现一次，而不能出现两次以上
      value.num = value.num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两位小数
      value.num = value.num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.sort == '+') {
        return 'warning-row'
      } else {
        return 'success-row'
      }
      return ''
    },
  },
  mounted() {
    var $ul = this.$el.querySelector('.el-table__body-wrapper tbody')
    var that = this
    var updateFunc = function (event) {
      var newIndex = event.newIndex,
        oldIndex = event.oldIndex
      const currRow = that.tableData.splice(oldIndex, 1)[0]
      that.tableData.splice(newIndex, 0, currRow)
      // 暴力重新渲染！
      that.reRender = false
      // 借助nextTick和v-if重新渲染
      that.$nextTick(function () {
        that.reRender = true
        that.$nextTick(function () {
          // 重新渲染之后，重新进行Sortable绑定
          new Sortable(that.$el.querySelector('.el-table__body-wrapper tbody'), {
            draggable: '.success-row',
            onUpdate: updateFunc,
          })
        })
      })
      var tablechange = []
      for (let i = 0; i < that.tableData.length; i++) {
        tablechange.push({
          ['id']: that.tableData[i].id,
          ['sort']: i,
        })
        that.tableData[i].index = i + 1
      }
      tablechange.pop()
      that.$http
        .ajax({
          url: APIHOST + 'api/goodsType/dragSort',
          type: 'post',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(tablechange),
          dataType: 'json',
          context: this,
          async: false,
        })
        .done((res) => {
          if (res.result === 1) {
            that.$message({ message: res.msg, type: 'success' })
            // 排序刷新以后位置还是当前的位置
            //             setTimeout(()=>{
            // //             $('.el-table__body-wrapper')[0].parentNode.scrollIntoView(true);
            //             },100);
            that.getLogisticsCompanies()
          }
        })
    }
    new Sortable($ul, {
      draggable: '.success-row',
      onUpdate: updateFunc,
    })
  },
}
</script>
<style scoped>
.store-icon {
  width: 100px;
  height: 100px;
}

.pay-section {
  width: 500px;
}

.pay-item {
  margin-bottom: 10px;
}

.logistics-row {
  min-width: 800px;
  margin-bottom: 20px;
}

.basic-info {
  height: 470px;
}

.form-section {
  border-radius: 3px;
  background-color: #fff;
}

.form-section .section-head {
  position: relative;
  background-color: #f5f7fb;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  padding-left: 48px;
}

.form-section .section-body {
  padding: 30px 20px;
}
.form-section .el-button--text {
  position: absolute;
  right: 50px;
  color: #eb8600;
  background-color: #f5f7fb;
  border-color: #f5f7fb;
}

.item {
  display: flex;
  font-size: 14px;
  color: #5a5e66;
}

.item .item-label {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: right;
  padding-right: 20px;
}

.item-body {
  overflow-x: auto;
  width: 550px;
}
.goods-row {
  width: 100%;
  height: 80px;
  background-color: #fff;
  padding-left: 39px;
  border-radius: 3px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  -webkit-box-align: center;
}
.adds-btn {
  background-color: #eb8600;
  color: #fff;
  border-color: #eb8600;
  line-height: 0;
}
.outline {
  color: #fff;
}
</style>
<style>
.el-table .el-table__header-wrapper {
  background: #fff !important;
  border-radius: 0 !important;
}
.tablebtn .btn {
  background: none !important;
  border: none;
  color: #eb8600 !important;
  position: relative !important;
  left: 20px !important;
}
.table_select {
  display: flex;
}
.el-table {
  padding: 0;
}
.el-table th,
.el-table tr {
  /* background : none; */
  border-radius: 0 !important;
}
/* .table_select .el-select{
  padding-left:10px;
  width: 150px;
} */
.tablestore .el-table th.is-leaf {
  border-top: 1px solid #ebeef5 !important;
}
.item-body1 .el-table::before {
  height: 0px;
}
.item-body1 .el-table::after {
  height: 0px;
}
.el-table--border::after {
  background-color: black;
}
.el-table--border {
  border: none;
}
.tablestore .el-table__body,
.tablestore .el-table__footer,
.tablestore .el-table__header {
  border-left: 1px solid #ebeef5 !important;
  margin-left: 10px;
}
.tablestore .el-table__header {
  border-top: 1px solid #ebeef5 !important;
}
.item-body1 .el-table {
  padding-bottom: 1px !important;
}
.ruleFormc .el-input {
  width: 55%;
}
.ruleFormc p {
  color: #ccc;
  padding-right: 67px;
  font-size: 12px;
  padding-top: 3px;
}
.ruleFormc {
  padding-top: 10px;
}
.ruleFormc .el-form-item__error {
  top: 48%;
  left: 95px;
}
.form-d .el-dialog__footer {
  padding: 0px 20px 20px !important;
  margin-top: -35px;
}
.btnrad {
  margin-left: 5px;
  border-radius: 15px;
}
.item-body1 {
  position: relative;
  padding: 30px;
}
#css_table {
  /* position: absolute; */
  display: table;
  width: 531px;
  margin-left: 57px;
  margin-top: -20px;
  border-bottom: 1px solid #ebeef5;
  border-top: none;
  /* top: 259px;
  left: -27px; */
}
.css_tr {
  height: 45px;
  display: table-row;
  border-bottom: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
.css_td::nth-child(1) {
  width: 20px;
}
.css_td {
  display: table-cell;
  border-left: 1px solid #ebeef5;
  border-top: none;
  border-right: none;
  border-bottom: none;
}
.tdd {
  border-right: 1px solid #ebeef5;
}
.freightclass {
  width: 300px;
  padding-left: 20px;
  margin-right: 10px;
}
.freightclass .el-form-item__content {
  display: flex;
}
.freightclass .el-form-item__error {
  left: 34px;
}
.freightBtn {
  margin-left: 10px;
  margin-top: 3px;
}
.ptextfreight {
  font-size: 12px;
  color: #ccc;
  padding-left: 130px;
  padding-bottom: 20px;
}

.ruleFormc .el-form-item__error {
  top: 47%;
  left: 96px;
}
.tableAdd {
  font-size: 25px;
  text-align: center;
  color: #eb8600;
  padding-top: 10px;
  cursor: pointer;
}
.el-table__body-wrapper,
.el-table__footer-wrapper,
.el-table__header-wrapper {
  width: 100%;
}
.store-all .el-table td,
.el-table th {
  border: 1px solid #eee;
}
/* .store-all .el-form--inline .el-form-item:nth-child(1){
margin-right: 100px;
} */
</style>