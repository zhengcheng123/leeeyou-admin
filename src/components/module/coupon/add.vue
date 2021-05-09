<template>
  <div class="wrapper">
    <div class="form-board">
      <el-form ref="form"
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
                    v-model.number="form.availableQuantity">
            <el-select v-model="collectionRules"
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
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker v-model="dateRange"
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
            <el-radio label="2">消费满金额消费</el-radio>
          </el-radio-group>
          <el-select v-model="form.distributeGoods"
                     v-if="form.distributeType === '1'"
                     filterable
                     multiple
                     style="width: 100%"
                     size="mini"
                     placeholder="请选择指定商品"
                     value-key="id">
            <el-option v-for="item in allGoodsOptions"
                       :key="item.id"
                       :label="item.name"
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
                    placeholder="请输入有效天数"
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
          <el-radio-group v-model="form.useType">
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
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注"
                      class="textAreaItem">
          <el-input size="mini"
                    type="textarea"
                    v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="mini"
                     @click="onSubmit">立即创建</el-button>
          <el-button size="mini">取消</el-button>
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
      form: {
        category: '1',
        name: '',
        count: 0,
        discountQuota: undefined, // 优惠券面额

        availableQuantity: '', // 限领张数
        distributeUserLimite: '', //每人限领张数
        distributeDayLimite: '', //每人每日限领张数

        distributeType: '1', // 发放规则： 商品 、满金额
        distributeGoods: [],
        distributeBase: '',
        discountBase: 0,
        expirePeriod: '1',
        expireGap: undefined,

        useType: '1',
        useGoods: [],
      },
      collectionRules: '1',
      dateRange: [],
      expireDateRange: [],
      isHybrid: '1',

      allGoodsOptions: [],
      typeOptions: [],

      rules: {
        category: [{ required: true, trigger: 'change' }],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
        ],
        discountQuota: [{ validator: checkMoney, trigger: 'blur' }],
        availableQuantity: [{ validator: checkNumber, trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.getGoodsOptions()
    this.getGoodsTypeOptions()
  },
  methods: {
    onSubmit() {
      if (this.collectionRules === '1') {
        this.form.distributeUserLimite = this.form.availableQuantity
        this.form.distributeDayLimite = 0
      } else {
        this.form.distributeUserLimite = 0
        this.form.distributeDayLimite = this.form.availableQuantity
      }
      if (this.dateRange && this.dateRange.length > 0) {
        this.form.distributeStart = this.dateRange[0]
        this.form.distributeEnd = this.dateRange[1]
      } else {
        this.form.distributeStart = ''
        this.form.distributeEnd = ''
      }
      if (this.form.distributeType === '1') {
        this.form.distributeBase = ''
      } else {
        this.form.distributeGoods = []
      }
      if (this.form.expirePeriod === '1') {
        this.form.expireStart = ''
        this.form.expireEnd = ''
      } else {
        this.form.this.form.expireStart = this.expireDateRange[0]
        this.form.expireEnd = this.expireDateRange[1]
      }

      const p = JSON.parse(JSON.stringify(this.form))
      p.distributeGoods = p.distributeGoods.map((ele) => {
        return {
          goodsCommonId: ele.id,
          goodsId: ele.id,
          goodsName: ele.name,
          goodsState: ele.sellStat,
          id: ele.id,
          templateId: ele.typeId,
        }
      })

      console.log('submit', p)
    },
    getGoodsOptions() {
      this.$https
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
          this.allGoodsOptions = res.result ? res.list : []
          console.log('this.allGoodsOptions: ', this.allGoodsOptions)
        })
    },
    getGoodsTypeOptions() {
      this.$https.get('api/store/getLogisticsCompany').then((res) => {
        this.typeOptions = res.result ? res.object.goodsType : []
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