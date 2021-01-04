<template>
  <div>
    <div class="coupon-add">
      <div class="section-head">基础信息</div>
      <el-form :model="couponPassForm" :rules="rules" ref="couponPassForm" label-width="81px">
        <el-form-item label="优惠券类型：" prop="category" label-width="150px">
          <el-select clearable v-model="couponPassForm.category">
            <el-option label="购物赠券" value="1"></el-option>
            <el-option  label="全场赠券" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称：" prop="name" label-width="150px">
          <el-input v-model="couponPassForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="总发放量：" prop="count" label-width="150px">
          <el-input size="small" v-model="couponPassForm.count" @keyup.native="inputChange(couponPassForm.count,'count')"></el-input>
        </el-form-item>
        <el-form-item label="面额：" prop="discountQuota" label-width="150px">
          <el-input size="small" v-model="couponPassForm.discountQuota" @keyup.native="inputChange(couponPassForm.discountQuota,'discountQuota')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每人限领：" prop="distributeUserLimites" label-width="150px">
          <template>
            <el-radio-group v-model="distributeUserLimites">
              <el-radio label="1">
                每人限领&nbsp;&nbsp;
                <el-input-number
                  v-model="couponPassForm.distributeUserLimite"
                 
                  label="描述文字"
                ></el-input-number>&nbsp;&nbsp;张
              </el-radio>
              <el-radio label="2">
                每人每日限领&nbsp;&nbsp;
                <el-input-number
                  v-model="couponPassForm.distributeDayLimite"
                 
                  label="描述文字"
                ></el-input-number>&nbsp;&nbsp;张
              </el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <div class="section-head">发放规则</div>
         <el-form-item label="发放时间：" prop="distributeArr" label-width="150px">
          <el-date-picker
           value-format="yyyy-MM-dd HH:mm:ss"
            v-model="couponPassForm.distributeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
             :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <div v-if="couponPassForm.category==='1'">
           <el-form-item label="发放方式：" prop="distributeType" label-width="150px">
          <template>
            <el-radio-group v-model="couponPassForm.distributeType">
              <el-radio label="1">指定商品消费</el-radio>
              <el-radio label="2">消费满金额发放</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="添加商品：" prop="oldPassword" label-width="150px" v-if="couponPassForm.distributeType==='1'">
          <div class="store-choose">
            <el-input
              v-model.trim="conditionForm.condition.name"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-select v-model="conditionForm.condition.type" slot="prepend" placeholder="请选择">
                <el-option
                  v-for="item in commonTypes"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button @click="getItems(1)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table
              :data="currentItems"
              @selection-change="handleSelectionChange"
              style="width: 100%"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" type="selection" width="55"></el-table-column>
              <el-table-column align="center" min-width="100" prop="name" label="商品名称"></el-table-column>
              <el-table-column align="center" min-width="100" prop="typeName" label="商品分类"></el-table-column>

              <el-table-column align="center" min-width="120" prop="sellStat" label="销售状态">
                <template slot-scope="props">
                  <span v-if="props.row.sellStat === 1">上架</span>
                  <span v-if="props.row.sellStat === 2">下架</span>
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
        <el-form-item label="消费金额满" prop="distributeBase" label-width="150px" v-if="couponPassForm.distributeType==='2'">
          <el-input v-model="couponPassForm.distributeBase" @keyup.native="inputChange(couponPassForm.distributeBase,'distributeBase')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        </div>
       
        <div class="section-head">使用规则</div>
        <el-form-item label="使用门槛：" prop="expire" label-width="150px">
          <template>
            <el-radio-group v-model="expire">
              <el-radio label="1">无限制</el-radio>
              <el-radio label="2">
                满&nbsp;&nbsp;
                <el-input v-model="couponPassForm.discountBase" @keyup.native="inputChange(couponPassForm.discountBase,'discountBase')" style="margin-top: -12px;">
                  <template slot="append">元</template>
                </el-input>
              </el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
       
        <el-form-item label="卷有效期：" prop="expirePeriod" label-width="150px">
          <el-radio-group v-model="couponPassForm.expirePeriod">
            <el-radio label="2">日期范围</el-radio>
            <el-date-picker
             value-format="yyyy-MM-dd HH:mm:ss"
              v-model="couponPassForm.expireArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>

            <el-radio label="1">固定天数</el-radio>
            <el-input v-model="couponPassForm.expireGap" @keyup.native="inputChange(couponPassForm.expireGap,'expireGap')">
              <template  slot="append">天</template>
            </el-input>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否可与其他优惠同享：" prop="oldPassword" label-width="180px">
          <el-radio-group v-model="available">
            <el-radio label="1">不可同时使用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可使用商品：" prop="useType" label-width="150px">
          <el-radio-group v-model="couponPassForm.useType">
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
            <el-input
              style="width: 300px;"
              v-model.trim="conditionForm.condition.name"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-button @click="getItems(2)" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table
              :data="storItems"
              style="width: 100%"
              @selection-change="storeChange"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" type="selection" width="55"></el-table-column>
              <el-table-column align="center" min-width="100" prop="name" label="商品名称"></el-table-column>
              <el-table-column align="center" min-width="120" prop="sellStat" label="销售状态">
                <template slot-scope="props">
                  <span v-if="props.row.sellStat === 1">上架</span>
                  <span v-if="props.row.sellStat === 2">下架</span>
                </template>
              </el-table-column>
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
        <el-form-item
          label="选择分类"
          prop="oldPassword"
          label-width="150px"
          v-if="couponPassForm.useType == '3'"
        >
          <div class="store-choose">
            <el-select slot="prepend" v-model="conditionForm.condition.type" placeholder="请选择">
              <el-option
                v-for="item in commonTypes"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
            <el-table
              :data="commonTypes"
              @selection-change="typeChange"
              style="width: 100%"
              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
            >
              <el-table-column align="center" type="selection" width="55"></el-table-column>
              <el-table-column align="center" min-width="100" prop="typeName" label="分类名称"></el-table-column>
            </el-table>
          </div>
        </el-form-item>

        <el-form-item label="备注：" prop="oldPassword" label-width="150px">
          <textarea v-model="couponPassForm.intro" cols="30" rows="5" style="width: 550px;"></textarea>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="info" @click="backList">返 回</el-button>
        <el-button type="primary" @click="addSure()">确 定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        available: '1',
      expire:'1',
      checkId: [],
      itemId: [],
      typeId: [],
      dateRange: "1",
      distributeUserLimites: "1",
      currentItems: [],
      storItems: [],
      commonTypes: [],
      distributeGoodsBaseObject: {
            goodsCommonId: "",
            goodsId: "",
            goodsName: "",
            goodsState: "",
            id: "",
            templateId: ""
        },
      useGoodsBaseObject: {
            goodsCommonId: 0,
            goodsId: 0,
            goodsName: "",
            goodsState: 0,
            goodsType: 0,
            id: 0,
            templateId: 0
          },
      couponPassForm: {
        category: "1",
        code: "",
        count: "",
        createTime: "",
        discountBase: null,
        discountQuota: "",
        distributeBase: null,
        distributeCount: "",
        distributeDayLimite: undefined,
        distributeEnd: "",
        distributeGoods: [
          
        ],
        distributeArr: [],
        expireArr:[],
        distributeType: "1",
        distributeUserLimite: undefined,
        expireCount: "",
        expireEnd: "",
        expireGap: "",
        expirePeriod: "2",
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
        useType: "1",
        userId: 0,
        weight: 0
      },
      rules: {
        category:[{required: true, message: '请选择', trigger: 'blur'}],
        count:[{required: true, message: '请输入', trigger: 'blur'}],
        // expire:[{required: true, message: '请输入', trigger: 'blur'}],
        discountQuota:[{required: true, message: '请输入', trigger: 'blur'}],
        distributeBase:[{required: true, message: '请输入', trigger: 'blur'}],
        distributeArr:[{required: true, message: '请输入', trigger: 'blur'}],
        distributeType:[{required: true, message: '请输入', trigger: 'blur'}],
        distributeUserLimite:[{required: true, message: '请输入', trigger: 'blur'}],
        expirePeriod:[{required: true, message: '请输入', trigger: 'blur'}],
        name:[{required: true, message: '请输入', trigger: 'blur'}],
        useType:[{required: true, message: '请输入', trigger: 'blur'}],
      },
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
      pickerOptions:{
         disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  mounted() {
    this.getGrands();
    this.getItems(1);
    this.getItems(2);
  },
  methods: {
    getGrands() {
      this.$axios
        .get(`${globalConfig.server1}api/goodsType/getTypesByLevel/2`)
        .then(res => {
          if (res.data.result === 1) {
            this.commonTypes = res.data.object;
          } else {
            console.error("获取商品分类失败");
          }
        });
    },

    getItems(num) {
      this.$axios
        .post(globalConfig.server1 + "api/goods/list", this.conditionForm)
        .then(res => {
          if (res.data.result === 1) {
            if (res.list <= 0) {
              this.$message({ message: "没有找到匹配项", type: "info" });
              return false;
            }

            if (num == 1) {
              this.currentItems = res.data.list;
              this.conditionForm.page.total = res.data.page.total;
            } else if (num == 2) {
              this.storItems = res.data.list;
              this.params.page.total = res.data.page.total;
            }
          } else {
            this.$message({ message: "获取入库列表失败", type: "error" });
            this.currentItems = [];
            this.storItems = [];
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
    addSure() {
      if(this.checkId.length > 0){
         this.couponPassForm.distributeGoods = this.getNewObject(this.distributeGoodsBaseObject,['id'],['goodsCommonId'],this.checkId)
      }
      if(this.itemId.length > 0){
        this.couponPassForm.useGoods = this.getNewObject(this.useGoodsBaseObject,['id'],['goodsCommonId'],this.itemId)
      }
      if(this.typeId.length > 0){
          this.couponPassForm.useGoods = this.getNewObject(this.useGoodsBaseObject,['id'],['goodsType'],this.typeId)
      }
      this.couponPassForm.discountBase = this.couponPassForm.discountBase*100;
      let params = 
      {
        ...this.couponPassForm,
      distributeStart:this.couponPassForm.distributeArr[0],
      distributeEnd:this.couponPassForm.distributeArr[1],
      expireStart:this.couponPassForm.expireArr[0],
      expireEnd:this.couponPassForm.expireArr[1],
      }
       if(this.expire === '1'){
         params.discountBase = 0

      }
      params.discountQuota = this.couponPassForm.discountQuota*100;
      params.distributeBase = this.couponPassForm.distributeBase*100;
      this.$axios
        .post(globalConfig.server1 + "couponTemplate/save", params)
        .then(res => {
          if (res.data.result === 1) {
           this.$message.success(res.data.msg)
           this.$parent.backPlan();
          } else {
           this.$message.error(res.data.msg)
          }
        });
    },

    handleSelectionChange(val) {
      this.checkId = val;
    },
    storeChange(val) {
      this.itemId = val;
    },
    typeChange(val) {
      this.typeId = val;
    },
    pageSize(size, num) {
      this.conditionForm.page.pageSize = size;
      this.getItems(num);
    },
    pageNo(no, num) {
      this.conditionForm.page.pageNum = no;
      this.getItems(num);
    },
  inputChange(name,rowName) { //输入框值改变
        let val  = '' + name;
        console.log(name,rowName)
      if (!val) {
        return;
      }

      val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      val = val
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (val.indexOf(".") < 0 && val != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val);
      }
      this.couponPassForm[rowName] = val;
console.log( this.couponPassForm[rowName])
    },
      //返回
    backList() {
      this.$parent.backPlan();
    },

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