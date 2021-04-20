<template>
  <div>
    <div id="goods-index"
         v-if="!addSwitch">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="fa fa-shopping-bag"
               aria-hidden="true"></i>
            优惠券
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <div class="goods-row clearfix">
          <div class="row"></div>
          <div class="row">
            <el-form :inline="true">
              <el-form-item label="优惠券名称："
                            prop="name">
                <el-input clearable
                          v-model="conditionForm.condition.name"></el-input>
              </el-form-item>
              <el-form-item label="优惠券类型："
                            prop="state">
                <el-select clearable
                           v-model="conditionForm.condition.category">
                  <el-option v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="状态：" prop="type">
                <el-select clearable v-model="conditionForm.condition.state">
                  <el-option
                  v-for="item in states"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary"
                           class="f-left"
                           @click="getdataTable()">搜索</el-button>
                <el-button type="primary"
                           size="small"
                           @click="addNew()"
                           class="f-left">新增</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <section style="background:#fff;padding:10px"
                 class="se-table clearfix">
          <el-table :data="tableData"
                    style="width: 100%"
                    :header-cell-style="{background:'#E8EAEE',height:'48px',}">
            <el-table-column align="center"
                             type="selection"
                             width="55"></el-table-column>
            <el-table-column align="center"
                             min-width="190"
                             prop="code"
                             label="编号"></el-table-column>
            <el-table-column align="center"
                             min-width="150"
                             prop="name"
                             label="优惠券名称"></el-table-column>
            <el-table-column align="center"
                             min-width="120"
                             prop="category"
                             label="优惠券类型">
              <template slot-scope="props">
                <span v-if="props.row.category===1">购物赠券</span>
                <span v-if="props.row.category===2">全场赠券</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             min-width="120"
                             prop="distributeType"
                             label="可使用商品">
              <template slot-scope="props">
                <span v-if="props.row.distributeType===1">指定商品消费</span>
                <span v-if="props.row.distributeType===2">消费满金额发放</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             min-width="120"
                             prop="discoutBase"
                             label="使用门槛">
              <template slot-scope="props">
                <span v-if="props.row.discountBase===0">无门槛</span>
                <span v-else>{{props.row.discountBase/100}}</span>
              </template>
            </el-table-column>

            <el-table-column sortable
                             align="center"
                             prop="discountQuota"
                             label="面额"
                             min-width="150">
              <template slot-scope="props">
                <span>{{props.row.discountQuota/100}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable
                             align="center"
                             prop="distributeStart"
                             label="发放时间"
                             min-width="190">
              <template slot-scope="props">
                <span>{{props.row.distributeStart.substr(0,10)}}&nbsp;至&nbsp;{{props.row.distributeEnd.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable
                             align="center"
                             prop="expireEnd"
                             label="卷有效期"
                             min-width="190">
              <template slot-scope="props">
                <span>{{props.row.expireStart.substr(0,10)}}&nbsp;至&nbsp;{{props.row.expireEnd.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column sortable align="center" prop="states" label="状态" min-width="120">
               <template slot-scope="props">
                 <span v-if="props.row.available==='false'">未启用</span>
                 <span v-if="props.row.available==='true'">正在分发</span>
                  <span v-if="states==='3'">已过期</span>
                 <span v-if="states==='4'">已完成</span>
              </template>
            </el-table-column> -->
            <el-table-column sortable
                             align="center"
                             prop="distributeCount"
                             label="已发放数量"
                             min-width="120"></el-table-column>
            <el-table-column sortable
                             align="center"
                             prop="useCount"
                             label="已使用数量"
                             min-width="120"></el-table-column>
            <el-table-column sortable
                             align="center"
                             prop="distributeCount "
                             label="剩余数量"
                             min-width="120">
              <template slot-scope="props">
                <span>{{(props.row.count)-(props.row.distributeCount)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             min-width="210"
                             prop="available"
                             label="发放状态">
              <template slot-scope="props">
                <el-switch v-model="props.row.available"
                           active-text="发放"
                           inactive-text="发放结束"
                           active-value="true"
                           inactive-value="false"
                           active-color="#eb8600"
                           inactive-color="#bbb"
                           @change="updateSwitch($event, props.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             min-width="250">
              <template slot-scope="props">
                <div class="btn-group">
                  <button class="see-btn"
                          @click="counDetail(props.row)">详情</button>
                  <button class="edit-btn"
                          @click="counedit(props.row)">编辑</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination"
                         @size-change="pageSizeChange"
                         :page-sizes="[15,30,50,100]"
                         :page-size="conditionForm.page.pageSize"
                         :current-page="conditionForm.page.pageNum"
                         @current-change="pageNoChange"
                         layout="total, sizes,prev, pager, next, jumper"
                         :total="conditionForm.page.total"></el-pagination>
        </section>
      </div>
    </div>
    <addCoupon v-if="addSwitch"></addCoupon>
  </div>
</template>
<script>
import addCoupon from '../module/addCoupon'
export default {
  components: { addCoupon },
  data() {
    return {
      tableData: [],
      addSwitch: false,
      conditionForm: {
        condition: {
          category: '',
          name: '',
          state: '',
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          orders: [
            {
              asc: true,
              column: 'id',
            },
          ],
          records: [],
          searchCount: true,
        },
      },
      options: [
        {
          value: '1',
          label: '购物赠券',
        },
        {
          value: '2',
          label: '全场赠券',
        },
      ],
      states: [
        {
          id: '1',
          name: '未启用',
        },
        {
          id: '2',
          name: '正在分发',
        },
        {
          id: '3',
          name: '已过期',
        },
        {
          id: '4',
          name: '已完成',
        },
      ],
    }
  },

  mounted() {
    this.getdataTable()
  },

  methods: {
    getdataTable() {
      this.$axios.post(globalConfig.server1 + 'couponTemplate/list', this.conditionForm).then((res) => {
        if (res.data.result === 1) {
          this.tableData = res.data.list
          this.tableData.map((item) => {
            item.available += ''
            return item
          })
          this.conditionForm.page.total = res.data.page.total
        } else {
        }
      })
    },

    // 分发
    updateSwitch(event, uid) {
      this.$axios.get(`${globalConfig.server1}couponTemplate/updateAvailable/${uid.id}/${event}`).then((res) => {
        if (res.data.result === 1) {
          this.$message.success('发放成功')
          this.getdataTable()
        } else {
          console.error('获取商品分类失败')
        }
      })
    },
    //新增
    addNew() {
      this.addSwitch = true
    },
    //编辑
    counedit(row) {
      this.$router.push({ path: '/editCounpon', query: { id: row.id } })
    },
    //详情
    counDetail(row) {
      this.$router.push({ path: '/counponDetail', query: { id: row.id } })
    },
    backPlan() {
      this.addSwitch = false
      this.getdataTable()
    },
    pageSizeChange(size) {
      this.conditionForm.page.pageSize = size
      this.getdataTable()
    },
    pageNoChange(no) {
      this.conditionForm.page.pageNum = no
      this.getdataTable()
    },
  },
}
</script>
<style scoped>
</style>