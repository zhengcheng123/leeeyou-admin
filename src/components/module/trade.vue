<template>
  <div class="wrapper">
    <div class="search_bar">
      <el-form :inline="true">
        <el-form-item label="创建时间">
          <el-date-picker class="date-picker"
                          size="mini"
                          v-model="conditionForm.item.initTime"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始"
                          end-placeholder="结束"></el-date-picker>
        </el-form-item>
        <el-form-item label="订单号"
                      prop="code">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.item.code"></el-input>
        </el-form-item>
        <el-form-item label="状态"
                      prop="stat">
          <el-select clearable
                     size="mini"
                     v-model="conditionForm.item.stat">
            <el-option v-for="item in states"
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
    <!--<el-button icon="plus" size="mini" @click="addItem" class="f-left">新增</el-button>-->
    <!--<el-button icon="delete" size="mini" plain type="danger" @click="confirmDelete()"-->
    <!--class="f-left">删除-->
    <!--</el-button>-->
    <section>
      <div class="operate_bar">
        <div class="left">
          <el-radio-group v-model="conditionForm.item.stat"
                          @change="getItems">
            <el-radio :label="''">全部</el-radio>
            <el-radio v-for="item in states"
                      :key="item.label"
                      :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </div>
        <div class="right">
          <el-button size="mini"
                     @click="exportList()">导 出</el-button>
        </div>
      </div>
      <el-table :data="currentItems"
                @selection-change="selectionChange"
                @sort-change="sortItems"
                height="0"
                :header-cell-style="{background:'var(--background1)'}">
        <!-- <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column> -->
        <el-table-column prop="code"
                         width="180"
                         fixed="left"
                         label="订单号"></el-table-column>
        <el-table-column prop="payment"
                         width="120"
                         label="实际付款"
                         sortable>
          <template slot-scope="props">{{pennyToDollar(props.row.payment)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="paycode" label="支付交易编号" align="center"></el-table-column> -->
        <el-table-column prop="buyerName"
                         width="120"
                         label="客户"></el-table-column>
        <!--<el-table-column prop="shopping_addr" label="收货地址id" sortable></el-table-column>-->
        <!--<el-table-column prop="stat" label="交易状态" sortable align="center"></el-table-column>-->
        <el-table-column prop="comment"
                         width="120"
                         label="买家备注"></el-table-column>
        <el-table-column label="配送方式"
                         width="80">
          <template slot-scope="props">
            <span v-if="props.row.logisticsType === 1"
                  :style="{color: 'green'}">快递</span>
            <span v-if="props.row.logisticsType === 2"
                  :style="{color: 'blue'}">自提</span>
            <span v-if="props.row.logisticsType === 3">无物流</span>
          </template>
        </el-table-column>
        <el-table-column prop="freight"
                         width="80"
                         label="运费"
                         sortable>
          <template slot-scope="props">{{pennyToDollar(props.row.freight)}}</template>
        </el-table-column>
        <el-table-column prop="stat"
                         width="80"
                         label="状态"
                         sortable>
          <template slot-scope="props">{{renderStateLabel(states, props.row.stat)}}</template>
        </el-table-column>
        <el-table-column prop="createTime"
                         width="190"
                         label="创建时间"
                         sortable>
          <template slot-scope="props">{{renderTime(props.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="payTime"
                         width="190"
                         label="付款时间"
                         sortable>
          <template slot-scope="props">{{renderTime(props.row.payTime)}}</template>
        </el-table-column>
        <el-table-column prop="sendTime"
                         width="190"
                         label="发货时间"
                         sortable>
          <template slot-scope="props">{{renderTime(props.row.sendTime)}}</template>
        </el-table-column>
        <el-table-column prop="finishTime"
                         width="190"
                         label="成交时间"
                         sortable>
          <template slot-scope="props">{{renderTime(props.row.finishTime)}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         width="120">
          <template scope="props">
            <div class="btn-group">
              <el-button v-if="props.row.logisticsType===1"
                         type="text"
                         :disabled="props.row.stat!==2"
                         @click="sendGoods(props.row)">发货</el-button>
              <el-button v-if="props.row.logisticsType===2"
                         type="text"
                         :disabled="props.row.stat!==2"
                         @click="writeOff(props.row)">核销</el-button>
              <el-button type="text"
                         @click="tradeDetail(props.row.id)">详情</el-button>
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
                     :total="conditionForm.page.total"></el-pagination>
    </section>
    <el-dialog title="发货"
               :visible.sync="logisticsFormVisible"
               custom-class="logistics-dialog"
               @close="resetForm">
      <el-form :model="logisticsForm"
               ref="logisticsForm"
               label-width="90px"
               class="account-form"
               :rules="logisticsFormRules">

        <el-form-item label="运单号"
                      prop="logisticsCode">
          <el-input v-model.trim="logisticsForm.logisticsCode"></el-input>
        </el-form-item>
        <!-- <el-form-item label="运费" prop="priceDollar">
            <el-input v-model.number="logisticsForm.priceDollar"></el-input>
          </el-form-item>-->
        <el-form-item label="备注"
                      prop="comment">
          <el-input v-model.trim="logisticsForm.comment"></el-input>
        </el-form-item>
        <div class="butn">
          <el-button class="lg-btn sure-btn"
                     :loading="saving"
                     @click="saveLogistics">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { renderTime, pennyToDollar, renderStateLabel } from '../../assets/utils'

export default {
  name: 'trade',
  data() {
    return {
      ticeId: '',
      typeTice: '',
      /* util methods */
      renderTime,
      pennyToDollar,
      renderStateLabel,
      states: [
        { label: '待付款', value: 1 },
        { label: '待发货', value: 2 },
        { label: '待收货', value: 3 },
        { label: '待评价', value: 4 },
        { label: '已完成', value: 5 },
        { label: '已关闭', value: 6 },
      ],
      logisticsCompanies: [],
      logisticsForm: {
        id: '',
        logisticsCode: '',
        priceDollar: 0,
        price: 0,
        pic: '',
        comment: '',
        type: '',
      },
      logisticsFormRules: {
        logisticsCode: [{ required: true, message: '请输入运单号' }],
        // priceDollar: [{ required: true, message: "请输入运费" }]
      },
      sendGoodsTradeId: -1,
      // sendGoodsTradeId: "",

      /* item form */
      itemForm: {
        id: -1,
        freight: null,
      },
      logisticsFormVisible: false,
      saving: false,
      /* table */
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        item: {
          id: '',
          code: '',
          buyerId: '',
          sellerId: '',
          dealUserId: '',
          saveMoney: '',
          logisticeId: '',
          freight: '',
          payment: '',
          paycode: '',
          shoppingAddr: '',
          initTime: [],
          stat: '',
          createTime: '',
          createTimeEnd: '',
          payTime: '',
          sendTime: '',
          finishTime: '',
          comment: '',
          itemId: '',
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
  mounted() {
    this.getItems()
    this.getLogisticsCompany()
  },
  methods: {
    tradeDetail(tradeId) {
      this.$router.push('/trade/' + tradeId)
    },
    getTime(timeDate) {
      var Time = new Date(timeDate)
      var timestemp = Time.getTime()
      return timestemp
    },
    search() {
      this.conditionForm.page = {
        pageNum: 1,
        pageSize: 15,
        total: 0,
        sortname: 'id',
        sortorder: 'desc',
      }
      if (this.conditionForm.item.initTime && this.conditionForm.item.initTime.length && this.conditionForm.item.initTime != null) {
        let times = this.conditionForm.item.initTime
        this.conditionForm.item.createTime = times[0].getTime() / 1000
        this.conditionForm.item.createTimeEnd = this.getTime(times[1].toString().substring(0, 16) + '23:59:59 GMT+0800 (中国标准时间)') / 1000
      } else {
        this.conditionForm.item.createTime = ''
        this.conditionForm.item.createTimeEnd = ''
      }
      this.getItems()
    },
    resetSearch() {
      this.conditionForm = this.$options.data().conditionForm
      this.getItems()
    },
    getLogisticsCompany() {
      this.$http
        .ajax({
          url: APIHOST + 'api/store/getLogisticsCompany',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.logisticsCompanies = res.list
          } else {
            console.log('获取物流公司失败')
          }
        })
    },
    sendGoods(trade) {
      this.itemId = trade.id
      this.sendGoodsTradeId = trade.tradeId
      this.logisticsForm.id = trade.logisticsId
      this.logisticsForm.type = trade.logisticsType
      this.logisticsFormVisible = true
    },
    saveLogistics() {
      this.$refs['logisticsForm'].validate((valid) => {
        if (valid) {
          this.logisticsForm.price = this.logisticsForm.priceDollar * 100
          this.logisticsForm.id = this.logisticsForm.id
          this.saving = true
          this.$http
            .ajax({
              url: APIHOST + 'api/trade/sendGoods',
              contentType: 'application/json; charset=utf-8',
              type: 'post',
              dataType: 'json',
              data: JSON.stringify({
                logistics: this.logisticsForm,
                id: this.itemId,
              }),
              context: this,
            })
            .done((res) => {
              if (res.result === 1) {
                this.$message({ message: '发货成功', type: 'success' })
                this.logisticsFormVisible = false
                this.getItems()
              } else {
                this.$message({ message: res.msg, type: 'error' })
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
    /* item form */
    addItem() {
      this.itemFormVisible = true
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
          url: APIHOST + 'api/trade/delete',
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
    },

    /* table 必备 */
    getItems() {
      this.$http
        .ajax({
          url: APIHOST + 'api/trade/list',
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
              this.currentItems = []
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
    writeOff(even) {
      let id = even.id
      this.ticeId = even.logisticsId
      this.logisticsForm.type = even.logisticsType
      this.logisticsForm.id = even.logisticsId
      this.$http
        .ajax({
          url: APIHOST + 'api/trade/sendGoods',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({
            logistics: this.logisticsForm,
            id: id,
          }),
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '核销成功', type: 'success' })
            this.logisticsFormVisible = false
            this.getItems()
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
        .fail(() => {
          console.log('目标数据保存接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
    // 导出
    exportList() {
      var url2 = `${globalConfig.server1}api/trade/exportList`
      window.location.href = url2
    },
    resetForm: function () {
      this.$refs['itemForm'].resetFields()
      this.itemForm = {
        id: -1,
        buyerId: null,
        sellerId: null,
        dealUserId: null,
        saveMoney: null,
        logisticeId: null,
        freight: null,
        payment: null,
        paycode: '',
        shoppingAddr: null,
        stat: null,
        createTime: null,
        payTime: null,
        sendTime: null,
        finishTime: null,
        comment: '',
      }
      this.logisticsForm = []
    },
  },
}
</script>
<style scoped>
.date-picker {
  /*width: 30px;*/
  width: 350px;
}
.goods-row {
  width: 100%;
  background-color: #fff;
  padding-left: 39px;
  border-radius: 3px;
  padding-top: 21px;
}
.adds-btn {
  background-color: #eb8600;
  color: #fff;
  border-color: #eb8600;
  line-height: 0;
}
.sure-btn {
  width: 66px;
  height: 28px;
  background: rgba(235, 134, 0, 1);
  border: 1px solid rgba(235, 134, 0, 1);
  border-radius: 6px;
  line-height: 0px;
  color: #fff;
}
.butn {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
<style>
.goods-row .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #eb8600;
  border-color: #eb8600;
  -webkit-box-shadow: -1px 0 0 0 #eb8600;
  box-shadow: -1px 0 0 0 #eb8600;
  color: #fff;
}
.goods-row .el-radio-button__inner:hover {
  color: #eb8600;
}
.btn-delive {
  width: 55px !important;
  cursor: pointer;
  background: none;
}
.btn-delive:active {
  background: none !important;
  border: none;
}
</style>
