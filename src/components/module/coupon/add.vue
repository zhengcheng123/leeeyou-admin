<template>
  <div class="wrapper">
    <div class="form-board">
      <el-form ref="form"
               v-loading="loadingVisible"
               element-loading-text="数据加载中"
               :model="form"
               :rules="rules"
               label-width="160px">
        <el-form-item label="优惠券类型"
                      prop="category"
                      required>
          <el-select size="mini"
                     style="width: 100%;"
                     v-model="form.category"
                     placeholder="请选择">
            <el-option label="购物赠券"
                       value="1" />
            <el-option label="全场赠券"
                       value="2" />
            <el-option label="新人赠券"
                       value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称"
                      prop="name">
          <el-input size="mini"
                    placeholder="请输入 1 - 15字以内"
                    clearable
                    v-model.trim="form.name" />
        </el-form-item>
        <el-form-item label="总发放量"
                      prop="count">
          <el-input-number v-model="form.count"
                           controls-position="right"
                           size="mini"
                           :min="0"
                           step-strictly />
          &nbsp;&nbsp;
          <span style="color: var(--title6); font-size: 12px;">0 为无限制</span>
        </el-form-item>
        <el-form-item label="面额"
                      prop="discountQuota">
          <el-input size="mini"
                    clearable
                    placeholder="请输入有效金额"
                    v-model.trim="form.discountQuota"><span slot="suffix">元</span></el-input>
        </el-form-item>
        <el-form-item label="每人限领"
                      prop="availableQuantity">
          <el-input placeholder="请输入"
                    size="mini"
                    clearable
                    v-model.number="form.availableQuantity"
                    v-if="form.category !== '3'">
            <el-select v-model="form.collectionRules"
                       slot="prepend"
                       size="mini"
                       placeholder="请选择">
              <el-option label="每人限领"
                         value="1" />
              <el-option label="每人每日限领"
                         value="2" />
            </el-select>
            <span slot="suffix">张</span>
          </el-input>
          <el-radio v-if="form.category === '3'">每人限领 1 张</el-radio>
        </el-form-item>
        <el-form-item label="发放时间"
                      prop="dateRange">
          <el-date-picker v-model="form.dateRange"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00', '23:59:59']"
                          style="width: 100%"
                          size="mini"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放方式"
                      v-if="form.category === '1'">
          <el-radio-group v-model="form.distributeType">
            <el-radio label="1">指定商品消费</el-radio>
            <el-radio label="2">消费满金额</el-radio>
          </el-radio-group>
          <el-select v-model="form.distributeGoods"
                     v-if="form.distributeType === '1'"
                     filterable
                     multiple
                     style="width: 100%"
                     size="mini"
                     placeholder="请选择指定商品"
                     value-key="goodsId">
            <el-option v-for="item in allGoodsOptions"
                       :key="item.goodsId"
                       :label="item.goodsName"
                       :value="item">
            </el-option>
          </el-select>
          <el-input size="mini"
                    v-if="form.distributeType === '2'"
                    clearable
                    placeholder="请输入有效金额"
                    v-model.trim="form.distributeBase"><span slot="suffix">元</span></el-input>
        </el-form-item>
        <el-form-item label="使用门槛（满减）">
          <el-input size="mini"
                    clearable
                    placeholder="请输入有效金额"
                    v-model.trim="form.discountBase"><span slot="suffix">元</span></el-input>
          &nbsp;&nbsp;
          <span style="color: var(--title6); font-size: 12px;">0 为无限制</span>
        </el-form-item>
        <el-form-item label="券有效期">
          <el-radio-group v-model="form.expirePeriod">
            <el-radio label="1">固定天数</el-radio>
            <el-radio label="2">日期范围</el-radio>
          </el-radio-group>
          <el-input v-if="form.expirePeriod === '1'"
                    size="mini"
                    clearable
                    placeholder="请输入领券后可使用的天数"
                    v-model.number="form.expireGap"><span slot="suffix">天</span></el-input>
          <el-date-picker v-model="expireDateRange"
                          v-if="form.expirePeriod === '2'"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00', '23:59:59']"
                          style="width: 100%"
                          size="mini"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否可与其他优惠同享">
          <el-radio-group v-model="isHybrid">
            <el-radio label="1">不可同时使用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可使用商品">
          <el-radio-group v-model="form.useType"
                          @change="handleUseTypeChange">
            <el-radio label="1">全场通用</el-radio>
            <el-radio label="2">指定分类</el-radio>
            <el-radio label="3">指定商品</el-radio>
          </el-radio-group>
          <el-select v-model="form.useGoods"
                     v-if="form.useType === '2'"
                     filterable
                     multiple
                     style="width: 100%"
                     size="mini"
                     placeholder="请选择分类">
            <el-option v-for="item in typeOptions"
                       :key="item.id"
                       :label="item.type_name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.useGoods"
                     v-if="form.useType === '3'"
                     filterable
                     multiple
                     style="width: 100%"
                     size="mini"
                     placeholder="请选择商品">
            <el-option v-for="item in allGoodsOptions"
                       :key="item.goodsId"
                       :label="item.goodsName"
                       :value="item.goodsId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"
                      class="textAreaItem">
          <el-input size="mini"
                    type="textarea"
                    v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="mini"
                     @click="onSubmit">{{form.id ? '提交更新' : '提交新增'}}</el-button>
          <el-button size="mini"
                     @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
import { checkMoney, checkNumber } from '../../../assets/validate.js'

export default {
  data() {
    return {
      loadingVisible: true,
      form: {
        category: '1',
        name: '',
        count: 0,
        discountQuota: undefined, // 优惠券面额
        availableQuantity: '', // 限领张数
        collectionRules: '1', // 限领规则
        distributeUserLimite: '', //每人限领张数
        distributeDayLimite: '', //每人每日限领张数
        dateRange: [],

        distributeType: '1', // 发放规则： 商品 、满金额
        distributeGoods: [],
        distributeBase: '',
        discountBase: 0,
        expirePeriod: '1',
        expireGap: undefined,
        useType: '1',
        useGoods: [],
      },
      expireDateRange: [],
      isHybrid: '1',

      allGoodsOptions: [],
      typeOptions: [],

      rules: {
        category: [{ required: true, trigger: 'change' }],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
        ],
        count: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        discountQuota: [{ required: true, validator: checkMoney, trigger: 'blur' }],
        availableQuantity: [{ required: true, validator: checkNumber, trigger: 'blur' }],
        dateRange: [{ required: true, message: '时间不能为空', trigger: 'change' }],
      },
    }
  },
  mounted() {
    this.loadingVisible = true
    Promise.all([this.getGoodsOptions(), this.getGoodsTypeOptions()]).then((res) => {
      const id = this.$route.params.id
      if (id) {
        this.getDetails(id).then(() => (this.loadingVisible = false))
      } else {
        this.loadingVisible = false
      }
    })
  },
  methods: {
    handleUseTypeChange(d) {
      this.form.useGoods = []
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // alert('submit!')
          // return console.log(this.form)

          if (this.form.collectionRules === '1') {
            this.form.distributeUserLimite = this.form.availableQuantity
            this.form.distributeDayLimite = 0
          } else if (this.form.collectionRules === '2') {
            this.form.distributeUserLimite = 0
            this.form.distributeDayLimite = this.form.availableQuantity
          }

          if (this.form.dateRange && this.form.dateRange.length > 0) {
            this.form.distributeStart = this.form.dateRange[0]
            this.form.distributeEnd = this.form.dateRange[1]
          } else {
            this.form.distributeStart = ''
            this.form.distributeEnd = ''
          }
          // 发放方式
          if (this.form.distributeType === '1') {
            this.form.distributeBase = ''
          } else {
            this.form.distributeGoods = []
          }

          if (this.form.expirePeriod === '1') {
            this.form.expireStart = ''
            this.form.expireEnd = ''
          } else {
            this.form.expireGap = undefined
            this.form.expireStart = this.expireDateRange[0]
            this.form.expireEnd = this.expireDateRange[1]
          }

          const p = JSON.parse(JSON.stringify(this.form))

          console.log('p: ', p)

          if (this.form.useType !== '1') {
            if (!p.useGoods.length) return this.$message.warning(`请选择${this.form.useType === '3' ? '商品' : '分类'}`)
            p.useGoods = p.useGoods.map((ele) => {
              return {
                [this.form.useType === '3' ? 'goodsCommonId' : 'goodsType']: ele,
              }
            })
          } else {
            p.useGoods = undefined
          }

          if (this.form.category === '3') {
            p.availableQuantity = 1
            p.distributeUserLimite = 1
            p.distributeDayLimite = undefined
            p.collectionRules = undefined

            p.distributeType = undefined
            p.distributeBase = undefined
          } else if (this.form.category === '2') {
            p.distributeType = undefined
            p.distributeBase = undefined
          } else if (this.form.category === '1') {
            
          }

          p.discountBase = this.form.discountBase * 100
          p.discountQuota = this.form.discountQuota * 100
          p.distributeBase = this.form.distributeBase ? this.form.distributeBase * 100 : this.form.distributeBase

          p.discountBase = this.form.discountBase * 100
          p.discountBase = this.form.discountBase * 100
          p.discountBase = this.form.discountBase * 100

          // return console.log('submit', p)
          const url = this.form.id ? '/couponTemplate/update' : '/couponTemplate/save'
          this.$https.post(url, p).then((res) => {
            if (res.result) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getGoodsOptions() {
      return this.$https
        .post('/api/goods/list', {
          condition: {
            state: 1,
          },
          page: {
            pageNum: 1,
            pageSize: 10000,
            sortname: 'id',
            sortorder: 'desc',
            total: 0,
          },
        })
        .then((res) => {
          this.allGoodsOptions = res.result
            ? res.list.map((ele) => {
                return {
                  goodsCommonId: ele.id,
                  goodsId: ele.id,
                  goodsName: ele.name,
                  goodsState: ele.sellStat,
                  templateId: ele.typeId,
                }
              })
            : []
        })
    },
    getGoodsTypeOptions() {
      return this.$https.get('api/store/getLogisticsCompany').then((res) => {
        this.typeOptions = res.result ? res.object.goodsType : []
        if (!res.result) return res.msg && this.$message.error(res.msg)
      })
    },
    getDetails(id) {
      return this.$https.get(`/couponTemplate/get/${id}`).then((res) => {
        if (res.result) {
          const obj = res.object
          let modifyForm = {
            id: obj.id,
            category: obj.category + '',
            name: obj.name,
            count: obj.count,
            discountQuota: obj.discountQuota / 100,
            distributeType: obj.distributeType + '',

            discountBase: obj.discountBase / 100,
            expirePeriod: obj.expirePeriod + '',
            expireGap: obj.expirePeriod == 1 ? obj.expireGap : '',
            useType: obj.useType + '',
            intro: obj.intro,
          }

          if (!obj.distributeDayLimite && obj.distributeUserLimite) {
            modifyForm.collectionRules = '1'
            modifyForm.availableQuantity = obj.distributeUserLimite
          } else if (obj.distributeDayLimite && !obj.distributeUserLimite) {
            modifyForm.collectionRules = '2'
            modifyForm.availableQuantity = obj.distributeDayLimite
          }

          modifyForm.dateRange = [obj.distributeStart, obj.distributeEnd]

          if (obj.distributeType == 1) {
            modifyForm.distributeGoods = obj.distributeGoods
            modifyForm.distributeBase = ''
          } else if (obj.distributeType == 2) {
            modifyForm.distributeGoods = []
            modifyForm.distributeBase = obj.distributeBase / 100
          }

          if (obj.expirePeriod == 2) {
            this.expireDateRange = [obj.expireStart, obj.expireEnd]
          }

          if (obj.useType == 2) {
            modifyForm.useGoods = obj.useGoods.map((ele) => ele.goodsType)
          } else if (obj.useType == 3) {
            modifyForm.useGoods = obj.useGoods.map((ele) => ele.goodsCommonId)
          }

          this.form = JSON.parse(JSON.stringify(modifyForm))
          console.log(this.form)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0;
}
.form-board {
  flex: 1;
  background-color: #ffffff;
  padding: 16px 0 0;

  .el-form {
    background-color: #ffffff;
    width: 600px;

    /deep/ .el-form-item {
      margin-bottom: 12px !important;

      &.textAreaItem {
        .el-form-item__label {
          line-height: 1.5 !important;
        }
      }

      .el-input--mini.el-input-group {
        margin-top: 6px;

        .el-input-group__prepend {
          background-color: var(--white);

          .el-select {
            width: 130px;
          }
        }

        .el-input__suffix-inner {
          height: 100%;
          span {
            height: 100%;
            line-height: 28px;
          }
        }
      }

      .el-form-item__error {
        padding-top: 0 !important;
      }
    }
  }
}
</style>