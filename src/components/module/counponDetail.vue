<template>
  <div>
    <div class="coupon-add">
      <div class="section-head">基础信息</div>
      <el-form :model="couponPassForm" :rules="rules" ref="couponPassForm" label-width="81px">
        <el-form-item label="优惠券类型：" prop="category" label-width="150px">
          <el-select disabled clearable v-model="couponPassForm.category">
            <el-option label="购物赠券" value="1"></el-option>
            <el-option label="全场赠券" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称：" prop="oldPassword" label-width="150px">
          <div>{{couponPassForm.name}}</div>
        </el-form-item>
        <el-form-item label="总发放量：" prop="oldPassword" label-width="150px">
             <div>{{couponPassForm.count}}</div>
        </el-form-item>
        <el-form-item label="面额：" prop="oldPassword" label-width="150px">
             <div>{{couponPassForm.discountQuota}}&nbsp;元</div>
        </el-form-item>
        <el-form-item label="每人限领：" prop="oldPassword" label-width="150px">
          <template>
            <el-radio-group v-model="distributeUserLimite">
              <el-radio label="1" disabled>
                每人限领&nbsp;&nbsp;
                <el-input-number
                disabled
                  v-model="couponPassForm.distributeUserLimite"
                  :min="1"
                  :max="10"
                  label="描述文字"
                ></el-input-number>&nbsp;&nbsp;张
              </el-radio>
              <el-radio label="2" disabled>
                每人每日限领&nbsp;&nbsp;
                <el-input-number
                disabled
                  v-model="couponPassForm.distributeDayLimite"
                  :min="1"
                  :max="10"
                  label="描述文字"
                ></el-input-number>&nbsp;&nbsp;张
              </el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <div class="section-head">发放规则</div>
         <el-form-item label="发放时间：" prop="distributeArr" label-width="150px">
          <el-date-picker
          disabled
           value-format="yyyy-MM-dd HH:mm:ss"
            v-model="distributeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发放方式：" v-if="couponPassForm.category==='1'" prop="oldPassword" label-width="150px">
          <template>
            <el-radio-group v-model="couponPassForm.distributeType" disabled>
              <el-radio label="1">指定商品消费</el-radio>
              <el-radio label="2" @change="changeMoney()">消费满金额发放</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="添加商品：" prop="oldPassword" label-width="150px"   v-if="couponPassForm.distributeType==='1'">
          <div class="store-choose">
            <el-table
              :data="distribute"
              style="width: 100%"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" min-width="100" prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column align="center" min-width="120" prop="goodsState" label="销售状态">
                <template slot-scope="props">
                  <span v-if="props.row.goodsState === 1">上架</span>
                  <span v-if="props.row.goodsState === 2">下架</span>
                </template>
              </el-table-column>
            </el-table>
             <el-pagination
              class="pagination"
              @size-change="(size) =>{  return pageSize(size,1)}"
              :page-sizes="[15,30,50,100]"
              :page-size="conditionForm.page.pageSize"
              :current-page="conditionForm.page.pageNum"
              @current-change="(size) =>{return pageNo(size,1)}"
              layout="total, sizes,prev, pager, next, jumper"
              :total="conditionForm.page.total"
            ></el-pagination>
          </div>
        </el-form-item>
        <el-form-item label="消费金额满" prop="oldPassword" label-width="150px" v-if="couponPassForm.distributeType==='2'">
          <el-input disabled v-model="couponPassForm.distributeBase"  >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <div class="section-head">使用规则</div>
        <el-form-item label="使用门槛：" prop="oldPassword" label-width="150px">
          <template>
            <el-radio-group v-model="expire" disabled>
              <el-radio label="1">无限制</el-radio>
              <el-radio label="2">
                满&nbsp;&nbsp;
                <el-input disabled style="margin-top: -12px;" v-model="couponPassForm.discountBase">
                  <template slot="append">元</template>
                </el-input>
              </el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
       
        <el-form-item label="卷有效期：" prop="oldPassword" label-width="150px">
          <el-radio-group v-model="couponPassForm.expirePeriod" disabled>
            <el-radio label="2">日期范围</el-radio>
            <el-date-picker
            disabled
             value-format="yyyy-MM-dd HH:mm:ss"
              v-model="couponPassForm.expireArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <el-radio label="1">固定天数</el-radio>
            <el-input disabled v-model="couponPassForm.expireGap">
              <template slot="append">天</template>
            </el-input>
          </el-radio-group>
        </el-form-item>

     <el-form-item label="是否可与其他优惠同享：" prop="oldPassword" label-width="180px">
          <el-radio-group v-model="available" disabled>
            <el-radio label="1">不可同时使用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可使用商品：" prop="oldPassword" label-width="150px">
          <el-radio-group v-model="couponPassForm.useType" disabled>
            <el-radio label="1">全场通用</el-radio>
            <el-radio label="2">指定商品</el-radio>
            <el-radio label="3">指定分类</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="添加商品："
          prop="oldPassword"
          label-width="150px"
          v-if="couponPassForm.useType == '2'"
        >
          <div class="store-choose">
            <el-table
              :data="storItems"
              style="width: 100%"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" min-width="100" prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column align="center" min-width="120" prop="goodsState" label="销售状态">
                <template slot-scope="props">
                  <span v-if="props.row.goodsState === 1">上架</span>
                  <span v-if="props.row.goodsState === 2">下架</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item
          label="选择分类"
          prop="oldPassword"
          label-width="150px"
          v-if="couponPassForm.useType == '3'"
        >
          <div class="store-choose">
            <el-table
              :data="usegood"
              style="width: 100%"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" min-width="100" prop="typeName" label="分类名称"></el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              @size-change="(size) =>{return pageSize(size,2)}"
              :page-sizes="[15,30,50,100]"
              :page-size="params.page.pageSize"
              :current-page="params.page.pageNum"
              @current-change="(size) =>{return pageNo(size,2)}"
              layout="total, sizes,prev, pager, next, jumper"
              :total="params.page.total"
            ></el-pagination>
          </div>
        </el-form-item>

        <el-form-item label="备注：" prop="oldPassword" label-width="150px">
          <div  cols="30" rows="5" style="width: 550px;">{{couponPassForm.intro}}</div>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="info" @click="backList">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      available: '1',
      expire:'',
        distribute:[],
        usegood:[],
      dateRange: "",
      distributeUserLimite: "1",
      currentItems: [],
      storItems: [],
      commonTypes: [],
      distributeArr: [],
      couponPassForm: {
        category: "1",
        code: "",
        count: "",
        createTime: "",
        discountBase: "",
        discountQuota: "",
        distributeBase: 0,
        distributeCount: "",
        distributeDayLimite: "",
        distributeEnd: "",
        distributeGoods: [
          
        ],
        expireArr:[],
        distributeType: "",
        distributeUserLimite: "1",
        expireCount: "",
        expireEnd: "",
        expireGap: "",
        expirePeriod: "",
        expireStart: "",
        expired: true,
        id: "",
        intro: "",
        logo: "",
        name: "",
        productline: "",
        storeId: 0,
        useCount: 0,
        useGoods: [
          
        ],
        useType: "",
        userId: 0,
        weight: 0
      },
      rules: {},
      Id:this.$route.query.id,
            conditionForm: {
        condition: {
          name: "",
          type: null,
          state: "",
          recommend: ""
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: "id",
          sortorder: "desc"
        }
      },
      params: {
        condition: {
          name: "",
          type: null,
          state: "",
          recommend: ""
        },
        page: {
          pageSize: 15,
          pageNum: 1,
          total: 0,
          sortname: "id",
          sortorder: "desc"
        }
      },
    };
  },

  mounted() {
      this.getDetail();
  },
  methods: {
  getDetail() {
      this.$axios
        .get(`${globalConfig.server1}couponTemplate/get/${this.Id}`)
        .then(res => {
          if (res.data.result === 1) {
           this.couponPassForm = res.data.object;
           this.distribute = res.data.object.distributeGoods;
           this.usegood = res.data.object.useGoods;
           this.storItems = res.data.object.useGoods;
            this.couponPassForm.distributeBase = this.couponPassForm.distributeBase/100;
            this.couponPassForm.discountQuota = this.couponPassForm.discountQuota/100;
             this.couponPassForm.discountBase = this.couponPassForm.discountBase/100;
           this.couponPassForm.distributeBase = this.couponPassForm.distributeBase+'';
           this.couponPassForm.distributeType = this.couponPassForm.distributeType+'';
           this.couponPassForm.expirePeriod = this.couponPassForm.expirePeriod+'';
              this.couponPassForm.useType = this.couponPassForm.useType+'';
            this.couponPassForm.category = this.couponPassForm.category+'';
           if(this.couponPassForm.discountBase === 0){
            this.expire = '1';
           }else{
            this.expire = '2';
           }
           if(this.couponPassForm.expireArr!=0){
             this.dateRange = '1'
           }else{
             this.dateRange = '2'
           }
         this.distributeArr = [res.data.object.distributeStart,res.data.object.distributeEnd];
         this.couponPassForm.expireArr = [res.data.object.expireStart,res.data.object.expireEnd]
          } else {
            console.error("res.data.rbg");
          }
        });
    },
 
    getNewObject(oldObject,baseNames,newNames,checkSelectObject){
        let baseOldObjectKeys = Object.keys(oldObject);
        return checkSelectObject.map(item =>{
          let object = {};
            baseOldObjectKeys.forEach(element => {
              object[element] = oldObject[element];
            });
            for (let index = 0; index < baseNames.length; index++) {
               object[newNames[index]] = item[baseNames[index]]
            }
            return object
        })
    },
       pageSize(size, num) {
      this.conditionForm.page.pageSize = size;
      this.getItems(num);
    },
    pageNo(no, num) {
      this.conditionForm.page.pageNum = no;
      this.getItems(num);
    },
    backList(){
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.coupon-add {
  border-radius: 3px;
  background-color: #fff;
  width: 100%;
}
.section-head {
  width: auto;
  position: relative;
  background-color: #f5f7fb;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  padding-left: 48px;
  margin-bottom: 10px;
}

/deep/ .el-input--small .el-input__inner {
  width: 210px;
}
/deep/ .el-form-item__content .el-input-group {
  width: 200px;
}
/deep/ .el-input-group--prepend .el-input__inner,
.el-input-group__append {
  width: 200px;
}
/* /deep/ .el-select .el-input {
  width: 130px;
} */
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.footer{
  text-align: center;
    height: 65px;
}
</style>