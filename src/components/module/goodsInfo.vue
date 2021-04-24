<template>
  <div>
    <div class="content">
      <div class="row goods-row">
        <el-button class="f-left"
                   @click="$router.push('/api/goods')">返回</el-button>
        <el-button v-if="pageAction ==='info'"
                   class="f-left"
                   @click="$router.push('edit')">
          <i class="el-icon-edit"></i>编辑
        </el-button>
        <el-button v-if="pageAction === 'edit'"
                   class="f-left"
                   @click="updateGoods">
          <i class="el-icon-bottom"></i>保存
        </el-button>
      </div>
      <div class="form-section">
        <div class="section-head">基本信息</div>
        <div class="section-body">
          <el-form :model="infoGood"
                   ref="goodsCommonForm"
                   label-width="100px">
            <el-form-item label="详细类别："
                          prop="typeId">
              <span v-if="pageAction === 'info'">{{type}}</span>
              <el-radio-group v-else
                              v-model="categoryTypeId"
                              @change="categorychange(categoryTypeId)">
                <el-radio class="is-bordered"
                          v-for="item in categoryType"
                          :label="item.id"
                          :key="item.id"
                          :value="item.id">
                  {{item.typeName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品品牌："
                          prop="grandId">
              <span v-if="pageAction === 'info'">{{grandId.name}}</span>
              <el-select v-else
                         v-model.trim="grandId.id"
                         size="mini"
                         placeholder="请选择品牌">
                <el-option v-for="(item,index) in grands"
                           :key="index"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称："
                          prop="name">
              <span v-if="pageAction === 'info'">{{infoGood.name}}</span>
              <el-input disabled
                        v-else
                        size="mini"
                        class="select-input"
                        v-model.trim="infoGood.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述："
                          prop="description">
              <span v-if="pageAction === 'info'">{{infoGood.description}}</span>
              <el-input v-else
                        class="select-input"
                        size="mini"
                        v-model.trim="infoGood.description"></el-input>
            </el-form-item>
          </el-form>
          <div class="item">
            <div class="item-label">商品图片：</div>
            <div class="item-body">
              <image-upload :externalPreviewImages="goodImgs"
                            :uploaderMode="pageAction === 'info'?'viewImg':'replace'"
                            :limit="6"
                            name="icon"
                            accept="image/*"
                            ref="imageUploader"
                            :uploadUrl="$IMGHOST+'upload'"
                            :multiple="true"
                            :success="saveGoods"
                            width="100px"
                            height="100px"></image-upload>
            </div>
          </div>
          <div class="item">
            <div class="item-label">详情图片：</div>
            <div class="item-body">
              <image-upload :externalPreviewImages="infoStore"
                            :uploaderMode="pageAction === 'info'?'viewImg':'replace'"
                            :limit="20"
                            name="icons"
                            ref="imageInfoUploader"
                            accept="image/*"
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
        <div class="section-body"
             v-if="pageAction ==='edit'">
          <div class="item">
            <div class="item-label">商品规格：</div>
            <div class="item-body">
              <div class="formats">
                <div class="select-attr">
                  <el-select v-model="tempAttr"
                             size="mini"
                             style="width:100px;"
                             placeholder="规格"
                             value-key="id">
                    <el-option v-for="goodAttr in goodAttrs"
                               :key="goodAttr.id"
                               :label="goodAttr.name"
                               :value="goodAttr"></el-option>
                  </el-select>
                  <!-- <el-button @click="addPredictAttr" size="mini" :disabled="isEmpty">添加</el-button> -->
                  <!-- <el-button v-if="!isEmpty" @click="addPredictAttr" size="mini">添加</el-button> -->
                </div>
                <ul>
                  <li class="predict-attr"
                      v-for="(predictAttr,index) in predictAttrs"
                      :key="index">
                    <div class="predict-attr-head">
                      <label>{{predictAttr.name}}</label>
                      <!-- <el-button
                              @click="removeArrItem(predictAttrs, index)"
                              class="danger-text-btn"
                              type="text"
                      >删除</el-button>-->
                    </div>
                    <ul class="attr-list">
                      <li v-for="(innerAttr,innerIndex) in predictAttr.innerAttrs"
                          class="attr"
                          :key="innerIndex">
                        <el-input class="label-input"
                                  size="mini"
                                  v-model.trim="innerAttr.value"
                                  @blur="getchangeInput(innerAttr)"></el-input>
                        <i v-if="innerAttr.oldvalue"
                           class="el-icon-remove icon-btn danger"
                           @click="removeArrItem(predictAttr.innerAttrs,innerIndex)"></i>
                      </li>
                      <i class="el-icon-circle-plus icon-btn primary"
                         @click="addInnerAttr(predictAttr)"></i>
                    </ul>
                  </li>
                </ul>
                <el-button size="mini"
                           @click="generatePredictGoods">确认规格</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-label">详细商品：</div>
          <div class="item-body no-flex">
            <el-table :data="attrGoods"
                      style="width:900px;"
                      :header-cell-style="{background:'#E8EAEE',height:'48px',}"
                      :row-class-name="tableRowRed">
              <!-- <el-table-column align="center" prop="zhanshi" label="规格"></el-table-column> -->
              <el-table-column align="center"
                               v-for="attr in this.predictAttrs"
                               :prop="'attr_'+ attr.id"
                               :label="attr.name"
                               :key="attr.id"
                               show-overflow-tooltip></el-table-column>
              <el-table-column align="center"
                               prop="sellSize"
                               label="已售"></el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="canSellSize"
                               label="可售库存">
                <template slot-scope="scope">
                  <span v-if="pageAction ==='info'">{{scope.row.canSellSize}}</span>
                  <el-input v-else
                            class="sm-input"
                            size="mini"
                            v-model.trim="scope.row.canSellSize"
                            name="myInput"
                            required
                            @input="numInput(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="size"
                               label="库存">
                <template slot-scope="scope">
                  <span v-if="pageAction ==='info'">{{scope.row.size}}</span>
                  <el-input v-else
                            class="sm-input"
                            size="mini"
                            v-model.trim="scope.row.size"
                            required
                            @input="numInput2(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="price"
                               label="价格(元)">
                <template slot-scope="scope">
                  <span v-if="pageAction ==='info'">{{pennyToDollar(scope.row.price)}}</span>
                  <el-input v-else
                            class="sm-input"
                            size="mini"
                            v-model.trim="scope.row.priceLabel"
                            required
                            @input="checknum(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="procurementPrice"
                               label="成本(元)">
                <template slot-scope="scope">
                  <span v-if="pageAction ==='info'">{{scope.row.procurementPrice}}</span>
                  <el-input v-else
                            class="sm-input"
                            size="mini"
                            v-model.trim="scope.row.procurementPrice"
                            required
                            @input="checknum2(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="weight"
                               label="单品重量(kg)">
                <template slot-scope="scope">
                  <span v-if="pageAction ==='info'">{{scope.row.weight}}</span>
                  <el-input v-else
                            class="sm-input"
                            size="mini"
                            v-model.trim="scope.row.weight"
                            required
                            @input="checknum2(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="100"
                               prop="state"
                               label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state ==1?'已上架':'已下架'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center"
                               min-width="120"
                               prop="state"
                               label="操作"
                               v-if="pageAction ==='edit'">
                <template slot-scope="scope">
                  <el-button type="text"
                             @click="isFrame(scope.row)">{{scope.row.state ==1 ? '下架' : '上架'}}</el-button>
                  <!-- <el-button  type="text" @click="isDelete(scope.row)">删除</el-button> -->
                  <!-- <el-button type="text" v-if="!scope.row.id" @click="removePredictGood(scope.$index)">移除</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="section-head">物流</div>
        <div class="section-body">
          <div class="item">
            <div class="item-label">配送方式：</div>
            <div class="item-body"
                 style="line-height: 41px;">
              <el-radio :disabled="pageAction ==='info'"
                        v-model="infoGood.logisticsType"
                        label="1">物流配送</el-radio>
              <el-radio :disabled="pageAction ==='info'"
                        v-model="infoGood.logisticsType"
                        label="2">支持自提</el-radio>
              <el-radio :disabled="pageAction ==='info'"
                        v-model="infoGood.logisticsType"
                        label="3">物流+自提</el-radio>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import imageUpload from '../custom-componets/ImageUpload'
import { pennyToDollar, getWeight } from '../../assets/utils'

export default {
  components: { imageUpload },
  data() {
    return {
      multiple: true,
      weights: '',
      grandId: {},
      grands: [],
      predictAttrs: [],
      tempAttr: {},
      goodAttrs: [],
      imgDatas: [],
      imgSure: [],
      oldGoods: [],
      goodImgType: '',
      pennyToDollar,
      getWeight,
      infoGood: {},
      goodId: 0,
      goodImgs: [],
      infoStore: [],
      attrGoods: [],
      goodsCommonRules: {
        name: { required: true, message: '请填写名称' },
      },
      isFrameDialogVisible: false,
      deleteDialogVisible: false,
      deletNeirong: '',
      rowDelte: '',
      rowDelteTT: '',
      goodTemplate: {
        canSellSize: 0,
        sellSize: 0,
        price: 0,
        priceLabel: 0,
        procurementPrice: 0,
        size: 0,
        id: '',
        state: 1,
        weight: 0,
      },
      changeInputArr: [],
      changeold: [],
      changenew: [],
      goods2attrsBeans: [
        {
          attrsId: 1,
          value: '假规格',
          pic: 'noimage',
        },
      ],
      attrss: [],
      flag: true,
      valueuu: {},
      isEmpty: false,
      Minuslog: false,
      updateGoodsForm: [],
      radioType: '',
      categoryType: [],
      categoryTypeId: [],
      type: '',
    }
  },

  computed: {
    pageAction() {
      let action = this.$route.path.split('/').pop()
      if (action === 'edit') {
      }
      return action
    },
  },

  mounted() {
    this.goodId = this.$route.query.id
    this.getGrands()
    this.getAttrGoods()
    this.changeInputArr = []
    this.getCommonTypes()
  },
  methods: {
    loadImage() {
      const imgs = []
      for (const key in this.infoGood) {
        if (this.infoGood.hasOwnProperty(key) && key.startsWith('pic') && this.infoGood[key] && this.infoGood[key].trim() !== '') {
          imgs.push(this.$GETIMGHOST + this.infoGood[key])
        }
      }
      this.goodImgs = imgs
      if (this.infoGood.detail) {
        this.infoStore = this.infoGood.detail.split(',')
      }
      this.infoStore = this.infoStore.map((item) => {
        return this.$GETIMGHOST + item
      })
    },
    getAttrGoods() {
      this.$http
        .ajax({
          url: APIHOST + 'api/goods/getGoodsInfo/' + this.goodId,
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            let obj = {}
            let person = []
            var innerAttrs = []
            res.object.list.forEach((ele) => {
              ele.priceLabel = ele.price / 100
              ele.procurementPrice = ele.procurementPrice / 100
              ele.weight = ele.weight / 1000
            })
            this.attrGoods = res.object.list
            this.attrGoods.map((item) => {
              this.weights = item
              return item
            })
            this.infoGood = res.object.goodsCommon
            this.infoGood.logisticsType = this.infoGood.logisticsType + ''
            this.grandId = res.object.grand
            res.object.guiGe.forEach((el) => {
              if (person.map((ele) => ele.attrs_id).indexOf(el.attrs_id) === -1) {
                let obj = {
                  value: el.value,
                  id: el.attrs_id,
                  attrs_id: el.attrs_id,
                  name: el.name,
                  innerAttrs: res.object.guiGe.filter((item) => item.attrs_id === el.attrs_id),
                }
                person.push(obj)
              }
            })
            this.categoryType = res.object.type
            this.categoryTypeId = res.object.typeId
            this.infoGood.typeId = this.categoryTypeId
            this.categoryType.filter((el) => {
              if (el.id == this.categoryTypeId) {
                this.type = el.typeName
              }
            })
            this.predictAttrs = Object.assign([], person)
            if (this.attrGoods.length == 0) {
              this.isEmpty = false
            } else {
              this.isEmpty = true
            }
            this.loadImage()
          } else {
            console.error('获取商品分类失败')
          }
        })
        .fail(() => {
          console.log('获取商品分类接口出错')
        })
    },
    updateGoods() {
      this.$refs['goodsCommonForm'].validate((valid) => {
        if (this.$refs['imageUploader'].files.length == 0 && this.goodImgs.length == 0) {
          this.$message.error('请至少添加一个图片')
          return
        }
        if (!this.validatePredictGoods()) {
          return
        }
        // this.saveImg(this.infoGood)
        this.$refs['imageUploader'].upload()
      })
    },
    errorTest(res) {
      console.log(res)
    },
    descRemovehandel(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    saveGoods(res) {
      let keys = Object.keys(this.infoGood)
      let picKeys = keys.filter((o) => {
        return o.length == 4 && o.substring(0, 3) == 'pic'
      })
      for (let index = 0; index < picKeys.length; index++) {
        const element = picKeys[index]
        this.infoGood[element] = ''
      }
      let lastImagePathList = this.getNoHttpImagePath(this.goodImgs)
      let lastImageList = []
      for (let index = 0; index < lastImagePathList.length; index++) {
        const element = lastImagePathList[index]
        this.infoGood['pic' + (index + 1)] = element
        lastImageList.push(element)
      }
      let startImageIndex = lastImagePathList.length
      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          //为空可能是没被替换或商场出错的，保留原值
          this.infoGood['pic' + (startImageIndex + 1)] = res[i]
          startImageIndex++
        }
      }
      this.attrGoods.forEach((good) => {
        good.price = good.priceLabel * 100
        good.procurementPrice = good.procurementPrice * 100
        good.weight = good.weight * 1000
      })
      this.$refs['imageUploader'].reset()
      this.$refs['imageInfoUploader'].upload()
      this.getAttrGoods()
    },
    getNoHttpImagePath(list) {
      let resultList = []
      if (list) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element && element.startsWith('http')) {
            let url = element.replace('http://', '')
            url = url.substring(url.indexOf('/') + 1, url.length)
            resultList.push(url)
          }
        }
      }
      return resultList
    },
    // 商品详情图片
    saveImg(res) {
      console.log(res)
      let imageData = ''
      let lastImagePathList = this.getNoHttpImagePath(this.infoStore)

      for (let index = 0; index < lastImagePathList.length; index++) {
        const element = lastImagePathList[index]
        imageData += element + ','
      }

      for (let i = 0; i < res.length; i++) {
        if (res[i]) {
          imageData += res[i]
          if (i < res.length - 1) {
            imageData += ','
          }
        }
      }
      if (imageData && imageData.endsWith(',')) {
        imageData = imageData.substring(0, imageData.length - 1)
      }
      this.infoGood.detail = imageData
      this.imgSure = imageData.split(',')
      this.attrGoods.forEach((good) => {
        good.price = good.priceLabel * 100
        // good.procurementPrice = good.procurementPrice * 100;
      })
      this.$refs['imageInfoUploader'].reset()
      this.$http
        .ajax({
          url: APIHOST + 'api/goods/update',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({
            goodsCommon: this.infoGood,
            goods: this.attrGoods,
            updateAttrs: this.changeold,
          }),
          context: this,
        })
        .done((res) => {
          this.$message({ message: '保存成功', type: 'success' })
          this.$router.push('info')
          this.getAttrGoods()
        })
        .fail(() => {
          console.log('商品添加接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
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
      arr[index].delete = true
      //有 delete 则表示已删除的input
      this.getchangeInput(arr[index])
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
        innerAttrs: [
          {
            value: '未命名',
            oldvalue: true,
            id: this.tempAttr.id,
          },
        ],
      })

      this.Specifications.push({
        id: this.tempAttr.id,
        name: this.tempAttr.name,
        innerAttrs: [
          {
            value: '未命名',
          },
        ],
      })
    },
    addInnerAttr(predictAttr) {
      let newInput = {
        value: '未命名',
        oldvalue: true,
        id: this.tempAttr.id,
        attrs_id: predictAttr.attrs_id,
        radom: Math.round(Math.random() * 10000),
      }
      predictAttr.innerAttrs.push(newInput)

      this.getchangeInput(newInput)
    },
    getchangeInput(item) {
      //如果有value_id 则是编辑已有的

      if (item.value_id) {
        let index = this.changeInputArr.map((el) => el.value_id).indexOf(item.value_id)
        if (index !== -1) {
          this.changeInputArr.splice(index, 1)
        }
      } else if (item.radom) {
        //如果有radom 则是编辑 新增的
        let index = this.changeInputArr.map((el) => el.radom).indexOf(item.radom)
        if (index !== -1) {
          this.changeInputArr.splice(index, 1)
        }
      }
      this.changeInputArr.push(item)
    },
    generatePredictGoods() {
      const tempGoods = []
      var flag = false
      var flag2 = false
      this.predictAttrs
      this.predictAttrs.forEach((attr, index, arr) => {
        let childArr = []

        for (let i = 0; i < attr.innerAttrs.length; i++) {
          if (
            childArr.find((e) => {
              return e.value === attr.innerAttrs[i].value ? true : false
            })
          ) {
            childArr = []
            flag = true
            // this.$message.error("规格有重复值");
            return false
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
        if (flag) {
          // this.$message.error("规格有重复值")
          return
        }
        let goods = []
        let attrs = []
        if (index > 0) {
          // 遍历已复制属性的商品
          for (const preGood of tempGoods[index - 1]) {
            for (const innerAttr of attr.innerAttrs) {
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
            // if(!innerAttr.value_id){
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

      // this.attrGoods = this.attrGoods.concat(tempGoods[tempGoods.length - 1])
      this.attrGoods.forEach((el) => {
        if (el.goods2attrsBeans) {
          el.valueIds = el.goods2attrsBeans.map((ele) => {
            if (ele.valueId) {
              return ele.valueId
            } else {
              return ele.radom
            }
          })

          el.valueIdsStr = el.valueIds.join(',')
        }
      })
      // console.log(this.attrGoods);

      let temp = []
      // this.changeInputArr.sort((a,b)=>{return a.})
      var arr = tempGoods[tempGoods.length - 1]

      arr.forEach((ele) => {
        ele.valueIds = []
        ele.goods2attrsBeans = []
        for (var key in ele) {
          if (key.indexOf('attr_') !== -1) {
            let attr = this.predictAttrs.filter((el) => el.attrs_id == key.split('_')[1])

            attr[0].innerAttrs.forEach((v) => {
              if (ele[key] === v.value) {
                if (v.value_id) {
                  ele.goods2attrsBeans.push({
                    attrsId: key.split('_')[1],
                    value: ele[key],
                    valueId: v.value_id,
                  })
                } else {
                  ele.goods2attrsBeans.push({
                    attrsId: key.split('_')[1],
                    value: ele[key],
                    valueId: '',
                    radom: v.radom,
                  })
                }
              }
            })
          }
        }
      })

      arr.forEach((el) => {
        if (el.goods2attrsBeans) {
          el.valueIds = el.goods2attrsBeans.map((ele) => {
            if (ele.valueId) {
              return ele.valueId
            } else {
              return ele.radom
            }
          })

          el.valueIdsStr = el.valueIds.join(',')
        }
      })
      var addArr = arr.filter((item) => {
        if (this.attrGoods.filter((el) => el.valueIdsStr === item.valueIdsStr).length === 0) {
          return item
        }
      })
      // return
      // console.log(this.changeInputArr.filter(el=> el.radom && el.doStatus && !el.delete));

      this.attrGoods = this.attrGoods.concat(addArr)

      // return
      this.changeInputArr.forEach((el) => {
        if (el.radom && !el.doStatus && !el.delete) {
          //若有 radom 并且 doStatus 不存在 表示新增的input
          //新增行
          el.doStatus = true
        } else if (el.radom && el.doStatus && !el.delete) {
          //若有 radom 并且 doStatus 存在 表示编辑 新增的input

          this.attrGoods.forEach((ele) => {
            if (ele.valueIds.indexOf(el.radom) !== -1) {
              ele['attr_' + el.attrs_id] = el.value
            }
          })
        } else if (el.value_id && !el.delete) {
          //若有 value_id 表示编辑 以前的input
          this.attrGoods.forEach((ele) => {
            if (ele.valueIds.indexOf(el.value_id) !== -1) {
              ele['attr_' + el.attrs_id] = el.value

              // this.changeold = new Object()
              // this.changeold.el.valueId = el.value_id
              // this.changeold.el.value = el.value
              this.changeold.push({
                ['valueId']: el.value_id,
                ['value']: el.value,
              })
            }
          })
        } else if (el.delete) {
          //若有 delete 表示 删除 了新增的input

          this.attrGoods = this.attrGoods.filter((ele) => {
            return ele.valueIds.indexOf(el.radom) === -1
          })
        }
      })
    },
    modifygoods() {
      this.$http
        .ajax({
          url: APIHOST + '/api/goods/xiuGai',
          contentType: 'application/json; charset=utf-8',
          type: 'post',
          dataType: 'json',
          data: JSON.stringify({
            attrsId: '',
            goodsId: '',
            old: '',
            new: '',
          }),
          context: this,
        })
        .done((res) => {
          if (res.result == 1) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
            // this.getAttrGoods()
          } else {
            this.flag = false
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
        })
        .fail(() => {
          console.log('目标数据保存接口出错')
        })
        .always(() => {
          this.saving = false
        })
    },
    mergeAttrColumn({ row, column, rowIndex, columnIndex }) {},
    tableRowRed(row, rowIndex) {
      if (row.row.state !== 1) {
        return 'red-row'
      }
    },
    removePredictGood(index) {
      this.attrGoods.splice(index, 1)
    },
    getAttrs() {
      this.$http
        .ajax({
          url: APIHOST + 'api/Attrs/getByType/' + this.parentType.id,
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.goodAttrs = res.list
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
      this.parentType = {
        id: '',
        name: '',
      }
      this.goodsCommon = Object.assign({}, this.initGoodsCommon)
      this.$refs['goodsCommonForm'].resetFields()
      this.preparedGoods = []
      this.attrGoods = []
      this.predictAttrs = []
      this.tempAttr = {}
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
      if (!this.attrGoods.length) {
        this.$message.error('请填写商品规格')
        return false
      }
      for (const goods of this.attrGoods) {
        if (
          !(
            this.validateNum(goods.priceLabel) &&
            this.validateNum(goods.canSellSize) &&
            this.validateNum(goods.procurementPrice) &&
            this.validateNum(goods.size)
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
          this.$message.error('基本信息填写错误，请检查')
          return
        }
        if (!this.$refs['imageUploader'].files.length) {
          this.$message.error('请至少添加一个图片')
          return
        }
        if (!this.validatePredictGoods()) {
          return
        }
        this.$refs['imageUploader'].upload()
        this.prepareGoods()
      })
    },
    prepareGoods() {
      this.preparedGoods = this.predictGoods.map((good) => {
        good.price = good.priceLabel * 100
        // good.procurementPrice = good.procurementPrice * 100;
        good.weight = good.weight * 1000
        return good
      })
    },
    finishAdd() {},
    createGoods(res) {
      for (let i = 0; i < res.length; i++) {
        let imageRes = res[i]
        if (imageRes.ret) {
          this.goodsCommon['pic' + (i + 1)] = imageRes.info.md5
        } else {
          this.$message.error('第' + i + '张图片上传失败：' + imageRes.error.message)
          return false
        }
      }
      this.goodsCommon.transformFee = this.goodsCommon.transformFeeLabel * 100
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
            this.$refs['imageUploader'].reset()
          } else {
            this.$message({ message: '保存失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('商品添加接口出错')
        })
        .always(() => {
          this.saving = false
        })
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
      //如果输入非数字，则替换为''
      value.procurementPrice = value.procurementPrice.replace(/[^\d\.]/g, '')
      //必须保证第一个为数字而不是.
      value.procurementPrice = value.procurementPrice.replace(/^\./g, '')
      //前两位不能是0加数字
      value.procurementPrice = value.procurementPrice.replace(/^0\d[0-9]*/g, '')
      //保证只有出现一个.而没有多个.
      value.procurementPrice = value.procurementPrice.replace(/\.{2,}/g, '.')
      //保证.只出现一次，而不能出现两次以上
      value.procurementPrice = value.procurementPrice.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两位小数
      value.procurementPrice = value.procurementPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    },
    // 上下架
    isFrame(row) {
      let title = row.state == 1 ? '下架' : '上架'
      this.$confirm(`是否${title}该规格`, `${title}规格`, {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃修改',
      })
        .then(() => {
          this.$http
            .ajax({
              url: APIHOST + 'api/goods/updateState',
              contentType: 'application/json; charset=utf-8',
              type: 'post',
              dataType: 'json',
              data: JSON.stringify({
                goodsId: row.id,
                state: row.state == 1 ? (row.state = -1) : (row.state = 1),
              }),
              context: this,
            })
            .done((res) => {
              this.$message({
                type: 'info',
                message: '修改成功',
              })
            })
            .fail(() => {})
        })
        .catch((action) => {})
    },
    categorychange(value) {
      this.infoGood.typeId = value
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

.item-body .el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: initial;
  display: none;
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
