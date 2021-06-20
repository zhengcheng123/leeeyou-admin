<template>
  <div class="log-manager wrapper">
    <div class="content">
      <div class="search-bar">
        <div class="search-item">
          <span class="label">用户名称：</span>
          <el-input v-model="params.condition[0].value"
                    placeholder="请输入"
                    @keyup.enter.native="search(params)"
                    clearable
                    size="medium"></el-input>
        </div>
        <div class="search-item">
          <span class="label">操作对象：</span>
          <el-input v-model="params.condition[1].value"
                    @keyup.enter.native="search(params)"
                    placeholder="请输入"
                    clearable
                    size="medium"></el-input>
        </div>
        <div class="search-btnT">
          <!-- v-if="$_has('logQuery')" -->
          <el-button class="f-left"
                     type="primary"
                     size="mini"
                     @click="search(params)">查询</el-button>
          <!-- v-if="$_has('logDelete')" -->
          <el-button class="f-left"
                     type="info"
                     :disabled="idBatch.length == 0"
                     @click="delcadAll">删除</el-button>
        </div>
      </div>
      <section v-loading="tableLoading"
               element-loading-text="数据请求中"
               element-loading-spinner="el-icon-loading">
        <el-table :data="tableData"
                  border
                  @selection-change="handleSelectionChange"
                  style="width: 100%;margin-top:10px;">
          <el-table-column type="selection"
                           align="center"
                           width="55"></el-table-column>
          <el-table-column type="index"
                           align="center"
                           label="序号"
                           width="60"></el-table-column>
          <el-table-column align="center"
                           sortable
                           min-width="120"
                           prop="createName"
                           label="用户名称"></el-table-column>
          <el-table-column align="center"
                           prop="model"
                           sortable
                           min-width="120"
                           label="操作对象"></el-table-column>

          <el-table-column align="center"
                           prop="action"
                           sortable
                           min-width="120"
                           label="动作名称"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="center"
                           prop="param"
                           sortable
                           min-width="200"
                           show-overflow-tooltip
                           label="参数"></el-table-column>
          <el-table-column align="center"
                           prop="createTime"
                           sortable
                           min-width="200"
                           label="操作时间"></el-table-column>
          <el-table-column align="center"
                           prop="consumeTime"
                           min-width="120"
                           sortable
                           label="响应时间"></el-table-column>
          <el-table-column align="center"
                           label="详情">
            <template slot-scope="scope">
              <el-button type="text"
                         size="mini"
                         @click="showrequest(scope.row)">
                <span>报文</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <footer>
          <el-pagination class="pagination"
                         background
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="params.page.pageNum"
                         :page-sizes="[15,30,50,100]"
                         :page-size.sync="params.page.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"></el-pagination>
        </footer>
      </section>
      <!-- 请求报文弹窗 -->
      <el-dialog title="报文详情"
                 :visible.sync="requestMessage"
                 width="50%"
                 class="proupClass"
                 v->
        <div>
          <label>方法信息：</label>
          <p>{{this.requestInfo.classMethod}}</p>
        </div>
        <div>
          <label>方法url：</label>
          <p>{{this.requestInfo.url}}</p>
        </div>
        <div>
          <label>请求报文：</label>
          <p>{{this.requestInfo.reqContent}}</p>
        </div>
        <div>
          <label>响应报文：</label>
          <p>{{this.requestInfo.resContent}}</p>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="closeModel">返 回</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      logFrom: {},
      params: {
        //数据传值
        condition: [
          { attribute: 'createName', operate: 'like', value: '' },
          { attribute: 'model', operate: 'like', value: '' },
        ],
        page: {
          pageNum: 1,
          pageSize: 15,
          orders: [],
        },
      },
      tableData: [],
      total: 0, //数据总条数
      request: '', //请求报文
      requestInfo: '', //请求报文
      requestMessage: false,
      isShow: false,
      tableLoading: false,
      idBatch: [],
      pickerOptionsStart: {
        firstDayOfWeek: 1,
      },
      pickerOptionsEnd: {
        firstDayOfWeek: 1,
      },
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    //选择项变化
    handleSelectionChange(val) {
      this.idBatch = val
    },
    //全部删除
    delcadAll() {
      if (this.idBatch.length != 0) {
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            let arr = []
            this.idBatch.forEach((item) => {
              arr.push(item.id)
            })

            this.$axios.post(globalConfig.server1 + 'log/delete', arr).then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.message,
                  duration: 1500,
                })
                this.search()
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.message,
                  duration: 1500,
                })
              }
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          message: '请选择删除项',
          type: 'warning',
        })
      }
    },
    //分页器
    handleSizeChange(val) {
      this.params.page.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.params.page.pageNum = val
      this.search()
    },
    /**
     * 请求报文
     * @param val
     */
    showrequest(val) {
      this.requestMessage = true
      this.requestInfo = val
    },
    // 查询数据
    search() {
      this.tableLoading = true
      this.$axios.post(globalConfig.server1 + 'log/query', this.params).then((res) => {
        if (res.data.code == 200) {
          this.tableData = res.data.data.records
          this.total = res.data.total
          console.log(this.total)
        } else {
          this.isShow = true
        }
        setTimeout(() => {
          this.tableLoading = false
        }, 300)
      })
    },
    closeModel() {
      this.requestMessage = false
    },
  },
}
</script>

<style >
@import '../../../assets/css/base.css';
.log-manager .proupClass .el-dialog__body > div {
  display: flex;
  font-size: 16px;
  margin-bottom: 20px;
}
.proupClass .el-dialog__body label {
  color: #333;
}
.log-manager .proupClass .el-dialog__body p {
  flex: 1;
}
</style>
