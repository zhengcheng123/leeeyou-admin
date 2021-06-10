<template>
  <div class="wrapper">
    <div class="search_bar">
      <el-form :inline="true">
        <el-form-item label="优惠券名称"
                      prop="name">
          <el-input clearable
                    size="mini"
                    placeholder="请输入"
                    v-model.trim="conditionForm.condition.name"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型"
                      prop="category">
          <el-select clearable
                     size="mini"
                     v-model="conditionForm.condition.category">
            <el-option v-for="item in categoryOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-select size="mini"
                     v-model="conditionForm.condition.state">
            <el-option v-for="item in stateOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value" />
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
    <section v-loading="loadingVisible">
      <div class="operate_bar">
        <div class="left">
          <el-button size="mini"
                     @click="$router.push('/coupon/add')">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData"
                height="0"
                :header-cell-style="{background:'var(--background1)'}">
        <el-table-column width="180"
                         prop="code"
                         label="编号"></el-table-column>
        <el-table-column min-width="150"
                         prop="name"
                         label="优惠券名称"></el-table-column>
        <el-table-column width="90"
                         label="优惠券类型">
          <template slot-scope="props">
            {{categoryObj[props.row.category]}}
          </template>
        </el-table-column>
        <el-table-column width="90"
                         label="可使用商品">
          <template slot-scope="props">
            {{useTypeObj[props.row.useType]}}
          </template>
        </el-table-column>
        <el-table-column width="120"
                         label="使用门槛">
          <template slot-scope="props">
            {{props.row.discountBase ? `满${props.row.discountBase}元使用` : '不限制'}}
          </template>
        </el-table-column>
        <el-table-column width="70"
                         prop="discountQuota"
                         label="面额">
          <template slot-scope="props">
            {{props.row.discountQuota}}元
          </template>
        </el-table-column>
        <el-table-column width="170"
                         label="发放时间">
          <template slot-scope="props">
            {{props.row.distributeStart}} 至 {{props.row.distributeEnd}}
          </template>
        </el-table-column>
        <el-table-column width="170"
                         label="券有效期">
          <template slot-scope="props">
            <div v-if="props.row.expirePeriod == '1'">
              领券后{{props.row.expireGap}}天内
            </div>
            <div v-if="props.row.expirePeriod == '2'">
              {{props.row.expireStart}} 至 {{props.row.expireEnd}}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="70"
                         prop="expired"
                         label="状态">
          <template slot-scope="props">
            <span v-if="props.row.expired">已过期</span>
            <span v-else
                  style="color: var(--green)">使用中</span>
          </template>
        </el-table-column>
        <el-table-column width="90"
                         prop="distributeCount"
                         label="已发放数量"></el-table-column>
        <el-table-column width="90"
                         prop="useCount"
                         label="已使用数量"></el-table-column>
        <el-table-column width="80"
                         prop="expireCount"
                         label="剩余数量">
          <template slot-scope="props">
            {{props.row.count - props.row.distributeCount }}
          </template>
        </el-table-column>
        <el-table-column width="140"
                         prop="description"
                         label="启停">
          <template slot-scope="props">
            <el-switch v-model="props.row.available"
                       @change="d => handleSwitch(d, props.row.id)"
                       active-text="启用"
                       inactive-text="停用">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column width="60"
                         label="操作">
          <template slot-scope="props">
            <!-- <el-button type="text">详情</el-button> -->
            <el-button type="text"
                       @click="$router.push(`/coupon/edit/${props.row.id}`)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="pagination"
                     @size-change="handleSizeChange"
                     :page-sizes="[15,30,50,100]"
                     :page-size="conditionForm.page.pageSize"
                     :current-page="conditionForm.page.pageNum"
                     @current-change="handleCurrentChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="conditionForm.page.total" />
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryOptions: [
        {
          value: '1',
          name: '购物赠券',
        },
        {
          value: '2',
          name: '全场赠券',
        },
        {
          value: '3',
          name: '注册赠券',
        },
        {
          value: '4',
          name: '指定用户赠券',
        },
      ],
      stateOptions: [
        {
          value: '2',
          name: '分发中',
        },
        {
          value: '3',
          name: '已结束',
        },
        {
          value: '1',
          name: '未启用',
        },
        {
          value: '4',
          name: '已发完',
        },
      ],

      categoryObj: {
        1: '购物赠券',
        2: '全场赠券',
        3: '新人赠券',
      },
      useTypeObj: {
        1: '全场通用',
        2: '指定分类',
        3: '指定商品',
      },

      conditionForm: {
        condition: {
          name: '',
          category: '',
          state: '',
          available: '',
          expired: '',
          finished: '',
          storeId: '',
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: 'id',
          sortorder: 'desc',
        },
      },
      loadingVisible: false,
      tableData: [],
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    search() {
      this.conditionForm.page = this.$options.data().conditionForm.page
      this.getTableData()
    },
    resetSearch() {
      this.conditionForm = this.$options.data().conditionForm
      this.getTableData()
    },
    getTableData() {
      this.loadingVisible = true
      this.$axios.post(globalConfig.server1 + 'couponTemplate/list', this.conditionForm).then((res) => {
        if (res.data.result === 1) {
          if (res.list <= 0) {
            this.$message({ message: '没有找到匹配项', type: 'info' })
            return false
          }
          this.tableData = res.data.list.map((ele) => {
            return {
              ...ele,
              discountBase: ele.discountBase / 100,
              discountQuota: ele.discountQuota / 100,
              distributeBase: ele.distributeBase / 100,
            }
          })

          this.conditionForm.page.pageNum = res.data.page.pageNum
          this.conditionForm.page.total = res.data.page.total
          this.conditionForm.page.pageSize = res.data.page.pageSize
          this.tableData.map((ele, index) => {
            ele.recommend += ''
            ele.sellStat += ''
            return ele
          })
        } else {
          this.$message({ message: '获取入库列表失败', type: 'error' })
          this.tableData = []
        }
        this.loadingVisible = false
      })
    },
    handleSizeChange(size) {
      this.conditionForm.page.pageSize = size
      this.getTableData()
    },
    handleCurrentChange(no) {
      this.conditionForm.page.pageNum = no
      this.getTableData()
    },
    handleSwitch(available, id) {
      this.$https.get(`/couponTemplate/updateAvailable/${id}/${available}`).then((res) => {
        if (res.result) {
          this.$message.success('操作成功')
        } else {
          this.getTableData()
        }
      })
    },
  },
}
</script>
