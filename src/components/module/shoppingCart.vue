<template>
  <div>
    <div class="content">
      <div class="row">
        <el-button icon="plus"
                   size="mini"
                   @click="addItem"
                   class="f-left">新增</el-button>
        <el-button icon="delete"
                   size="mini"
                   plain
                   type="danger"
                   @click="confirmDelete()"
                   class="f-left">删除</el-button>
      </div>
      <el-table :data="currentItems"
                @selection-change="selectionChange"
                border
                style="width: 100%"
                @sort-change="sortItems"
                :max-height="maxTableHeight"
                :header-cell-style="{background:'#E8EAEE',height:'48px',}">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop="buyer_id"
                         label="购物者id"
                         sortable>
        </el-table-column>
        <el-table-column prop="goods_id"
                         label="商品id"
                         sortable>
        </el-table-column>
        <el-table-column prop="num"
                         label="数量"
                         sortable>
        </el-table-column>
        <el-table-column prop="seller_id"
                         label="卖家id，店铺id"
                         sortable>
        </el-table-column>
        <el-table-column prop="create_time"
                         label="加入购物车的时间"
                         sortable>
        </el-table-column>
        <el-table-column prop="is_checked"
                         label="是否勾选，0：未勾选，1：勾选"
                         sortable>
        </el-table-column>
        <el-table-column label="操作"
                         min-width="210">
          <template slot-scope="props">
            <div class="btn-group">
              <el-button type="text"
                         @click="editItem(props.row)">编辑</el-button>
              <el-button type="text"
                         @click="confirmDelete(props.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="pagination"
                     @size-change="pageSizeChange"
                     :page-sizes="[15,30,50,100]"
                     :page-size="conditionForm.page.pageSize"
                     :current-page="conditionForm.page.pageNum"
                     @current-change="pageNoChange"
                     layout="total, sizes,prev, pager, next, jumper"
                     :total="conditionForm.page.total">
      </el-pagination>
      <!--item form-->
      <el-dialog title="编辑"
                 :visible.sync="itemFormVisible"
                 size="tiny"
                 custom-class="account-dialog"
                 @close="resetForm">
        <el-form :model="itemForm"
                 ref="itemForm"
                 label-width="70px"
                 class="account-form"
                 :rules="itemFormRules">
          <el-form-item label="购物者id"
                        prop="buyerId">
            <el-input v-model.number="itemForm.buyerId"></el-input>
          </el-form-item>
          <el-form-item label="商品id"
                        prop="goodsId">
            <el-input v-model.number="itemForm.goodsId"></el-input>
          </el-form-item>
          <el-form-item label="数量"
                        prop="num">
            <el-input v-model.number="itemForm.num"></el-input>
          </el-form-item>
          <el-form-item label="卖家id，店铺id"
                        prop="sellerId">
            <el-input v-model.number="itemForm.sellerId"></el-input>
          </el-form-item>
          <el-form-item label="加入购物车的时间"
                        prop="createTime">
            <el-input v-model.number="itemForm.createTime"></el-input>
          </el-form-item>
          <el-form-item label="是否勾选，0：未勾选，1：勾选"
                        prop="isChecked">
            <el-input v-model.number="itemForm.isChecked"></el-input>
          </el-form-item>
          <el-button type="primary"
                     class="lg-btn"
                     :loading="saving"
                     @click="saveItem">保存</el-button>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      /* item form */
      itemForm: {
        id: -1,
        buyerId: null,
        goodsId: null,
        num: null,
        sellerId: null,
        createTime: null,
        isChecked: null,
      },
      itemFormVisible: false,
      saving: false,
      itemFormRules: {
        buyerId: [
          { required: true, message: '请输入购物者id' },
          { type: 'number', message: '值必须为数字' },
        ],
        goodsId: [
          { required: true, message: '请输入商品id' },
          { type: 'number', message: '值必须为数字' },
        ],
        num: [
          { required: true, message: '请输入数量' },
          { type: 'number', message: '值必须为数字' },
        ],
        sellerId: [
          { required: true, message: '请输入卖家id，店铺id' },
          { type: 'number', message: '值必须为数字' },
        ],
        createTime: [
          { required: true, message: '请输入加入购物车的时间' },
          { type: 'number', message: '值必须为数字' },
        ],
        isChecked: [
          { required: true, message: '请输入是否勾选，0：未勾选，1：勾选' },
          { type: 'number', message: '值必须为数字' },
        ],
      },
      /* table */
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        item: {
          id: '',
          buyerId: '',
          goodsId: '',
          num: '',
          sellerId: '',
          createTime: '',
          isChecked: '',
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: 'id',
          sortorder: 'desc',
        },
      },
    }
  },
  computed: {
    maxTableHeight() {
      // the max height of table ,depend on what above on the table
      return document.body.clientHeight - 123
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    /* item form */
    addItem() {
      this.itemFormVisible = true
    },
    editItem(item) {
      this.itemForm.id = item.id
      this.itemForm.buyerId = item.buyer_id
      this.itemForm.goodsId = item.goods_id
      this.itemForm.num = item.num
      this.itemForm.sellerId = item.seller_id
      this.itemForm.createTime = item.create_time
      this.itemForm.isChecked = item.is_checked
      this.itemFormVisible = true
    },
    saveItem() {
      this.$refs['itemForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          let url = 'api/shoppingCart/add'
          if (this.itemForm.id !== -1) {
            url = 'api/shoppingCart/update'
          }
          this.$http
            .ajax({
              url: APIHOST + url,
              contentType: 'application/json; charset=utf-8',
              type: 'post',
              dataType: 'json',
              data: JSON.stringify(this.itemForm),
              context: this,
            })
            .done((res) => {
              if (res.result === 1) {
                this.$message({ message: '保存成功', type: 'success' })
                this.itemFormVisible = false
                this.getItems()
              } else {
                this.$message({ message: '保存失败', type: 'error' })
              }
            })
            .fail(() => {
              console.log('目标数据保存接口出错')
            })
            .always(() => {
              this.saving = false
            })
        } else {
          this.$message({ message: '信息填写错误', type: 'error' })
        }
      })
    },
    confirmDelete(ids = 0) {
      let confirmText = '删除此项目吗？'
      if (!ids) {
        // 勾选操作
        confirmText = '确定删除选中的项目吗？'
        ids = this.selectedItems.map((ele) => {
          return ele.id
        })
        if (!ids.length) {
          // 没有勾选
          this.$message({ message: '请至少选择一项', type: 'info' })
          return false
        } else {
          ids = ids.join(',')
        }
      }
      this.$confirm(confirmText, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      })
        .then(() => {
          this.deleteItem(ids)
        })
        .catch(() => {})
    },
    deleteItem(id) {
      this.$http
        .ajax({
          url: APIHOST + 'api/shoppingCart/delete',
          type: 'get',
          data: { id: id },
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '删除成功', type: 'success' })
            this.getItems()
          }
        })
    } /* table 必备 */,
    getItems() {
      this.$http
        .ajax({
          url: APIHOST + 'api/shoppingCart/list',
          contentType: 'application/json; charset=utf-8', // 是否json提交
          dataType: 'json',
          type: 'post',
          data: JSON.stringify(this.conditionForm),
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            if (res.list <= 0) {
              this.$message({ message: '没有找到匹配项', type: 'info' })
              return false
            }
            this.currentItems = res.list
            this.conditionForm.page.pageNum = res.page.pageNum
            this.conditionForm.page.total = res.page.total
            this.conditionForm.page.pageSize = res.page.pageSize
          } else {
            this.$message({ message: '获取入库列表失败', type: 'error' })
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
        buyerId: null,
        goodsId: null,
        num: null,
        sellerId: null,
        createTime: null,
        isChecked: null,
      }
    },
  },
}
</script>
<style scoped>
</style>
