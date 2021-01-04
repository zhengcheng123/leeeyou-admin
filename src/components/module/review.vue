<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="fa fa-users" aria-hidden="true"></i>
          review
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="row">
        <el-button icon="plus" size="small" @click="addItem" class="f-left">新增</el-button>
        <el-button icon="delete" size="small" plain type="danger" @click="confirmDelete()" class="f-left">删除</el-button>
      </div>
      <el-table :data="currentItems" @selection-change="selectionChange" border style="width: 100%"
                @sort-change="sortItems" :max-height="maxTableHeight"  :header-cell-style="{background:'#E8EAEE',height:'48px',}">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="store_id" label="店铺" sortable>
        </el-table-column>
        <el-table-column prop="goods_id" label="商品id" sortable>
        </el-table-column>
        <el-table-column prop="buyer_id" label="购买者id" sortable>
        </el-table-column>
        <el-table-column prop="deal_id" label="处理订单者id" sortable>
        </el-table-column>
        <el-table-column prop="content" label="评论类容" sortable>
        </el-table-column>
        <el-table-column prop="pic1" label="图1" sortable>
        </el-table-column>
        <el-table-column prop="pic2" label="图2" sortable>
        </el-table-column>
        <el-table-column prop="pic3" label="图3" sortable>
        </el-table-column>
        <el-table-column prop="pic4" label="图4" sortable>
        </el-table-column>
        <el-table-column prop="type" label="评论类型，0：好评，1：中评，3：差评" sortable>
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
      <el-pagination class="pagination" @size-change="pageSizeChange" :page-sizes="[15,30,50,100]"
                     :page-size="conditionForm.page.pageSize" :current-page="conditionForm.page.pageNum"
                     @current-change="pageNoChange" layout="total, sizes,prev, pager, next, jumper"
                     :total="conditionForm.page.total">
      </el-pagination>
      <!--item form-->
      <el-dialog title="编辑" :visible.sync="itemFormVisible" size="tiny" custom-class="account-dialog"
                 @close="resetForm">
        <el-form :model="itemForm" ref="itemForm" label-width="70px" class="account-form"
                 :rules="itemFormRules">
          <el-form-item label="店铺" prop="storeId">
            <el-input v-model.number="itemForm.storeId"></el-input>
          </el-form-item>
          <el-form-item label="商品id" prop="goodsId">
            <el-input v-model.number="itemForm.goodsId"></el-input>
          </el-form-item>
          <el-form-item label="购买者id" prop="buyerId">
            <el-input v-model.number="itemForm.buyerId"></el-input>
          </el-form-item>
          <el-form-item label="处理订单者id" prop="dealId">
            <el-input v-model.number="itemForm.dealId"></el-input>
          </el-form-item>
          <el-form-item label="评论类容" prop="content">
            <el-input v-model.trim="itemForm.content"></el-input>
          </el-form-item>
          <el-form-item label="图1" prop="pic1">
            <el-input v-model.trim="itemForm.pic1"></el-input>
          </el-form-item>
          <el-form-item label="图2" prop="pic2">
            <el-input v-model.trim="itemForm.pic2"></el-input>
          </el-form-item>
          <el-form-item label="图3" prop="pic3">
            <el-input v-model.trim="itemForm.pic3"></el-input>
          </el-form-item>
          <el-form-item label="图4" prop="pic4">
            <el-input v-model.trim="itemForm.pic4"></el-input>
          </el-form-item>
          <el-form-item label="评论类型，0：好评，1：中评，3：差评" prop="type">
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
          storeId: null,
          goodsId: null,
          buyerId: null,
          dealId: null,
          content: '',
          pic1: '',
          pic2: '',
          pic3: '',
          pic4: '',
          type: null
        },
        itemFormVisible: false,
        saving: false,
        itemFormRules: {
          storeId: [
            {required: true, message: '请输入店铺'},
            {type: 'number', message: '值必须为数字'}
          ],
          goodsId: [
            {required: true, message: '请输入商品id'},
            {type: 'number', message: '值必须为数字'}
          ],
          buyerId: [
            {required: true, message: '请输入购买者id'},
            {type: 'number', message: '值必须为数字'}
          ],
          dealId: [
            {required: true, message: '请输入处理订单者id'},
            {type: 'number', message: '值必须为数字'}
          ],
          content: [
            {required: true, message: '请输入评论类容'}
          ],
          pic1: [
            {required: true, message: '请输入图1'}
          ],
          pic2: [
            {required: true, message: '请输入图2'}
          ],
          pic3: [
            {required: true, message: '请输入图3'}
          ],
          pic4: [
            {required: true, message: '请输入图4'}
          ],
          type: [
            {required: true, message: '请输入评论类型，0：好评，1：中评，3：差评'},
            {type: 'number', message: '值必须为数字'}
          ]
        },
        /* table */
        currentItems: [],
        selectedItems: [],
        conditionForm: {
          item: {
            id: '',
            storeId: '',
            goodsId: '',
            buyerId: '',
            dealId: '',
            content: '',
            pic1: '',
            pic2: '',
            pic3: '',
            pic4: '',
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
        this.itemForm.storeId = item.store_id
        this.itemForm.goodsId = item.goods_id
        this.itemForm.buyerId = item.buyer_id
        this.itemForm.dealId = item.deal_id
        this.itemForm.content = item.content
        this.itemForm.pic1 = item.pic1
        this.itemForm.pic2 = item.pic2
        this.itemForm.pic3 = item.pic3
        this.itemForm.pic4 = item.pic4
        this.itemForm.type = item.type
        this.itemFormVisible = true
      },
      saveItem () {
        this.$refs['itemForm'].validate(valid => {
          if (valid) {
            this.saving = true
            let url = 'api/review/add'
            if (this.itemForm.id !== -1) {
              url = 'api/review/update'
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
          url: APIHOST + 'api/review/delete',
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
          url: APIHOST + 'api/review/list',
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
          storeId: null,
          goodsId: null,
          buyerId: null,
          dealId: null,
          content: '',
          pic1: '',
          pic2: '',
          pic3: '',
          pic4: '',
          type: null
        }
      }
    }
  }
</script>
<style scoped>
</style>
