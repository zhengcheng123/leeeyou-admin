<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
          订单详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form :inline="true">
        <el-form-item label="物流单号">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="code">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="stat">
          <el-select>
            <!-- <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary" @click="add">新增</el-button>
          <el-button>编辑</el-button>
        </el-form-item>
      </el-form>
      <el-table border style="width: 100%" @sort-change="sortItems" :max-height="maxTableHeight">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="code" min-width="120" label="订单号" align="center"></el-table-column>
        <el-table-column prop="payment" min-width="120" label="物流单号" sortable align="center">
          <!-- <template slot-scope="props">
            {{pennyToDollar(props.row.price + props.row.freight)}}
          </template>-->
        </el-table-column>
        <!-- <el-table-column prop="paycode" label="支付交易编号" align="center"></el-table-column> -->
        <el-table-column prop="buyer_name" min-width="120" label="物流公司" align="center"></el-table-column>
        <!--<el-table-column prop="shopping_addr" label="收货地址id" sortable></el-table-column>-->
        <!--<el-table-column prop="stat" label="交易状态" sortable align="center"></el-table-column>-->
        <el-table-column prop="comment" min-width="120" label="买家备注" align="center"></el-table-column>
        <el-table-column prop="we_chat" min-width="120" label="买家微信" align="center"></el-table-column>
        <el-table-column label="配送方式" min-width="120" align="center">
          <!-- <template slot-scope="props">
            <span v-if="props.row.logistics_type === 1">快递</span>
            <span v-if="props.row.logistics_type === 2">自提</span>
            <span v-if="props.row.logistics_type === 3">无物流</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="freight" min-width="100" label="运费" sortable>
          <!-- <template slot-scope="props">
            {{pennyToDollar(props.row.freight)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="stat" min-width="100" label="状态" sortable align="center">
          <!-- <template slot-scope="props">
            {{renderStateLabel(states, props.row.stat)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="create_time" min-width="120" label="创建时间" sortable align="center">
          <!-- <template slot-scope="props">
            {{renderTime(props.row.create_time)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="pay_time" min-width="120" label="付款时间" sortable align="center">
          <!-- <template slot-scope="props">
            {{renderTime(props.row.pay_time)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="send_time" min-width="120" label="发货时间" sortable align="center">
          <!-- <template slot-scope="props">
            {{renderTime(props.row.send_time)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="finish_time" min-width="120" label="成交时间" sortable align="center">
          <!-- <template slot-scope="props">
            {{renderTime(props.row.finish_time)}}
          </template>-->
        </el-table-column>
        <el-table-column prop="finish_time" min-width="120" label="商品名称" sortable align="center"></el-table-column>
        <el-table-column label="操作" min-width="210" align="center">
          <template>
            <div class="btn-group">
              <el-button type="text">发货</el-button>
              <el-button type="text">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增订单" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <el-form
        :inline="true"
        :model="orderForm"
        ref="orderForm"
        label-width="90px"
        class="account-form"
        :rules="orderFormRules"
      >
        <el-form-item label="物流单号">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="物流公司">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="买家微信">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="买家姓名">
          <el-input></el-input>
        </el-form-item>
          <el-form-item label="配送方式">
          <el-input></el-input>
        </el-form-item>
          <el-form-item label="运费">
          <el-input></el-input>
        </el-form-item>
          <el-form-item label="状态">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="付款时间">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="发货时间">
          <el-input></el-input>
        </el-form-item>
         <el-form-item label="成交时间">
          <el-input></el-input>
        </el-form-item>
          <el-form-item label="商品名称">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      orderForm: {},
      orderFormRules: {}
    };
  },
  methods: {
    add() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style scoped>
</style>