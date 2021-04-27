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
        <el-table-column width="80"
                         prop="typeName"
                         label="编号"></el-table-column>
        <el-table-column min-width="150"
                         prop="name"
                         label="优惠券名称"></el-table-column>
        <el-table-column width="120"
                         prop="canSellSize"
                         label="优惠券类型"></el-table-column>
        <el-table-column width="120"
                         prop="sellSize"
                         label="可使用商品"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="使用门槛"></el-table-column>
        <el-table-column width="120"
                         prop=""
                         label="面额">
          <!-- <template slot-scope="props">
          </template> -->
        </el-table-column>
        <el-table-column width="150"
                         prop="description"
                         label="发放时间"></el-table-column>
        <el-table-column width="120"
                         prop="description"
                         label="券有效期"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="状态"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="已发放数量"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="已使用数量"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="剩余数量"></el-table-column>
        <el-table-column width="100"
                         prop="description"
                         label="启用"></el-table-column>
        <el-table-column width="100"
                         label="操作">
          <template slot-scope="props">
            <el-button type="text">详情</el-button>
            <el-button type="text">编辑</el-button>
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
          this.tableData = res.data.list
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
    switch(event, uid) {
      this.$axios
        .post(`${globalConfig.server1}api/goods/updateStat`, {
          id: uid.id,
          sellStat: event,
        })
        .then((res) => {
          this.$message[res.data.result === 1 ? 'success' : 'error'](res.data.msg)
        })
      this.getTableData()
    },
  },
}
</script>
