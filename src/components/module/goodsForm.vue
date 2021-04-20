<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/index'}">
          <i class="fa fa-shopping-bag"
             aria-hidden="true"></i>
          商品管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>发布商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form>
        <el-steps :space="200"
                  class="steps"
                  align-center
                  :active="addStatus"
                  finish-status="success">
          <el-step title="商品类别"></el-step>
          <el-step title="基本信息"></el-step>
          <el-step title="商品详情"></el-step>
        </el-steps>
        <el-tabs :value="activeTab"
                 type="border-card"
                 class="goods-info">
          <el-tab-pane label="选择商品类别"
                       name="type"
                       :disabled="true">
            <div class="row">
              <el-radio v-for="commonType in commonTypes"
                        :key="commonType.id"
                        v-model="parentType.id"
                        :label="commonType.id"
                        border>{{commonType.type_name}}</el-radio>
            </div>
            <el-button type="primary"
                       size="small"
                       class="next-btn"
                       :disabled="activeTab!=='type'"
                       @click="validateType">下一步</el-button>
          </el-tab-pane>
          <el-tab-pane label="编辑基本信息"
                       name="basic"
                       :disabled="true">
            <div class="form-section">
              <div class="section-head">基本信息</div>
              <div class="section-body">
                <!-- <div class="item">
                  <div class="item-label">商品分组：</div>
                  <div class="item-body">
                    <el-select v-model="goodsCommon.groupId" size="small" placeholder="请选择分组">
                      <el-option v-for="item in groups" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
                    </el-select>
                    <div class="btn-group">
                      <el-button type="text">刷新</el-button>
                      <el-button type="text">新建分组</el-button>

                      <el-button type="text">帮助</el-button>
                    </div>
                  </div>
                </div>-->
                <el-form :model="goodsCommon"
                         :rules="goodsCommonRules"
                         ref="goodsCommonForm"
                         label-width="100px">
                  <el-form-item label="商品类别：">
                    <span>{{parentType.name}}</span>
                  </el-form-item>
                  <el-form-item label="详细类别："
                                prop="typeId">
                    <el-select v-model="goodsCommon.typeId"
                               size="small"
                               placeholder="请选择类别">
                      <el-option v-for="(item,index) in subTypes"
                                 :key="index"
                                 :label="item.type_name"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="商品品牌："
                                prop="grandId">
                    <el-select v-model="goodsCommon.grandId"
                               size="small"
                               placeholder="请选择品牌">
                      <el-option v-for="item in grands"
                                 :key="item.id"
                                 :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                    <el-button type="text"
                               @click="getGrands">刷新</el-button>
                    <!-- <el-button type="text">新建品牌</el-button> -->
                  </el-form-item>
                  <el-form-item label="商品名称："
                                prop="name">
                    <el-input size="small"
                              class="select-input"
                              v-model.trim="goodsCommon.name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品描述："
                                prop="description">
                    <el-input placeholder="描述不可超过1000字"
                              class="select-input"
                              size="small"
                              v-model.trim="goodsCommon.description"
                              maxlength="1000"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="运费设置：" prop="transformFeeLabel">
                    <el-input class="select-input" size="small" v-model.trim="goodsCommon.transformFeeLabel"></el-input>
                  </el-form-item>-->
                </el-form>
                <div class="item">
                  <div class="item-label validator">商品图片：</div>
                  <div class="item-body">
                    <image-upload uploaderMode="upload"
                                  name="icon"
                                  :externalPreviewImages="storeImg"
                                  :limit="6"
                                  accept="image/*"
                                  ref="imageUploader"
                                  :uploadUrl="$IMGHOST+'upload'"
                                  :multiple="true"
                                  :success="createGoods"
                                  width="100px"
                                  height="100px"></image-upload>
                  </div>
                </div>
                <div class="item">
                  <div class="item-label validator">详情图片：</div>
                  <div class="item-body">
                    <image-upload uploaderMode="upload"
                                  name="icons"
                                  :externalPreviewImages="infoStore"
                                  :limit="20"
                                  accept="image/*"
                                  ref="imageinfoUpload"
                                  :uploadUrl="$IMGHOST+'upload'"
                                  :multiple="true"
                                  :success="saveImg"
                                  width="100px"
                                  height="100px"></image-upload>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section">
              <div class="section-head">库存/规格</div>
              <div class="section-body">
                <div class="item">
                  <div class="item-label">商品规格：</div>
                  <div class="item-body">
                    <div class="formats">
                      <div class="select-attr">
                        <el-select v-model="tempAttr"
                                   size="small"
                                   placeholder="规格"
                                   value-key="id">
                          <el-option v-for="goodAttr in goodAttrs"
                                     :key="goodAttr.id"
                                     :label="goodAttr.name"
                                     :value="goodAttr"></el-option>
                        </el-select>
                        <el-button @click="addPredictAttr"
                                   size="small"
                                   style="margin-left:20px">添加</el-button>
                      </div>
                      <ul>
                        <li class="predict-attr"
                            v-for="(predictAttr,index) in predictAttrs"
                            :key="index">
                          <div class="predict-attr-head">
                            <label>{{predictAttr.name}}</label>
                            <span @click="removeArrItem(predictAttrs, index)"
                                  class="danger-text-btn"
                                  type="text">删除</span>
                          </div>
                          <ul class="attr-list">
                            <li v-for="(innerAttr,innerIndex) in predictAttr.innerAttrs"
                                class="attr"
                                :key="innerIndex">
                              <el-input class="label-input"
                                        size="small"
                                        v-model.trim="innerAttr.value"></el-input>

                            </li>
                            <i class="el-icon-remove icon-btn danger"
                               @click="removeArrItem(predictAttr.innerAttrs,innerIndex)"></i>
                            <i class="el-icon-circle-plus icon-btn primary"
                               @click="addInnerAttr(predictAttr)"></i>
                          </ul>
                        </li>
                      </ul>
                      <el-button size="small"
                                 style="margin-top: 10px;"
                                 @click="generatePredictGoods">确认规格</el-button>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="item-label">详细商品：</div>
                  <div class="item-body no-flex">
                    <el-table :data="predictGoods"
                              :span-method="mergeAttrColumn"
                              style="max-width:800px;"
                              :header-cell-style="{background:'#E8EAEE',height:'48px',}"
                              class="disScoll">
                      <el-table-column align="center"
                                       v-for="attr in this.predictAttrs"
                                       :prop="'attr_'+attr.id"
                                       :label="attr.name"
                                       :key="attr.id"></el-table-column>
                      <el-table-column align="center"
                                       prop="canCellSize"
                                       label="可售库存"
                                       max-width="150">
                        <template slot-scope="scope">
                          <el-input class="sm-input"
                                    size="small"
                                    v-model.trim="scope.row.canSellSize"
                                    @input="numInput(scope.row)"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       prop="canCellSize"
                                       label="库存"
                                       max-width="150">
                        <template slot-scope="scope">
                          <el-input @input="numInput2(scope.row)"
                                    class="sm-input"
                                    size="small"
                                    v-model.trim="scope.row.size"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       prop="price"
                                       label="价格"
                                       max-width="150">
                        <template slot-scope="scope">
                          <el-input class="sm-input"
                                    size="small"
                                    @input="checknum(scope.row)"
                                    v-model.trim="scope.row.priceLabel"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       prop="procurementPrice"
                                       label="成本"
                                       max-width="150">
                        <template slot-scope="scope">
                          <el-input class="sm-input"
                                    size="small"
                                    @input="checknum2(scope.row)"
                                    v-model.trim="scope.row.procurementPriceLabel"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column align="center"
                                       prop="weight"
                                       label="单品重量(kg)"
                                       max-width="150">
                        <template slot-scope="scope">
                          <el-input class="sm-input"
                                    size="small"
                                    @input="checkWeight(scope.row)"
                                    v-model.trim="scope.row.weight"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-section">
              <div class="section-head">物流/其他</div>
              <div class="section-body">
                <div class="item">
                  <div class="item-label">配送方式：</div>
                  <div class="item-body"
                       style="line-height: 41px;">
                    <el-radio v-model="logisticsType"
                              label="1">物流配送</el-radio>
                    <el-radio v-model="logisticsType"
                              label="2">支持自提</el-radio>
                    <el-radio v-model="logisticsType"
                              label="3">物流+自提</el-radio>
                  </div>
                </div>
              </div>
            </div>
            <el-button @click="resetForms"
                       size="small">返回</el-button>
            <el-button @click="validateBasic"
                       type="primary"
                       :loading="saving">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>
<script>
import imageUpload from '../custom-componets/ImageUpload'
import { validateInteger, validatePrice } from '../../assets/utils'

export default {
  components: { imageUpload },
  data() {
    return {
      logisticsType: '3',
      storeImg: [],
      infoStore: [],
      addStatus: 0,
      activeTab: 'type',
      commonTypes: [],
      subTypes: [],
      groups: [],
      grands: [],
      goodAttrs: [],
      parentType: {
        id: '',
        name: '',
      },
      initGoodsCommon: {
        id: -1,
        typeId: '',
        grandId: '',
        name: '',
        description: '',
        transformFee: '',
        transformFeeLabel: 0,
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',
        pic5: '',
        pic6: '',
        groupId: '',
        logisticsType: '3',
      },
      goodsCommon: Object.assign({}, this.initGoodsCommon),
      goodsCommonRules: {
        name: { required: true, message: '请填写名称' },
        typeId: { required: true, message: '请选择详细类别' },
        grandId: { required: true, message: '请选择品牌' },
        transformFeeLabel: {
          required: false,
          validator: validateInteger,
          enableZero: true,
        },
      },
      initGoods: {
        price: 0,
        priceLabel: 0,
        procurementPrice: 0,
        procurementPriceLabel: 0,
        size: 0,
        weight: 0,
        goods2attrsBeans: [
          {
            attrsId: 1,
            value: '假规格',
            pic: 'noimage',
          },
        ],
      },
      goodTemplate: {
        price: 0,
        priceLabel: 0,
        procurementPrice: 0,
        procurementPriceLabel: 0,
        canSellSize: 0,
        size: 0,
        weight: 0,
      },
      goods: [],
      predictTableHead: [{ id: 1, name: 'women' }],
      predictGoods: [],
      preparedGoods: [],
      goodsRules: {
        priceLabel: {
          validator: validatePrice,
          firstMessage: '请输入价格',
          required: true,
        },
        procurementPriceLabel: {
          validator: validatePrice,
          firstMessage: '请输入成本',
          required: true,
        },
        size: {
          validator: validateInteger,
          firstMessage: '请输入库存',
          required: true,
        },
      },
      attrImgEnable: false,
      mainPicPreview: null,
      //        goodsPics: [],
      uploadImageNum: 0,
      imageUploadResults: [],
      attrGoods: [],
      predictAttrs: [],
      saving: false,
      replaceImageIndex: '',
      goodsTableHeaders: [],
      tempAttr: {},
    }
  },
  mounted() {
    this.getCommonTypes()
    this.getGroups()
    this.getGrands()
  },
  methods: {
    /* 获取必须信息 */
    getCommonTypes() {
      this.$http
        .ajax({
          url: APIHOST + 'api/goodsType/getTypes/0',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.commonTypes = res.object
          } else {
            console.error('获取商品分类失败')
          }
        })
        .fail(() => {
          console.log('获取商品分类接口出错')
        })
    },
    getSubTypes() {
      this.$http
        .ajax({
          url: APIHOST + 'api/goodsType/getTypes/' + this.parentType.id,
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.subTypes = res.object
          } else {
            console.error('获取商品分类失败')
          }
        })
        .fail(() => {
          console.log('获取商品分类接口出错')
        })
    },
    getGrands() {
      this.$http
        .ajax({
          url: APIHOST + 'api/grand/getAll',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.grands = res.object
          } else {
            console.error('获取品牌失败')
          }
        })
        .fail(() => {
          console.log('获取商品品牌接口出错')
        })
    },
    getGroups() {
      this.$http
        .ajax({
          url: APIHOST + 'api/store/getGroup',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.groups = res.list
          } else {
            console.error('获取商品分组失败')
          }
        })
        .fail(() => {
          console.log('获取商品分组接口出错')
        })
    },
    removeArrItem(arr, index) {
      arr.splice(index, 1)
    },
    addPredictAttr() {
      if (!this.tempAttr.id) {
        this.$message.info('请先选择规格')
        return
      }
      for (const attr of this.predictAttrs) {
        if (this.tempAttr.id === attr.id) {
          this.$message.info('不能重复添加规格')
          return
        }
      }
      this.predictAttrs.push({
        id: this.tempAttr.id,
        name: this.tempAttr.name,
        innerAttrs: [{ value: '未命名' }],
      })
    },
    addInnerAttr(predictAttr) {
      predictAttr.innerAttrs.push({ value: '未命名' })
    },
    addAttr() {},
    generatePredictGoods() {
      const tempGoods = []
      var flag = false
      var flag2 = false
      this.predictAttrs.forEach((attr, index, arr) => {
        let childArr = []

        for (let i = 0; i < attr.innerAttrs.length; i++) {
          if (
            childArr.find((e) => {
              return e.value === attr.innerAttrs[i].value ? true : false
            })
          ) {
            flag = true
            // this.$message.error("规格有重复值");
            childArr = []
            return
            break
          } else if (!attr.innerAttrs[i].value) {
            childArr = []
            flag2 = true
            return false
            break
          } else {
            childArr.push(attr.innerAttrs[i])
          }
        }
        let goods = []
        if (index > 0) {
          // 遍历已复制属性的商品
          for (const preGood of tempGoods[index - 1]) {
            for (const innerAttr of attr.innerAttrs) {
              // if(innerAttr.value){
              // }
              goods.push(
                Object.assign({}, preGood, {
                  // es6语法定义属性
                  ['attr_' + attr.id]: innerAttr.value,
                })
              )
            }
          }
        } else {
          for (const innerAttr of attr.innerAttrs) {
            // 从good模板对象建立good对象
            goods.push(
              Object.assign({}, this.goodTemplate, {
                // es6语法定义属性
                ['attr_' + attr.id]: innerAttr.value,
              })
            )
          }
        }
        tempGoods[index] = goods
      })
      if (flag) {
        this.$message.error('规格有重复值')
        return false
      }
      if (flag2) {
        this.$message.error('规格有空值')
        return false
      }

      this.predictGoods = tempGoods[tempGoods.length - 1]
    },
    removePredictGood(index) {
      this.predictGoods.splice(index, 1)
    },
    mergeAttrColumn({ row, column, rowIndex, columnIndex }) {},
    getAttrs() {
      this.$http
        .ajax({
          url: APIHOST + 'api/Attrs/getByType/' + this.parentType.id,
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.goodAttrs = res.object
          } else {
            console.error('获取商品属性失败')
          }
        })
        .fail(() => {
          console.log('获取商品属性接口出错  ')
        })
    },
    /* 逻辑函数 */
    resetForms() {
      this.parentType = { id: '', name: '' }
      this.goodsCommon = Object.assign({}, this.initGoodsCommon)
      this.$refs['goodsCommonForm'].resetFields()
      this.preparedGoods = []
      this.predictGoods = []
      this.predictAttrs = []
      this.tempAttr = {}
      // this.$refs['goodsForm'].resetFields()
      this.activeTab = 'type'
      this.addStatus = 0
    },
    validateType() {
      if (this.parentType.id) {
        for (let type of this.commonTypes) {
          if (type.id === this.parentType.id) {
            this.parentType.name = type.type_name
          }
        }
        this.getSubTypes()
        this.getAttrs()
        this.activeTab = 'basic'
        this.addStatus = 1
      } else {
        this.$message.error('请选择商品类别')
      }
    },
    validateNum(val) {
      if (val === '') {
        return false
      }
      if (isNaN(Number(val))) {
        return false
      }
      if (val < 0) {
        return false
      }
      return true
    },
    validatePredictGoods() {
      if (!this.predictGoods.length) {
        this.$message.error('请填写商品规格')
        return false
      }
      for (const goods of this.predictGoods) {
        if (
          !(
            this.validateNum(goods.priceLabel) &&
            this.validateNum(goods.procurementPriceLabel) &&
            this.validateNum(goods.size) &&
            this.validateNum(goods.weight)
          )
        ) {
          this.$message.error('商品详细数据填写错误')
          return false
        }
      }
      return true
    },
    validateBasic() {
      this.$refs['goodsCommonForm'].validate((valid) => {
        if (!valid) {
          this.$message.error('必填项没有完善')
          return
        } else if (!this.$refs['imageUploader'].files) {
          this.$message.error('请至少添加一个图片')
          return
        } else if (!this.$refs['imageinfoUpload'].files) {
          this.$message.error('请至少添加一个图片')
          return
        } else if (!this.validatePredictGoods()) {
          return
        } else {
          // this.$refs["imageUploader"].upload();
          this.$refs['imageinfoUpload'].upload()
          this.prepareGoods()
        }
      })
    },
    prepareGoods() {
      this.preparedGoods = this.predictGoods.map((good) => {
        let attrs = []
        for (const key in good) {
          if (good.hasOwnProperty(key) && key.startsWith('attr')) {
            attrs.push({
              attrsId: key.split('_')[1],
              value: good[key],
            })
          }
        }
        good.price = good.priceLabel * 100
        good.procurementPrice = good.procurementPriceLabel * 100
        good.weight = good.weight * 1000
        good.goods2attrsBeans = attrs
        return good
      })
    },
    finishAdd() {},
    createGoods(res) {
      for (let i = 0; i < res.length; i++) {
        this.goodsCommon['pic' + (i + 1)] = res[i]
      }
      this.goodsCommon.transformFee = this.goodsCommon.transformFeeLabel * 1
      this.goodsCommon.logisticsType = this.logisticsType
      this.saving = true
      this.$http
        .ajax({
          url: APIHOST + 'api/goods/add',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({
            goodsCommon: this.goodsCommon,
            goods: this.preparedGoods,
          }),
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.$message({ message: '保存成功', type: 'success' })
            this.resetForms()
            // this.$refs["imageUploader"].reset();
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
        .fail(() => {
          console.log('商品添加接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
    saveImg(res) {
      let imageData = ''
      let imgSure = []
      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          if (i != res.length - 1) {
            imageData += res[i] + ','
          } else {
            imageData += res[i]
          }
        }
      }
      imgSure = imageData.split('.')
      this.goodsCommon.detail = imageData
      this.$refs['imageUploader'].upload()
    },

    numInput(value) {
      //如果输入非数字，则替换为''
      value.canSellSize = value.canSellSize.replace(/[^\d]/g, '')
      //必须保证第一个为数字而不是.
      value.canSellSize = value.canSellSize.replace(/^/g, '')
      //前两位不能是0加数字
      value.canSellSize = value.canSellSize.replace(/^0\d[0-9]*/g, '')
    },
    numInput2(value) {
      //如果输入非数字，则替换为''
      value.size = value.size.replace(/[^\d]/g, '')
      //必须保证第一个为数字而不是.
      value.size = value.size.replace(/^/g, '')
      //前两位不能是0加数字
      value.size = value.size.replace(/^0\d[0-9]*/g, '')
    },
    checknum(value) {
      //如果输入非数字，则替换为''
      value.priceLabel = value.priceLabel.replace(/[^\d\.]/g, '')
      //必须保证第一个为数字而不是.
      value.priceLabel = value.priceLabel.replace(/^\./g, '')
      //前两位不能是0加数字
      value.priceLabel = value.priceLabel.replace(/^0\d[0-9]*/g, '')
      //保证只有出现一个.而没有多个.
      value.priceLabel = value.priceLabel.replace(/\.{2,}/g, '.')
      //保证.只出现一次，而不能出现两次以上
      value.priceLabel = value.priceLabel.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两位小数
      value.priceLabel = value.priceLabel.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    checknum2(value) {
      console.log(value)
      //如果输入非数字，则替换为''
      value.procurementPriceLabel = value.procurementPriceLabel.replace(/[^\d\.]/g, '')
      //必须保证第一个为数字而不是.
      value.procurementPriceLabel = value.procurementPriceLabel.replace(/^\./g, '')
      //前两位不能是0加数字
      value.procurementPriceLabel = value.procurementPriceLabel.replace(/^0\d[0-9]*/g, '')
      //保证只有出现一个.而没有多个.
      value.procurementPriceLabel = value.procurementPriceLabel.replace(/\.{2,}/g, '.')
      //保证.只出现一次，而不能出现两次以上
      value.procurementPriceLabel = value.procurementPriceLabel.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两位小数
      value.procurementPriceLabel = value.procurementPriceLabel.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },

    checkWeight(value) {
      //如果输入非数字，则替换为''
      value.weight = value.weight.replace(/[^\d\.]/g, '')
      //必须保证第一个为数字而不是.
      value.weight = value.weight.replace(/^\./g, '')
      //前两位不能是0加数字
      value.weight = value.weight.replace(/^0\d[0-9]*/g, '')
      //保证只有出现一个.而没有多个.
      value.weight = value.weight.replace(/\.{2,}/g, '.')
      //保证.只出现一次，而不能出现两次以上
      value.weight = value.weight.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两位小数
      value.weight = value.weight.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
  },
}
</script>
<style scoped>
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
.goods-info .el-radio {
  margin-right: 20px;
  margin-bottom: 15px;
}
.btn-group .el-button {
  margin: 0;
}

.btn-group .el-button:not(:last-child):after {
  content: '';
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
  display: flex;
  text-align: left;
}

.form-section .section-head {
  width: 200px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  text-align: right;
}

.form-section .section-body {
  padding: 30px 20px;
}

.item {
  display: flex;
  font-size: 14px;
  color: #5a5e66;
  margin-top: 30px;
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
  width: 800px;
}
.label-input {
  width: 100px;
}
.icon-btn {
  font-size: 20px;
  cursor: pointer;
  padding-right: 10px;
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
  position: relative;
  padding: 5px;
  /* width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center; */
}
.danger-text-btn {
  position: absolute;
  left: 264px;
  cursor: pointer;
}
.select-attr .el-input {
  width: 100%;
}
.error-input .el-input__inner {
  border-color: #f56c6c;
}
.item-kg {
  width: 200px;
}
</style>
<style>
.disScoll .el-table__body-wrapper {
  overflow: auto !important;
}
</style>
