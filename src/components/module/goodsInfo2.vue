<template>
  <div>
    <div v-for="(attrItem,index) in attr" :key="index">
      <p>{{ attrItem.name }}</p>
      <div v-for="item in attrItem.list" :key="item.valueId" class="input-data">
        <el-input v-model="item.value" placeholder="未命名" />
      </div>
      <i class="el-icon-circle-plus icon-btn primary" @click="add(attrItem)"></i>
      <i
        class="el-icon-remove icon-btn danger"
        v-if="attrItem.list[attrItem.list.length-1].valueId == ''"
        @click="del(attrItem)"
      ></i>
    </div>

    <el-button v-on:click="generate">确认规格</el-button>
    <div class="item">
      <div class="item-label">详细商品：</div>
    </div>
    <div >
      <div class="item-body no-flex">
        <el-table
          :data="showGoods"
          style="width:900px;"
          :header-cell-style="{background:'#E8EAEE',height:'48px',}"
        >
          <el-table-column
            v-for="item in tabledata"
            :key="item.id"
            min-width="120"
            align="center"
            prop="value"
            :label="item.attrsName"
          >
          <template>
            <span>{{item.value}}</span>
          </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="sellSize"
            label="已售"
          ></el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="canSellSize"
            label="可售库存"
          >
            <template slot-scope="scope">
              <span v-if="pageAction ==='info'">{{scope.row.canSellSize}}</span>
              <el-input
                v-else
                class="sm-input"
                size="mini"
                v-model.trim="scope.row.canSellSize"
                name="myInput"
                required
                @input="numInput(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="size"
            label="库存"
          >
            <template slot-scope="scope">
              <span v-if="pageAction ==='info'">{{scope.row.size}}</span>
              <el-input
                v-else
                class="sm-input"
                size="mini"
                v-model.trim="scope.row.size"
                required
                @input="numInput2(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="price"
            label="价格（元）"
          >
            <template slot-scope="scope">
              <span v-if="pageAction ==='info'">{{pennyToDollar(scope.row.price)}}</span>
              <el-input
                v-else
                class="sm-input"
                size="mini"
                v-model.trim="scope.row.priceLabel"
                required
                @input="checknum(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="procurement_price"
            label="成本（元）"
          >
            <template slot-scope="scope">
              <span v-if="pageAction ==='info'">{{pennyToDollar(scope.row.procurement_price)}}</span>
              <el-input
                v-else
                class="sm-input"
                size="mini"
                v-model.trim="scope.row.procurementPrice"
                required
                @input="checknum2(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="state"
            label="状态"
          >
            <template slot-scope="scope">
              <span>{{scope.row.state ==1?'已上架':'已下架'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            align="center"
            prop="state"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="isFrame(scope.row)"
              >{{scope.row.state ==1 ? '下架' : '上架'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div style="display:flex">
        <div v-for="attr in goods.goods2attrsBeans">
          <p>{{ attr.attrsName }}:{{ attr.value }}</p>
        </div>
        <input v-model="goods.sellSize" placeholder="0" />
        <input v-model="goods.canSellSize" placeholder="0" />
        <input v-model="goods.size" placeholder="0" />
        <input v-model="goods.price" placeholder="0" />
        <input v-model="goods.procurementPrice" placeholder="0" />
        <input v-model="goods.state" placeholder="0" />
      </div> -->
    </div>
    <el-button @click="save">保存</el-button>
  </div>
</template>
<script>
import imageUpload from "../custom-componets/ImageUpload";
import { pennyToDollar } from "../../assets/utils";

export default {
  components: { imageUpload },
  data() {
    return {
      tabledata:[],
      // 接口返回数据
      goodsCommonId: "",
      attr: [],
      goods: [],
      goodsCommon: {},
      types: [],
      typeId: 0,
      // 展示数据，将来需要上传
      showGoods: []
    };
  },

  computed: {
    pageAction() {
      let action = this.$route.path.split("/").pop();
      if (action === "edit") {
      }
      return action;
    }
  },

  mounted() {
    this.goodsCommonId = this.$route.query.id;
    this.getGrands();
    this.initData();
    this.initAttrNames(this.typeId);
  },
  methods: {
    add(attrItem) {
      console.log(attrItem);
      attrItem.list.push({
        id: "",
        attrsId: attrItem.list[0].attrsId,
        attrsName: attrItem.list[0].attrsName,
        value: "",
        valueId: ""
      });
    },
    del(attrItem) {
      let valueId = attrItem.list[attrItem.list.length - 1].valueId;
      console.log(valueId);
      if (valueId != "") {
        this.$message("已有属性无法删除");
        return;
      }
      //如果list里面只有一个属性，则删除整体
      if (attrItem.list.length == 1) {
        var index = this.attr.indexOf(attrItem);
        if (index > -1) {
          this.attr.splice(index, 1);
        }
      }
      attrItem.list.pop();
    },

    getGrands: function() {
      console.log(this.goodsCommonId);
    },
    initData: function() {
      this.$http
        .ajax({
          url: APIHOST + "api/goods/getGoodsInfo/" + this.goodsCommonId,
          type: "get"
        })
        .done(res => {
          if (res.result === 1) {
            this.goodsCommon = res.object.goodsCommon;
            this.goods = res.object.list;
            this.types = res.object.type;
            this.typeId = res.object.typeId;
            this.initAttr(res.object.attrs);
          }
        })
        .fail(() => {
          console.log("接口出错");
        })
        .always(() => {
          this.saving = false;
        });
    },
    //生成所有规格的商品数组
    generate: function() {
      this.showGoods.length = 0;
      var firstAttr = this.attr[0];
      //生成第一个属性的商品list
      firstAttr.list.forEach(item => {
        // 设置默认 商品属性
        let goods = new Object();
        goods["id"] = null;
        goods["canSellSize"] = 0;
        goods["goodsCommonId"] = this.goodsCommonId;
        goods["price"] = 0;
        goods["sellSize"] = 0;
        goods["size"] = 0;
        goods["state"] = 1;
        goods["procurementPrice"] = 0;
        goods["goods2attrsBeans"] = [];
        goods["goods2attrsBeans"].push(item);
        this.showGoods.push(goods);
      });
      // 从第二个规格属性开始，循环计算商品属性和数量,如果没有第二个规格则不会进入
      for (let index = 1; index < this.attr.length; index++) {

        let element = this.attr[index];
        let tempShowGoods = [];
        for (let j = 0; j < this.showGoods.length; j++) {
          let showItem = this.showGoods[j];
          for (let i = 0; i < element.list.length; i++) {
            let item = element.list[i];
            let goods = new Object();
            goods["id"] = null;
            goods["canSellSize"] = 0;
            goods["goodsCommonId"] = this.goodsCommonId;
            goods["price"] = 0;
            goods["procurementPrice"] = 0;
            goods["sellSize"] = 0;
            goods["size"] = 0;
            goods["state"] = 1;
            //此处需要深copy
            var [...arr2] = showItem.goods2attrsBeans;
            goods["goods2attrsBeans"] = arr2;
            goods["goods2attrsBeans"].push(item);
            tempShowGoods.push(goods);
          }
        }
        this.showGoods = tempShowGoods;
      }
      this.updateShowGoods();
      // this.goods.map(item=>{
      //   this.tabledata = item.goods2attrsBeans
      //   console.log(this.tabledata,'==')
      //   return item
      // })
      
        console.log('goods',this.goods)
      console.log('showGoods',this.showGoods)
    },
    // 根据 商品属性 生成指定商品完成
    // 比对接口返回值 为展示值填充必要的id数据
    updateShowGoods() {
      for (let i = 0; i < this.showGoods.length; i++) {
        let showItem = this.showGoods[i];
        let showAttrs = showItem.goods2attrsBeans;
        for (let j = 0; j < this.goods.length; j++) {
          let item = this.goods[j];
          let attrs = item.goods2attrsBeans;
          let flag = this.checkAndUpdateSameAttr(showAttrs, attrs);
          if (flag) {
            showItem.id = item.id;
            showItem.sellSize = item.sellSize;
            showItem.canSellSize = item.canSellSize;
            showItem.goodsCommonId = item.goodsCommonId;
            showItem.price = item.price;
            showItem.procurementPrice = item.procurement_price;
            showItem.sellSize = item.sellSize;
            showItem.size = item.size;
            showItem.state = item.state;
          }
        }
      }
    },

    //判断两个属性数组是否完全相同（attrId，valueId，完全相同)
    // oldAttrs 必须带valueId,newAttrs 可能没有valueId 或者vauleId为空
    checkAndUpdateSameAttr(newAttrs, oldAttrs) {
      let flag = true;
      //数量不想等，则所有属性必然不想等
      if (newAttrs.length != oldAttrs.length) {
        return false;
      }

      for (let i = 0; i < newAttrs.length; i++) {
        let newAttr = newAttrs[i];
        let newAttrId = newAttr.attrsId;
        let newValueId = newAttr.valueId;

        let oldAttr = oldAttrs[i];
        let oldAttrId = oldAttr.attrsId;
        let oldvalueId = oldAttr.valueId;
        if (newAttrId == oldAttrId && oldvalueId == newValueId) {
          newAttr.id = oldAttr.id;
          newAttr.goodsId = oldAttr.goodsId;
          newAttr.goodsCommonId = oldAttr.goodsCommonId;
        } else {
          flag = false;
        }
      }
      return flag;
    },

    // 重组规格数组转化为二维数组
    initAttr(attrList) {
      var attrId = -1;
      var nowAttr;
      attrList.forEach(item => {
        if (attrId != item.attrsId) {
          if (attrId != -1) {
            this.attr.push(nowAttr);
          }
          nowAttr = new Object();
          attrId = item.attrsId;
          nowAttr["id"] = attrId;
          nowAttr["name"] = item.attrsName;
          nowAttr["list"] = [];
          nowAttr["list"].push(item);
        } else {
          nowAttr["list"].push(item);
        }
      });

      this.attr.push(nowAttr);
    },

    initAttrNames(type) {
      this.$http
        .ajax({
          url: APIHOST + "api/Attrs/getByType/3",
          type: "get"
        })
        .done(res => {
          console.log(res);
          if (res.result === 1) {
            this.attrNames = res.object;
          }
          console.log(this.attrNames);
        })
        .fail(() => {
          console.log("接口出错");
        })
        .always(() => {
          this.saving = false;
        });
    },

    save() {
      var pushAttr = [];
      for (let i = 0; i < this.attr.length; i++) {
        let element = this.attr[i];
        for (let j = 0; j < element.list.length; j++) {
          let item = element.list[j];
          pushAttr.push(item);
        }
      }
      this.$http
        .ajax({
          url: APIHOST + "api/goods/update",
          contentType: "application/json; charset=utf-8", // 是否json提交
          dataType: "json",
          type: "post",
          data: JSON.stringify({
            updateAttrs: pushAttr,
            goodsCommon: this.goodsCommon,
            goods: this.showGoods
          }),
          context: this
        })
        .done(res => {
          console.log(res);
        });
    },
      numInput(value) {
      //如果输入非数字，则替换为''
      value.canSellSize = value.canSellSize.replace(/[^\d]/g, "");
      //必须保证第一个为数字而不是.
      value.canSellSize = value.canSellSize.replace(/^/g, "");
      //前两位不能是0加数字
      value.canSellSize = value.canSellSize.replace(/^0\d[0-9]*/g, "");
    },
    numInput2(value) {
      //如果输入非数字，则替换为''
      value.size = value.size.replace(/[^\d]/g, "");
      //必须保证第一个为数字而不是.
      value.size = value.size.replace(/^/g, "");
      //前两位不能是0加数字
      value.size = value.size.replace(/^0\d[0-9]*/g, "");
    },
      checknum(value) {
        //如果输入非数字，则替换为''
        value.priceLabel = value.priceLabel.replace(/[^\d\.]/g, "");
        //必须保证第一个为数字而不是.
        value.priceLabel = value.priceLabel.replace(/^\./g, "");
        //前两位不能是0加数字
        value.priceLabel = value.priceLabel.replace(/^0\d[0-9]*/g, "");
        //保证只有出现一个.而没有多个.
        value.priceLabel = value.priceLabel.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        value.priceLabel = value.priceLabel
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        //只能输入两位小数
        value.priceLabel = value.priceLabel.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
      },
    checknum2(value) {
      //如果输入非数字，则替换为''
      value.procurementPrice = value.procurementPrice.replace(/[^\d\.]/g, "");
      //必须保证第一个为数字而不是.
      value.procurementPrice = value.procurementPrice.replace(/^\./g, "");
      //前两位不能是0加数字
      value.procurementPrice = value.procurementPrice.replace(/^0\d[0-9]*/g, "");
      //保证只有出现一个.而没有多个.
      value.procurementPrice = value.procurementPrice.replace(/\.{2,}/g, ".");
      //保证.只出现一次，而不能出现两次以上
      value.procurementPrice = value.procurementPrice
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //只能输入两位小数
      value.procurementPrice = value.procurementPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    },
  }
};
</script>
<style scoped>
.input-data {
  width: 200px;
  display: inline-flex;
  margin-right: 10px;
}
.steps {
  margin: 10px auto;
  text-align: center;
  max-width: 800px;
}

.goods-info {
  text-align: center;
  max-width: 1300px;
  margin: auto;
}

.btn-group .el-button {
  margin: 0;
}

.btn-group .el-button:not(:last-child):after {
  content: "";
  border: solid 1px #dddddd;
  height: 3px;
  margin: 0 5px;
}

.attr > * {
  margin-right: 10px;
}

.inline-item {
  margin-right: 20px;
}

.inline-item label {
  width: 80px;
  color: #666;
}

.inline-item .el-input {
  width: 120px;
}

.form-section {
  border-radius: 3px;
  background-color: #fff;
}

.form-section .section-head {
  background-color: #f5f7fb;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  padding-left: 48px;
}

.form-section .section-body {
  padding: 30px 20px;
}

.item {
  display: flex;
  font-size: 14px;
  color: #5a5e66;
  margin-top: 20px;
}

.item .item-label {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: right;
  padding-right: 20px;
}

.item-body {
  overflow-x: auto;
  width: 550px;
}
.label-input {
  width: 100px;
}
.icon-btn {
  font-size: 20px;
  cursor: pointer;
}
.danger {
  color: #f56c6c;
}
.primary {
  color: #409eff;
}
.attr-list {
  display: flex;
  align-items: center;
}
.select-attr,
.predict-attr-head {
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sm-input {
  width: 100px;
}
.error-input .el-input__inner {
  border-color: #f56c6c;
}
.goods-row {
  width: 100%;
  height: 80px;
  background-color: #fff;
  padding-left: 39px;
  border-radius: 3px;
  padding-top: 21px;
}

.item-body .el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: initial;
}
.item-body .el-table {
  padding: 10px;
}
.attr-list {
  max-width: 800px;
  height: auto;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
.attr-list li {
  padding-bottom: 10px;
}
</style>
<style>
/* .item-body .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
} */

.el-table .red-row {
  color: red;
}
input:required:invalid {
  border-color: red;
}

.el-radio.is-bordered {
  margin-bottom: 15px;
}
</style>
