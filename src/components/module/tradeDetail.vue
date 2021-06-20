<template>
  <div class="trade-detail">
    <el-button class="download"
               @click="downloadOrder">下载订单快照</el-button>
    <div class="content"
         id="capture">
      <div class="out-info">
        <el-form :model="buyer"
                 ref="buyerForm"
                 label-width="110px">
          <div class="h3down">
            <h3>交易信息</h3>
          </div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="买家人：">
                <span>{{buyer.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单号  ："
                            prop="code">
                <span>{{receiver.code}}</span>.
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form :model="receiver"
                 ref="outInfoForm"
                 label-width="110px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="交易状态："
                            prop="stat">
                <span>{{receiver.stat}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款时间："
                            prop="description">
                <span>{{dateTime(receiver.payTime)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="买家备注："
                            prop="comment">{{receiver.comment}}
                <span class="comment"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="logistics-info">
        <el-form :model="logistics"
                 :rules="logisticsRules"
                 ref="logisticsForm"
                 label-width="110px">
          <h3>收货人信息</h3>
          <el-row>
            <el-col :span="6">
              <el-form-item label="收货人："
                            prop="receiverName">
                <span>{{logistics.recvName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货人电话："
                            prop="mobile"
                            class="validatable">
                <span>{{logistics.recvMobile}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址："
                            prop="address">
                <span>{{logistics.desAddress}}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="备注：" prop="comment">
                <span>{{logistics.comment}}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <div class="logistics-info">
          <el-form :model="logistics"
                   :rules="logisticsRules"
                   ref="logisticsForm"
                   label-width="110px">
            <h3>物流信息</h3>
            <el-row>
              <el-col :span="6">
                <el-form-item v-if="logistics.type===1"
                              label="物流公司："
                              prop="logisticsName">
                  <span>{{logistics.logisticsName}}</span>
                </el-form-item>
                <!-- <el-form-item v-else label="自提点：" prop="logisticsName">
                  <span>{{logistics.logisticsName}}</span>
                </el-form-item> -->
              </el-col>
              <el-col :span="6">
                <el-form-item v-if="logistics.type===1"
                              label="物流单号："
                              prop="logisticsCode">
                  <span>{{logistics.logisticsCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物流类型 :"
                              prop="logisticsName">
                  <span>{{logistics.type == 1 ? '邮递' : '自提'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="快递费￥："
                              prop="priceStr">
                  <span>{{pennyToDollar(logistics.price)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发货人："
                              prop="sendName">
                  <span>{{logistics.sendName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发货人号码："
                              prop="logisticsName">
                  <span>{{logistics.sendMobile}}</span>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="备注：" prop="note">
                  <span>{{logistics.comment}}</span>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="detail-info">
        <h3>商品明细</h3>
        <div class="row btns"
             v-if="pageAction ==='create'">
          <div class="left">
            <el-button @click="addItem">添加</el-button>
            <el-button @click="deleteSelected">删除</el-button>
          </div>
        </div>
        <el-row>
          <el-col>
            <table border="1"
                   cellpadding="0"
                   cellspacing="0"
                   class="NativeTable"
                   height="100">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>图片</th>
                  <th>名称</th>
                  <th>规格</th>
                  <th>数量</th>
                  <th>状态</th>
                  <th>单价</th>
                  <th>总价</th>
                </tr>
              </thead>
              <tbody :class="{'active': flagDown}">
                <tr v-for="(row,i) in goods"
                    :key="row.id">
                  <td>{{i+1}}</td>
                  <td>
                    <img class="imgDetail"
                         v-if="row.goodsPic"
                         style="width: 100px; height: 100px;"
                         :src="$GETIMGHOST + row.goodsPic + '?' + new Date().getTime()"
                         alt="商品图片"
                         id="goodsPicImg"
                         crossOrigin="anonymous" />
                  </td>
                  <td>{{row.goodsName}}</td>
                  <td>{{row.goodsAttrs}}</td>
                  <td>{{row.num}}</td>
                  <td>
                    <span v-if="row.stat === 1">待付款</span>
                    <span v-else-if="row.stat === 2">待发货</span>
                    <span v-else-if="row.stat === 3">待收货</span>
                    <span v-else-if="row.stat === 4">交易完成</span>
                    <span v-else-if="row.stat === 5">待评价</span>
                    <span v-else-if="row.stat === 6">交易关闭</span>
                    <span v-else-if="row.stat === 7">完成退款</span>
                    <span v-else-if="row.stat === -1">退款</span>
                    <span v-else-if="row.stat === -2">退货退款</span>
                    <span v-else-if="row.stat === -3">退款失败</span>
                  </td>
                  <td>{{row.price}}</td>
                  <td>{{row.totalPrice}}</td>
                </tr>
              </tbody>
            </table>
            <el-row class="summary-row">
              <el-col :span="2">运费￥：{{this.receiver.freight}}</el-col>
              <el-col :span="4">合计￥：{{this.TotalNum}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import CityData from '../../assets/cityData'
import { pennyToDollar, renderStateLabel } from '../../assets/utils'
import { html2canvas } from '../../assets/js/html2canvas.js'
// import $ from 'jquery'
export default {
  data() {
    return {
      states: [
        { label: '待付款', value: 1 },
        { label: '待发货', value: 2 },
        { label: '待收货', value: 3 },
        { label: '交易完成', value: 4 },
        { label: '待评价', value: 5 },
        { label: '交易关闭', value: 6 },
        { label: '完成退款', value: 7 },
        { label: '退款', value: -1 },
        { label: '退货退款', value: -2 },
        { label: '退款失败', value: -3 },
      ],
      pennyToDollar,
      renderStateLabel,
      cityData: CityData,
      allCity: [],
      cityByProvince: [],
      areaByCity: [],
      tradeInfo: {},
      goods: [],
      logistics: {},
      receiver: {},
      buyer: {},
      logisticsRules: {},
      pageAction: 'info',
      tableHeight: 250,
      TotalNum: '',
      flagDown: true,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.getTradeInfo()
  },
  methods: {
    getTradeInfo() {
      this.$http
        .ajax({
          url: APIHOST + 'api/trade/getDetail/' + this.id,
          contentType: 'application/json; charset=utf-8',
          type: 'get',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            // this.tradeInfo = res.tradeBean;
            this.goods = res.goods
            this.logistics = res.logistics
            this.receiver = res.orderStore
            this.goods.filter((el) => {
              el.price = el.price / 100
              el.totalPrice = el.totalPrice / 100
            })
            this.receiver.freight = Number(this.receiver.freight) / 100
            this.receiver.price = Number(this.receiver.price) / 100
            this.TotalNum = this.add(this.receiver.price, this.receiver.freight)
            this.states.find((ele) => (ele.value === this.receiver.stat ? (this.receiver.stat = ele.label) : ''))
            this.buyer = res.buyer
          } else {
            this.$message({ message: '获取交易详情失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('获取交易详情接口出错')
        })
    },
    add(...val) {
      let max = 0
      let count = 0
      for (let i = 0; i < val.length; i++) {
        const strVal = val[i].toString()
        const index = strVal.indexOf('.')
        let num = 0
        if (index > -1) {
          num = strVal.length - 1 - index
          max = num > max ? num : max
        }
      }
      for (let i = 0; i < val.length; i++) {
        count += Math.round(val[i] * Math.pow(10, max))
      }
      return count / Math.pow(10, max)
    },
    downloadOrder() {
      this.flagDown = false
      var cloneDom = document.getElementById('capture').cloneNode(true)
      cloneDom.style.position = 'absolute'
      cloneDom.style.top = '0px'
      cloneDom.style.zIndex = '-1'
      cloneDom.style.minWidth = '900px'
      cloneDom.setAttribute('id', 'tmp_datatable')
      document.body.appendChild(cloneDom)
      setTimeout(() => {
        html2canvas(cloneDom, {
          useCORS: true,
          proxy: this.$GETIMGHOST,
        }).then((canvas) => {
          var imgUrl = canvas.toDataURL('image/png') // 将canvas转换成img的src流
          this.downloadIamge(imgUrl, '订单号')
        })
        this.flagDown = true
        document.body.removeChild(cloneDom)
      }, 100)
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },
    dateTime(timestamp) {
      if (!timestamp) {
        return ''
      }
      let date = new Date(timestamp * 1000)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let time = date.toLocaleTimeString('en-US', { hour12: false })
      return `${year}年${month}月${day}日${time}`
    },
  },
}
</script>
<style scoped>
h3 {
  padding: 17px;
  background-color: #f5f7fb;
  font-size: 14px;
  height: 54px;
  color: #333;
}
.h3down {
  display: flex;
  background-color: #f5f7fb;
}
.download {
  color: #409eff;
  width: 150px !important;
  height: 40px !important;
  margin-top: 7px;
  background-color: #f5f7fb;
}
.summary-row {
  margin: 10px 0;
  text-align: right;
  display: flex;
  align-items: center;
  -webkit-box-align: center;
}
.out-info {
  background-color: #fff;
}
.logistics-info {
  background-color: #fff;
}
.detail-info {
  background-color: #fff;
}
.imgDetail {
  width: 50px !important;
  height: 50px !important;
}
.portImg {
  width: 35px;
  margin-top: 10px;
}
.comment {
  width: 400px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
<style>
.trade-detail .el-table__body-wrapper {
  overflow: scroll;
  /* height: 300px; */
}
</style>
<style scoped>
.el-table {
  max-height: 100% !important;
}
.NativeTable thead {
  background: #e8eaee;
  height: 48px;
  border-radius: 45px;
}
.NativeTable thead tr th:nth-child(1) {
  border-top-left-radius: 45px;
  border-bottom-left-radius: 45px;
}
.NativeTable thead tr th:nth-last-child(1) {
  border-top-right-radius: 45px;
  border-bottom-right-radius: 45px;
}
.NativeTable th,
.NativeTable td {
  border-collapse: collapse;
  width: 180px;
  text-align: center;
}
.NativeTable th {
  background: #e8eaee;
  height: 48px;
  border: 0px solid #ebeef5;
  font-size: 15px;
  color: #909399;
  font-weight: 500;
}
.NativeTable td {
  height: 80px;
  font-size: 14px;
  color: #606266;
}
.NativeTable {
  border-collapse: collapse;
  border: 0px solid #ebeef5;
  margin: 15px 18px 0 25px;
  border-bottom: 1px solid #ebeef5;
}

.NativeTable td {
  border-top: 0;
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  border-left: 0;
}

.NativeTable tr:nth-last-child(1) td {
  border-bottom: 0;
}

.NativeTable tr td:nth-last-child(1) {
  border-right: 0;
}
.NativeTable .active {
  display: block;
  /* max-height: 250px;
    overflow-y: scroll; */
}
.NativeTable thead,
tbody tr {
  display: table;
  /* width: 100%;                             */
  table-layout: fixed;
}
</style>
