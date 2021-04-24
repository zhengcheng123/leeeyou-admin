<template>
  <div>
    <div class="custom_search-header">
      <el-form :inline="true"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item label="优惠券名称">
          <el-input v-model="formInline.user"
                    size="mini"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="formInline.region"
                     size="mini"
                     placeholder="请选择">
            <el-option label="购物赠券"
                       value="shanghai"></el-option>
            <el-option label="全场赠券"
                       value="beijing"></el-option>
            <!-- <el-option label="注册赠券（迭代）"
                       value="beijing"></el-option>
            <el-option label="指定用户赠券（迭代）"
                       value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.region"
                     size="mini"
                     placeholder="活动区域">
            <el-option label="分发中"
                       value="shanghai"></el-option>
            <el-option label="已结束"
                       value="beijing"></el-option>
            <el-option label="未启用"
                       value="beijing"></el-option>
            <el-option label="已发完"
                       value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="mini"
                     @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: '',
      },
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
  },
}
</script>