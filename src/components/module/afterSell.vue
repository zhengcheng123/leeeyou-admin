<template>
  <div class="wrapper">
    <div class="search_bar">
      <el-form :inline="true">
        <el-form-item label="退款编码"
                      prop="code">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.item.code"></el-input>
        </el-form-item>
        <el-form-item label="买家"
                      prop="buyerName">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.item.buyerName"></el-input>
        </el-form-item>
        <el-form-item label="订单号"
                      prop="orderStoreCode">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.item.orderStoreCode"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker class="date-picker"
                          size="mini"
                          v-model="conditionForm.item.createTime"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始"
                          end-placeholder="结束"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="mini"
                     @click="searchData">搜 索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section>
      <!-- @selection-change="selectionChange" -->
      <el-table :data="currentItems"
                @sort-change="sortItems"
                height="0"
                :header-cell-style="{background:'var(--background1)'}">
        <!-- <el-table-column type="selection"
                         width="55"></el-table-column> -->
        <el-table-column prop="code"
                         min-width="190"
                         label="退款编码"
                         align="center"></el-table-column>
        <el-table-column prop="orderStoreCode"
                         label="订单号"
                         min-width="150"
                         align="center">
          <template slot-scope="props">
            <div class="info-sell"
                 @click="getForm(props.row.orderStoreId)">{{props.row.orderStoreCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyerName"
                         label="买家"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column prop="phone"
                         label="手机号"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column prop="goodsName"
                         label="商品名称"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column prop="goodsAttrs"
                         label="商品规格"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column prop="refundType"
                         min-width="120"
                         label="售后方式">
          <template slot-scope="props">
            <span v-if="props.row.refundType === 1">仅退款</span>
            <span v-else>退货退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="backMoneyy"
                         min-width="110"
                         label="实际退款金额"
                         align="center">
          <template scope="props">
            <span>{{pennyToDollar(props.row.backMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason"
                         label="退款原因"
                         min-width="190"
                         align="center">
          <template slot-scope="props">
            <span v-if="props.row.reason === '0'">多拍/错拍/不喜欢/不想要</span>
            <span v-else-if="props.row.reason === '1'">假货</span>
            <span v-else-if="props.row.reason === '2'">卖家漏发，错发</span>
            <span v-else-if="props.row.reason === '3'">款式颜色问题退换货</span>
            <span v-else-if="props.row.reason === '4'">商品质量问题</span>
            <span v-else-if="props.row.reason === '5'">其他原因</span>
          </template>
        </el-table-column>
        <el-table-column prop="logisticeCompany"
                         label="物流公司"
                         min-width="120"
                         align="center"></el-table-column>
        <el-table-column prop="logisticeCode"
                         label="物流单号"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column label="凭证图片"
                         min-width="260"
                         align="center">
          <template scope="props">
            <div style="display: flex; flex-flow: row wrap;">
              <img v-for="i in 5"
                   :key="i"
                   v-show="props.row[`pic${i}`]"
                   :src="$GETIMGHOST + props.row[`pic${i}`]"
                   style=" margin: 0 5px 5px 0;max-width: 100%; max-height: 80px; border: 1px solid #999999;padding: 3px;"
                   @click="previewImg($GETIMGHOST + props.row[`pic${i}`])">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="refundStat"
                         label="退款状态"
                         min-width="120"
                         align="center">
          <template slot-scope="props">
            <span v-if="props.row.refundStat === 1">等待卖家同意</span>
            <span v-else-if="props.row.refundStat === 2">卖家已同意</span>
            <span v-else-if="props.row.refundStat === 3">退款关闭</span>
            <span v-else-if="props.row.refundStat === 4">退款成功</span>
            <span v-else-if="props.row.refundStat === -1">卖家拒绝协议</span>
            <span v-else-if="props.row.refundStat === -2">卖家未收到货</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         min-width="190"
                         label="交易创建时间"
                         align="center">
          <template scope="props">
            <span>{{renderTime(props.row.createTime)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="checkTime" label="确认时间" min-width="190" align="center">
              <template scope="props">
                <span>{{renderTime(props.row.checkTime)}}</span>
              </template>
            </el-table-column> -->
        <el-table-column prop="finishTime"
                         label="退款完成时间"
                         min-width="190"
                         align="center">
          <template scope="props">
            <span>{{renderTime(props.row.finishTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="describes"
                         label="描述"
                         min-width="150"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         min-width="260"
                         align="center">
          <template scope="props">
            <div class="btn-group">
              <!-- <button class="see-btn" @click="detailRefund(props.row)">详情</button> -->
              <el-button class="age-btn"
                         type="text"
                         :disabled="props.row.refundStat != 1"
                         @click="agreeRefund(props.row)">同意</el-button>
              <el-button class="age-btn"
                         type="text"
                         :disabled="props.row.refundStat != 1"
                         @click="refuseRefund(props.row)">拒绝</el-button>
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
    <el-dialog title="预览"
               width="500px"
               :visible.sync="imgVisible">
      <img :src="targetImg"
           style="max-width: 100%;"
           alt="">
    </el-dialog>

    <!-- <afterDetail v-if="detail"></afterDetail> -->
  </div>
</template>
<script>
import { nodeTime, renderTime, pennyToDollar } from '../../assets/utils'
// import afterDetail from "./afterDetail";
export default {
  // components: {
  //   afterDetail
  // },
  data() {
    return {
      disabledAss: true,
      detail: false,
      renderTime,
      pennyToDollar,
      /* table */
      currentItems: [],
      selectedItems: [],
      conditionForm: {
        item: {
          code: '',
          orderStoreCode: '',
          buyerName: '',
          createTime: '',
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: 'id',
          sortorder: 'desc',
        },
      },
      targetImg: '',
      imgVisible: false,
    }
  },
  computed: {
    maxTableHeight() {
      // the max height of table ,depend on what above on the table
      return document.body.clientHeight - 90
    },
  },
  mounted() {
    this.getItems()
  },
  methods: {
    previewImg(url) {
      this.targetImg = url
      this.imgVisible = true
    },
    agreeRefund(afterSell) {
      // if(afterSell.refund_stat === 1){
      //   this.disabledAss = false;
      // }
      this.$confirm('确认同意此退款申请吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      })
        .then(() => {
          this.$http
            .ajax({
              url: APIHOST + 'api/afterSell/agree/' + afterSell.code,
              type: 'get',
              dataType: 'json',
              context: this,
            })
            .done((res) => {
              if (res.result === 1) {
                this.$message({ message: '操作成功', type: 'success' })
                this.getItems()
              }
            })
        })
        .catch(() => {})
    },
    refuseRefund(afterSell) {
      this.$confirm('确认拒绝此退款申请吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      })
        .then(() => {
          let url = 'api/afterSell/disagree1/'
          if (afterSell.logisticsCode) {
            // 未收到货拒绝退款
            url = 'api/afterSell/disagree2/'
          }
          this.$http
            .ajax({
              url: APIHOST + url + afterSell.code,
              type: 'get',
              dataType: 'json',
              context: this,
            })
            .done((res) => {
              if (res.result === 1) {
                this.$message({ message: '操作成功', type: 'success' })
                this.getItems()
              }
            })
        })
        .catch(() => {})
    },
    searchData() {
      this.conditionForm.page = {
        pageNum: 1,
        pageSize: 15,
        total: 0,
        sortname: 'id',
        sortorder: 'desc',
      }
      this.getItems()
    },
    getTime(timeDate) {
      var Time = new Date(timeDate)
      var timestemp = Time.getTime()
      return timestemp
    },

    getItems() {
      let params = {
        item: {
          code: this.conditionForm.item.code,
          orderStoreCode: this.conditionForm.item.orderStoreCode,
          buyerName: this.conditionForm.item.buyerName,
          startTime: this.conditionForm.item.createTime ? this.getTime(this.conditionForm.item.createTime[0] / 1000) : '',
          endTime: this.conditionForm.item.createTime
            ? this.getTime(this.conditionForm.item.createTime[1].toString().substring(0, 16) + '23:59:59 GMT+0800 (中国标准时间)') / 1000
            : '',
        },
        page: this.conditionForm.page,
      }
      console.log(params, 'pppppp')
      this.$http
        .ajax({
          url: APIHOST + 'api/afterSell/list',
          contentType: 'application/json; charset=utf-8', // 是否json提交
          dataType: 'json',
          type: 'post',
          data: JSON.stringify(params),
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
    detailRefund() {
      this.detail = true
    },
    // 跳转订单详情
    getForm(orderStoreId) {
      this.$router.push('/trade/' + orderStoreId)
    },
    resetForm: function () {
      this.$refs['itemForm'].resetFields()
      this.itemForm = {
        id: -1,
        code: '',
        orderGoodsId: null,
        backMoney: null,
        reason: '',
        logisticeCompany: '',
        logisticeCode: '',
        refundStat: null,
        refundType: null,
        createTime: null,
        checkTime: null,
        finishTime: null,
        refuseReason: '',
      }
    },
  },
}
</script>
<style scoped>
.info-sell {
  cursor: pointer;
}
.info-sell:hover,
.info-sell:focus {
  color: #fa5555;
  text-decoration: underline;
}
</style>
