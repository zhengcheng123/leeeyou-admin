<template>
  <div>
    <div class="content store-info">
      <el-form :model="itemForm"
               ref="itemForm"
               label-width="90px"
               class="store-form"
               :rules="itemFormRules">
        <el-form-item label="店铺名称"
                      prop="name">
          <el-input v-model.trim="itemForm.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址"
                      prop="address">
          <el-input v-model.trim="itemForm.address"></el-input>
        </el-form-item>
        <el-form-item label="店铺图标"
                      prop="icon">
          <image-upload name="icon"
                        :externalPreviewImages="[]"
                        mode="upload"
                        :limit="1"
                        accept="image/*"
                        ref="iconUploader"
                        :uploadUrl="$IMGHOST+'upload'"
                        :success="setIcon"
                        width="100px"
                        height="100px"></image-upload>
        </el-form-item>
        <el-form-item label="店铺背景"
                      prop="index_html">
          <image-upload name="index"
                        :externalPreviewImages="[]"
                        mode="upload"
                        :limit="1"
                        accept="image/*"
                        ref="indexUploader"
                        :uploadUrl="$IMGHOST+'upload'"
                        :success="createStore"
                        width="100px"
                        height="100px"></image-upload>
        </el-form-item>
        <button class="lg-btn"
                :loading="saving"
                @click="saveItem">创建</button>
      </el-form>
    </div>
  </div>
</template>
<script>
import imageUpload from '../custom-componets/ImageUpload'

export default {
  components: { imageUpload },
  data() {
    return {
      itemForm: {
        id: -1,
        name: '',
        address: '',
        icon: 'noimage',
        indexHtml: '',
      },
      itemFormRules: {
        name: [{ required: true, message: '请输入店铺名称' }],
        address: [{ required: true, message: '请输入店铺的实际地址，可以写注册人的地址' }],
        icon: [{ required: true, message: '请选取图片' }],
      },
      saving: false,
    }
  },
  methods: {
    saveItem() {
      this.$refs['itemForm'].validate((valide) => {
        if (!valide) {
          this.$message.error('信息填写错误')
          return false
        }
        if (!this.$refs['iconUploader'].files.length) {
          this.$message.error('请选取图片')
          return false
        }
        this.$refs['iconUploader'].upload()
      })
    },
    setIcon(uploadRes) {
      if (uploadRes.length) {
        this.itemForm.icon = uploadRes[0]
      }
      this.$refs['indexUploader'].upload()
    },
    createStore(uploadRes) {
      if (uploadRes.length) {
        this.itemForm.indexHtml = uploadRes[0]
      }
      this.$http
        .ajax({
          url: APIHOST + 'api/store/create',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify(this.itemForm),
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '创建店铺成功', type: 'success' })
            this.$router.push('/store')
          } else {
            this.$message({ message: '创建店铺失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('创建店铺接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
  },
}
</script>
<style scoped>
.store-form {
  width: 400px;
  margin: 20px auto;
}
.lg-btn {
  width: 260px;
  height: 35px;
  background: rgba(255, 120, 13, 1);
  border: 1px solid rgba(255, 120, 13, 1);
  border-radius: 6px;
  margin-top: 30px;
  color: #fff;
}
.store-info {
  background-color: #fff;
  padding: 10px;
  margin: 10px;
}
</style>
