<template>
  <div class="wrapper">
    <div class="search_bar">
      <!-- <div class="row"> -->
      <!--<el-button icon="el-icon-delete" size="mini" plain type="danger" @click="confirmDelete()"-->
      <!--class="f-left">删除-->
      <!--</el-button>-->
      <!-- </div> -->
      <el-form :inline="true">
        <el-form-item label="商品名称"
                      prop="name">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.condition.name"></el-input>
        </el-form-item>
        <el-form-item label="销售状态"
                      prop="state">
          <el-select size="mini"
                     v-model="conditionForm.condition.state">
            <el-option v-for="item in saleOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型"
                      prop="type">
          <el-select clearable
                     size="mini"
                     v-model="conditionForm.condition.type">
            <el-option v-for="item in states"
                       :key="item.id"
                       :label="item.typeName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热销商品"
                      prop="state">
          <el-select clearable
                     size="mini"
                     v-model="conditionForm.condition.recommend">
            <el-option v-for="item in recommendOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="right">
        <el-button size="mini"
                   type="primary"
                   icon="el-icon-search"
                   @click="search">搜索</el-button>
        <el-button size="mini"
                   icon="el-icon-refresh-right"
                   @click="resetSearch">重置</el-button>

      </div>
    </div>
    <section v-loading="tableLoading">
      <div class="operate_bar">
        <!-- <el-button size="mini" @click="confirmBan" class="f-left">下架</el-button>
          <el-button size="mini" @click="confirmPut" class="f-left">上架</el-button>-->
        <div class="left">
          <el-button size="mini"
                     @click="addItem">添加商品</el-button>
        </div>

      </div>
      <!-- @selection-change="selectionChange" -->
      <!-- :height="tableHeight" -->

      <el-table :data="currentItems"
                @sort-change="sortItems"
                height="0"
                :header-cell-style="{background:'var(--background1)'}">
        <!-- <el-table-column 
                           type="selection"
                           width="55"></el-table-column> -->
        <el-table-column width="80"
                         prop="typeName"
                         label="类型"></el-table-column>
        <el-table-column min-width="120"
                         prop="name"
                         label="名称"></el-table-column>
        <el-table-column width="80"
                         prop="canSellSize"
                         label="库存"></el-table-column>
        <el-table-column width="80"
                         prop="sellSize"
                         label="销量"></el-table-column>
        <!-- <el-table-column  min-width="120" prop="maxPrice" label="最高价"></el-table-column>
          <el-table-column  min-width="120" prop="minPrice" label="最低价"></el-table-column>-->

        <el-table-column min-width="200"
                         prop="description"
                         label="商品描述"></el-table-column>
        <!-- <el-table-column  min-width="110" prop="sellStat" label="销售状态">
            <template slot-scope="props">
              <span v-if="props.row.sellStat != -1">在售</span>
              <span v-else>停售</span>
            </template>
          </el-table-column>-->
        <el-table-column width="160"
                         prop="sellStat"
                         label="销售状态">
          <template slot-scope="props">
            <el-switch v-model="props.row.sellStat"
                       size="mini"
                       active-text="上架"
                       inactive-text="下架"
                       active-value="1"
                       inactive-value="-1"
                       @change="updateSwitch($event, props.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="120"
                         sortable
                         prop="enable"
                         label="热销商品">
          <template slot-scope="props">
            <el-switch :disabled="props.row.sellStat!=1"
                       size="mini"
                       v-model="props.row.recommend"
                       active-value="1"
                       inactive-value="0"
                       @change="goodsSwitch($event, props.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="120"
                         sortable
                         label="排序">
          <template slot-scope="props">
            <el-input @keyup.native="sortInfo(props.row)"
                      size="mini"
                      v-model="props.row.sort"
                      style="width:60px"
                      placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="200"
                         label="操作">
          <template slot-scope="props">
            <el-button type="text"
                       @click="getQRCode(props.row)">二维码</el-button>
            <el-button type="text"
                       @click="infoGoods(props.row,'info')">详情</el-button>
            <el-button type="text"
                       @click="infoGoods(props.row, 'edit')">编辑</el-button>
            <!-- <el-button type="text"
                       @click="confirmDelete(props.row.id)">删除</el-button> -->
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
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="conditionForm.page.total" />
    </section>
    <el-dialog title="编辑"
               :visible.sync="itemFormVisible"
               size="tiny"
               custom-class="goods-dialog"
               @close="resetForm">
      <el-form :model="itemForm"
               ref="itemForm"
               label-width="90px"
               class="account-form"
               :rules="itemFormRules">
        <el-form-item label="商品名称"
                      prop="name">
          <span>{{itemForm.name}}</span>
          <!--<el-input v-model.trim="itemForm.name"></el-input>-->
        </el-form-item>
        <el-form-item label="商品描述"
                      prop="description">
          <el-input v-model.trim="itemForm.description"></el-input>
        </el-form-item>
        <el-form-item label="定价"
                      prop="priceDollar">
          <el-input v-model.number="itemForm.priceDollar"></el-input>
        </el-form-item>
        <el-form-item label="成本"
                      prop="procurementPriceDollar">
          <el-input v-model.number="itemForm.procurementPriceDollar"></el-input>
        </el-form-item>
        <el-form-item label="运费"
                      prop="transformFeeDollar">
          <el-input v-model.number="itemForm.transformFeeDollar"></el-input>
        </el-form-item>
        <el-form-item label="可售库存"
                      prop="canSellSize">
          <el-input v-model.number="itemForm.canSellSize"></el-input>
        </el-form-item>
        <el-form-item label="总库存"
                      prop="size">
          <el-input v-model.number="itemForm.size"></el-input>
        </el-form-item>
        <el-form-item label="已售"
                      prop="sellSize">
          <span>{{itemForm.sellSize}}</span>
          <!--<el-input v-model.number="itemForm.sellSize"></el-input>-->
        </el-form-item>
        <el-button type="primary"
                   class="lg-btn"
                   :loading="saving"
                   @click="updateGoods">保存</el-button>
      </el-form>
    </el-dialog>
    <el-dialog :title="DRname"
               :visible.sync="QRVisible"
               width="30%"
               size="tiny"
               class="ORstyle"
               custom-class="goods-dialog">
      <canvas id="QRCode"></canvas>
    </el-dialog>
  </div>
</template>
<script>
import QRCode from 'qrcode'
export default {
  data() {
    return {
      pagedata: '',
      sellStat1: '',
      sellStat: 1,
      recommend: '',
      tableLoading: false,
      DRname: '',
      QRCodeMsg: '',
      QRVisible: false,
      itemForm: {
        goodsCommonId: -1,
        price: null,
        priceDollar: '',
        procurementPriceDollar: '',
        transformFeeDollar: '',
        name: '',
        canSellSize: null,
        sellSize: null,
        size: null,
      },
      itemFormVisible: false,
      saving: false,
      itemFormRules: {
        priceDollar: [
          { required: true, message: '请输入商品标价' },
          { type: 'number', message: '值必须为数字' },
        ],
        procurementPriceDollar: [
          { required: true, message: '请输入商品成本' },
          { type: 'number', message: '值必须为数字' },
        ],
        canSellSize: [
          { required: true, message: '请输入可售库存' },
          { type: 'number', message: '值必须为数字' },
        ],
        size: [
          { required: true, message: '请输入库存' },
          { type: 'number', message: '值必须为数字' },
        ],
      },
      /* table */
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        condition: {
          name: '',
          type: null,
          state: '1',
          recommend: '',
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: 'id',
          sortorder: 'desc',
        },
      },
      saleOptions: [
        {
          value: '1',
          label: '在售',
        },
        {
          value: '-1',
          label: '停售',
        },
      ],
      recommendOptions: [
        {
          value: '1',
          label: '热销商品',
        },
        {
          value: '0',
          label: '非热销商品',
        },
      ],
      sellWell: [
        {
          sort: 1,
          label: '1',
        },
        {
          sort: 2,
          label: '2',
        },
        {
          sort: 3,
          label: '3',
        },
        {
          sort: 4,
          label: '4',
        },
        {
          sort: 5,
          label: '5',
        },
        {
          sort: 6,
          label: '6',
        },
        {
          sort: 10,
          label: '取消热销',
        },
      ],
      radioSell: '',
      sortValue: '',
      states: [],
    }
  },

  computed: {
    tableHeight() {
      // the max height of table ,depend on what above on the table
      return 500
    },
  },
  mounted() {
    this.getItems()
    this.getCommonTypes()
  },
  watch: {
    // 通过监听获取数据
    QRCodeMsg(val) {
      // 获取页面的canvas
      var msg = document.getElementById('QRCode')
      // 将获取到的数据（val）画到msg（canvas）上
      QRCode.toCanvas(msg, val, function (error) {
        console.log(error)
      })
    },
  },
  methods: {
    getQRCode(row) {
      this.QRVisible = true
      this.DRname = row.name + '(右击图片另存为)'
      this.$nextTick(() => {
        // this.QRCodeMsg = "http://tom.zhengcheng.club/tom/#/item/" + row.id;
        this.QRCodeMsg = 'http://www.leeeyou.com/item/' + row.id
      })
    },

    pennyToDollar(penny) {
      return penny / 100
    },
    confirmBan() {
      if (!this.selectedItems.length) {
        // 没有勾选
        this.$message({ message: '请至少选择一项', type: 'info' })
        return false
      }
      this.$confirm('确认下架选择的商品吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.ban(
            this.selectedItems.map((ele) => {
              return ele.id
            })
          )
        })
        .catch(() => {})
    },

    confirmPut() {
      if (!this.selectedItems.length) {
        // 没有勾选
        this.$message({ message: '请至少选择一项', type: 'info' })
        return false
      }
      this.$confirm('确认上架选择的商品吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      })
        .then(() => {
          this.put(
            this.selectedItems.map((ele) => {
              return ele.id
            })
          )
        })
        .catch(() => {})
    },
    search() {
      // reset pages and query
      this.conditionForm.page = this.$options.data().conditionForm.page
      this.getItems()
    },
    resetSearch() {
      this.conditionForm = this.$options.data().conditionForm
      this.getItems()
    },
    infoGoods(good, action) {
      sessionStorage.removeItem('infoGood')
      sessionStorage.setItem('infoGood', JSON.stringify(good))
      this.$router.push({ path: '/goods/' + action, query: { id: good.id } })
    },
    /* item form */
    addItem() {
      this.$router.push('goods/add')
    },
    editItem(item) {
      this.itemForm.goodsCommonId = item.id
      this.itemForm.name = item.name
      this.itemForm.description = item.description
      this.itemForm.priceDollar = item.price / 100
      this.itemForm.procurementPriceDollar = item.procurement_price / 100
      this.itemForm.transformFeeDollar = item.transform_fee / 100
      this.itemForm.canSellSize = item.can_sell_size
      this.itemForm.sellSize = item.sell_size
      this.itemForm.size = item.size
      this.itemFormVisible = true
    },
    updateGoods() {
      this.$refs['itemForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          let url = 'api/goods/add'
          if (this.itemForm.goodsCommonId !== -1) {
            url = 'api/goods/updateGoods'
          }
          this.itemForm.price = this.itemForm.priceDollar * 100
          this.itemForm.procurementPrice = this.itemForm.procurementPriceDollar * 100
          this.itemForm.transformFee = this.itemForm.transformFeeDollar * 100
          let updateGoodsForm = {
            goodsCommon: {
              id: this.itemForm.goodsCommonId,
              transformFee: this.itemForm.transformFee,
              description: this.itemForm.description,
            },
            goods: {
              canSellSize: this.itemForm.canSellSize,
              goodsCommonId: this.itemForm.goodsCommonId,
              price: this.itemForm.price,
              procurementPrice: this.itemForm.procurementPrice,
              size: this.itemForm.size,
            },
          }
          this.saving = true

          this.$axios
            .post(globalConfig.server1 + url)
            .then((res) => {
              if (res.data.result === 1) {
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
      this.$axios.post(globalConfig.server1 + 'api/goods/deleteByName/' + id).then((res) => {
        if (res.data.result === 1) {
          this.$message({ message: '删除成功', type: 'success' })
          this.getItems()
        } else {
        }
      })
    },
    getItems() {
      this.tableLoading = true
      this.$axios.post(globalConfig.server1 + 'api/goods/list', this.conditionForm).then((res) => {
        if (res.data.result === 1) {
          if (res.list <= 0) {
            this.$message({ message: '没有找到匹配项', type: 'info' })
            return false
          }
          this.currentItems = res.data.list
          this.conditionForm.page.pageNum = res.data.page.pageNum
          this.conditionForm.page.total = res.data.page.total
          this.conditionForm.page.pageSize = res.data.page.pageSize
          this.currentItems.map((ele, index) => {
            ele.recommend += ''
            ele.sellStat += ''
            return ele
          })
          sessionStorage.setItem('currentItems', JSON.stringify(this.currentItems))
        } else {
          this.$message({ message: '获取入库列表失败', type: 'error' })
          this.currentItems = []
        }
        setTimeout(() => {
          this.tableLoading = false
        }, 300)
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
        goodsCommonId: -1,
        price: null,
        name: '',
        description: '',
        canSellSize: null,
        sellSize: null,
        size: null,
      }
    },

    //商品分类的接口
    getCommonTypes() {
      this.$axios.post(globalConfig.server1 + 'api/goodsType/getTypesByLevel/2').then((res) => {
        if (res.data.result === 1) {
          this.states = res.data.object
          this.states.map((item) => {
            return item
          })
        } else {
        }
      })
    },

    /**
     * 状态 - 启用/禁用
     * @param { sid } 员工唯一标识
     */
    goodsSwitch(event, uid) {
      this.$axios
        .post(`${globalConfig.server1}api/goods/updateRecommend`, {
          id: uid.id,
          recommend: event,
        })
        .then((res) => {
          this.$message[res.data.code === 200 ? 'success' : 'error'](res.data.message)
        })
      this.getItems()
    },

    // 排序
    sortInfo(event, id) {
      this.$axios.get(`${globalConfig.server1}api/goods/${event.id}/sort/${event.sort}`).then((res) => {
        this.$message[res.data.result === 1 ? 'success' : 'error'](res.data.msg)
        this.getItems()
      })
    },

    // 上下架
    updateSwitch(event, uid) {
      this.$axios
        .post(`${globalConfig.server1}api/goods/updateStat`, {
          id: uid.id,
          sellStat: event,
        })
        .then((res) => {
          this.$message[res.data.result === 1 ? 'success' : 'error'](res.data.msg)
        })
      this.getItems()
    },
  },
}
</script>
<style scoped>
.el-table--border {
  padding-top: 20px;
}

#QRCode {
  display: inline-block;
  width: 200px !important;
  height: 200px !important;
}
</style>
<style>
.se-table .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
/deep/.goods-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-align: center;
}
.section-add {
  display: inline-block;
  float: right;
  padding: 10px;
  padding-right: 3%;
}
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
<style scoped>
.btn-group .el-select {
  max-width: 120px;
  padding-left: 10px;
}
.sellw .el-select-dropdown__item {
  color: #eb8600;
}
</style>
<style>
.active .el-input__inner {
  color: #eb8600;
}
.active .el-input.is-disabled .el-input__inner {
  color: #eb8600;
}
.el-message-box__status {
  top: 50%;
  left: 101px;
}
.sellwell {
  display: flex;
  justify-content: center;
}
.btn-group .el-radio__input.is-checked + .el-radio__label {
  color: #eb8600 !important;
}
.btn-group .el-radio__input.is-checked .el-radio__inner {
  border-color: #eb8600 !important;
  background: #eb8600 !important;
}
.goods-index .el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: initial;
  display: none;
}
</style>