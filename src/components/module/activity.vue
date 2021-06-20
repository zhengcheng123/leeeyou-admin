<template>
  <div>
    <div class="content">
      <div class="row">
        <el-button icon="plus" size="mini" @click="addItem" class="f-left">新增</el-button>
        <el-button icon="delete" size="mini" plain type="danger" @click="confirmDelete()" class="f-left">删除</el-button>
      </div>
      <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%"
                @sort-change="sortItems" :max-height="maxTableHeight"  :header-cell-style="{background:'#E8EAEE',height:'48px',}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="活动名称" sortable>
        </el-table-column>
        <el-table-column prop="num" label="达到要求满减要求的数量" sortable>
        </el-table-column>
        <el-table-column prop="price" label="达到要求满减要求的价格" sortable>
        </el-table-column>
        <el-table-column prop="discount" label="折扣" sortable>
        </el-table-column>
        <el-table-column prop="money" label="减去多少钱" sortable>
        </el-table-column>
        <el-table-column prop="gift_id" label="赠送礼品" sortable>
        </el-table-column>
        <el-table-column prop="type" label="活动类型,1" sortable>
        </el-table-column>
        <el-table-column label="操作" min-width="210">
          <template slot-scope="props">
            <div class="btn-group">
              <el-button type="text" @click="editItem(props.row)">编辑</el-button>
              <el-button type="text" @click="confirmDelete(props.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background class="pagination" @size-change="pageSizeChange" :page-sizes="[15,30,50,100]"
                     :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNum"
                     @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper"
                     :total="conditionForm.page.total">
      </el-pagination>
      <!--item form-->
      <el-dialog title="编辑" :visible.sync="itemFormVisible" size="tiny" custom-class="account-dialog"
                 @close="resetForm">
        <el-form :model="itemForm" ref="itemForm" label-width="70px" class="account-form"
                 :rules="itemFormRules">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model.trim="itemForm.name"></el-input>
          </el-form-item>
          <el-form-item label="达到要求满减要求的数量" prop="num">
            <el-input v-model.number="itemForm.num"></el-input>
          </el-form-item>
          <el-form-item label="达到要求满减要求的价格" prop="price">
            <el-input v-model.number="itemForm.price"></el-input>
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-input v-model.number="itemForm.discount"></el-input>
          </el-form-item>
          <el-form-item label="减去多少钱" prop="money">
            <el-input v-model.number="itemForm.money"></el-input>
          </el-form-item>
          <el-form-item label="赠送礼品" prop="giftId">
            <el-input v-model.number="itemForm.giftId"></el-input>
          </el-form-item>
          <el-form-item label="活动类型,1" prop="type">
            <el-input v-model.number="itemForm.type"></el-input>
          </el-form-item>
          <el-button type="primary" class="lg-btn" :loading="saving" @click="saveItem">保存</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        /* item form */
        itemForm: {
          id: -1,
          name: '',
          num: null,
          price: null,
          discount: null,
          money: null,
          giftId: null,
          type: null
        },
        itemFormVisible: false,
        saving: false,
        itemFormRules: {
          name: [
            {required: true, message: '请输入活动名称'}
          ],
          num: [
            {required: true, message: '请输入达到要求满减要求的数量'},
            {type: 'number', message: '值必须为数字'}
          ],
          price: [
            {required: true, message: '请输入达到要求满减要求的价格'},
            {type: 'number', message: '值必须为数字'}
          ],
          discount: [
            {required: true, message: '请输入折扣'},
            {type: 'number', message: '值必须为数字'}
          ],
          money: [
            {required: true, message: '请输入减去多少钱'},
            {type: 'number', message: '值必须为数字'}
          ],
          giftId: [
            {required: true, message: '请输入赠送礼品'},
            {type: 'number', message: '值必须为数字'}
          ],
          type: [
            {required: true, message: '请输入活动类型,1'},
            {type: 'number', message: '值必须为数字'}
          ]
        },
        /* table */
        currentItems: [],
        selectedItems: [],
        conditionForm: {
          item: {
            id: '',
            name: '',
            num: '',
            price: '',
            discount: '',
            money: '',
            giftId: '',
            type: ''
          },
          page: {
            pageSize: 15,
            pageNum: 1,
            total: 0,
            sortname: 'id',
            sortorder: 'desc'
          }
        }
      }
    },
    computed: {
      maxTableHeight () { // the max height of table ,depend on what above on the table
        return document.body.clientHeight - 123
      }
    },
    mounted () {
      this.getItems()
    },
    methods: {
      /* item form */
      addItem () {
        this.itemFormVisible = true
      },
      editItem (item) {
        this.itemForm.id = item.id
        this.itemForm.name = item.name
        this.itemForm.num = item.num
        this.itemForm.price = item.price
        this.itemForm.discount = item.discount
        this.itemForm.money = item.money
        this.itemForm.giftId = item.gift_id
        this.itemForm.type = item.type
        this.itemFormVisible = true
      },
      saveItem () {
        this.$refs['itemForm'].validate(valid => {
          if (valid) {
            this.saving = true
            let url = 'api/activity/add'
            if (this.itemForm.id !== -1) {
              url = 'api/activity/update'
            }
            this.$http.ajax({
              url: APIHOST + url,
              contentType: 'application/json; charset=utf-8',
              type: 'post',
              dataType: 'json',
              data: JSON.stringify(this.itemForm),
              context: this
            }).done(res => {
              if (res.result === 1) {
                this.$message({message: '保存成功', type: 'success'})
                this.itemFormVisible = false
                this.getItems()
              } else {
                this.$message({message: '保存失败', type: 'error'})
              }
            }).fail(() => {
              console.log('目标数据保存接口出错')
            }).always(() => {
              this.saving = false
            })
          } else {
            this.$message({message: '信息填写错误', type: 'error'})
          }
        })
      },
      confirmDelete (ids = 0) {
        let confirmText = '删除此项目吗？'
        if (!ids) { // 勾选操作
          confirmText = '确定删除选中的项目吗？'
          ids = this.selectedItems.map(ele => {
            return ele.id
          })
          if (!ids.length) { // 没有勾选
            this.$message({message: '请至少选择一项', type: 'info'})
            return false
          } else {
            ids = ids.join(',')
          }
        }
        this.$confirm(confirmText, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.deleteItem(ids)
        }).catch(() => {
        })
      },
      deleteItem (id) {
        this.$http.ajax({
          url: APIHOST + 'api/activity/delete',
          type: 'get',
          data: {id: id},
          dataType: 'json',
          context: this
        }).done(res => {
          if (res.result === 1) {
            this.$message({message: '删除成功', type: 'success'})
            this.getItems()
          }
        })
      }, /* table 必备 */
      getItems () {
        this.$http.ajax({
          url: APIHOST + 'api/activity/list',
          contentType: 'application/json; charset=utf-8', // 是否json提交
          dataType: 'json',
          type: 'post',
          data: JSON.stringify(this.conditionForm),
          context: this
        }).done(res => {
          if (res.result === 1) {
            if (res.list <= 0) {
              this.$message({message: '没有找到匹配项', type: 'info'})
              return false
            }
            this.currentItems = res.list
            this.conditionForm.page.pageNum = res.page.pageNum
            this.conditionForm.page.total = res.page.total
            this.conditionForm.page.pageSize = res.page.pageSize
          } else {
            this.$message({message: '获取入库列表失败', type: 'error'})
          }
        })
      },
      sortItems ({prop, order}) {
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
      selectionChange (selections) {
        this.selectedItems = selections.map(item => {
          return item
        })
      },
      pageSizeChange (size) {
        this.conditionForm.page.pageSize = size
        this.getItems()
      },
      pageNoChange (no) {
        this.conditionForm.page.pageNum = no
        this.getItems()
      },
      resetForm: function () {
        this.$refs['itemForm'].resetFields()
        this.itemForm = {
          id: -1,
          name: '',
          num: null,
          price: null,
          discount: null,
          money: null,
          giftId: null,
          type: null
        }
      }
    }
  }
</script>
<style scoped>
</style>
