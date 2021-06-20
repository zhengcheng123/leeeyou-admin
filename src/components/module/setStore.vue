<template>
  <div>
    <div class="setStore_city">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="fa fa-user-circle-o"
               aria-hidden="true"></i>
            运费设置
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <div class="form-section">
          <div class="section-head">
            地址信息
            <div class="button-address">
              <el-button v-if="logisticsCompanyForm"
                         type="text"
                         @click="logisticsCompanyForm = null">
                <i class="el-icon-close"></i>
                取消
              </el-button>
              <el-button type="text"
                         v-else
                         @click="addLogisticsCompanyItem">
                <i class="el-icon-circle-plus-outline"></i>新增
              </el-button>
            </div>
          </div>
          <div class="section-body">
            <div class="section-set">
              <div v-for="company in logisticsCompanies"
                   class="logistics-row">
                <!-- <span v-if="company.type===1">发货地址</span> -->
                <div v-if="company.type===1">
                  物流公司：
                  <el-input v-if="company.hasEdit"
                            v-model="company.name"></el-input>
                  <p class="edit-p"
                     v-else>{{company.name}}</p>
                </div>
                <div v-if="company.type===1">
                  发货地址：
                  <el-input v-if="company.hasEdit"
                            v-model="company.address"></el-input>
                  <p class="edit-p"
                     v-else>{{company.address}}</p>
                </div>
                <!-- <span v-if="company.type===0">退货地址</span> -->
                <div v-if="company.type===0">
                  物流公司：
                  <el-input v-if="company.hasEdit"
                            v-model="company.name"></el-input>
                  <p class="edit-p"
                     v-else>{{company.name}}</p>
                </div>
                <div v-if="company.type===0">
                  退货地址：
                  <el-input v-if="company.hasEdit"
                            v-model="company.address"></el-input>
                  <p class="edit-p"
                     v-else>{{company.address}}</p>
                </div>
                <!-- <span v-if="company.type===2"> 自提地址</span> -->
                <div v-if="company.type===2">
                  自提地址：
                  <el-input v-if="company.hasEdit"
                            v-model="company.address"></el-input>
                  <p class="edit-p"
                     v-else>{{company.address}}</p>
                </div>
                <div :offset="1">
                  联系人：
                  <el-input v-if="company.hasEdit"
                            v-model="company.contactsName"></el-input>
                  <p class="edit-p"
                     v-else>{{company.contactsName}}</p>
                </div>
                <div :offset="1">
                  联系方式：
                  <el-input v-if="company.hasEdit"
                            v-model="company.contactsMobile"></el-input>
                  <p class="edit-p"
                     v-else>{{company.contactsMobile}}</p>
                </div>
                <div class="button-eid">
                  <el-button @click="editSet(company)"
                             class="button-ico"
                             type="primary">编辑</el-button>
                  <el-button @click="savesetStore(company)"
                             class="button-ico"
                             type="primary">保存</el-button>
                  <el-button v-if="company.type===2"
                             icon="el-icon-delete"
                             size="mini"
                             type="danger"
                             class="button-ico"
                             plain
                             @click="deleteLogisticsCompany(company.id)"></el-button>
                </div>
              </div>
            </div>
            <el-form v-if="logisticsCompanyForm"
                     ref="logisticsCompanyForm"
                     :inline="true"
                     :rules="logisticsCompanyRules"
                     :model="logisticsCompanyForm"
                     class="demo-form-inline">
              <!-- <el-form-item label="类型选择" prop="type">
                <el-select v-model="logisticsCompanyForm.type" size="small">
                  <el-option
                    v-for="item in logisticsTypes"
                    :value="item.id"
                    :key="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item v-if="logisticsCompanyForm.type===1"
                            label="物流公司"
                            prop="name">
                <el-input size="small"
                          v-model.trim="logisticsCompanyForm.name"></el-input>
              </el-form-item>
              <el-form-item v-if="logisticsCompanyForm.type===1"
                            label="出货地址"
                            prop="name">
                <el-input size="small"
                          v-model.trim="logisticsCompanyForm.address"></el-input>
              </el-form-item>
              <el-form-item label="自提地址"
                            prop="address">
                <el-input size="small"
                          v-model.trim="logisticsCompanyForm.address"></el-input>
              </el-form-item>
              <el-form-item label="联系人"
                            prop="contactsName">
                <el-input size="small"
                          v-model.trim="logisticsCompanyForm.contactsName"></el-input>
              </el-form-item>
              <el-form-item label="联系方式"
                            prop="contactsMobile">
                <el-input size="small"
                          v-model.trim="logisticsCompanyForm.contactsMobile"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small"
                           type="primary"
                           @click="addLogisticsCompany">添加</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-section">
          <div class="section-head">运费设置</div>
          <section class="section"
                   style="background:#fff">
            <el-table :data="tableData"
                      border
                      style="width: 100%"
                      :header-cell-style="{background:'#E8EAEE',height:'48px',}">
              <el-table-column prop="address"
                               :title="address"
                               min-width="190"
                               label="收货地"
                               align="center">
                <template slot-scope="scope">
                  <div style="cursor:pointer"
                       class="popover-father">
                    <span v-if="scope.$index===0"
                          v-html="'默认运费'"></span>
                    <div v-else>
                      <el-popover :disabled="!scope.row.addresses.length"
                                  placement="top-start"
                                  width="400"
                                  trigger="hover"
                                  :content="scope.row.addresses.map(e=>{return e.address}).join('，')">
                        <span slot="reference"
                              style="display:block; color:#eb8600"
                              v-if="!isEditObj[scope.$index][`edit${scope.$index}`]"
                              @click="editPlace(scope.row,scope.$index)">编辑</span>
                        <span style="display:block"
                              slot="reference"
                              v-if="!scope.row.hasAddressEdit ">{{scope.row.addresses.map(e=>{return e.address}).join('，')}}</span>
                      </el-popover>

                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="firstWeight"
                               label="首重(kg)"
                               min-width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.firstWeight"
                            @keyup.native="checkNumber(scope.row,'firstWeight')"
                            :disabled="isEditObj[scope.$index][`edit${scope.$index}`]"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="firstPrice"
                               label="首重运费（元）"
                               min-width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.firstPrice"
                            @keyup.native="checkNumber(scope.row,'firstPrice')"
                            :disabled="isEditObj[scope.$index][`edit${scope.$index}`]"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="secondWeight"
                               label="续重（kg）"
                               min-width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input @keyup.native="checkNumber(scope.row,'secondWeight')"
                            v-model="scope.row.secondWeight"
                            :disabled="isEditObj[scope.$index][`edit${scope.$index}`]"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="secondPrice"
                               label="续重运费（元）"
                               min-width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input @keyup.native="checkNumber(scope.row,'secondPrice')"
                            v-model="scope.row.secondPrice"
                            :disabled="isEditObj[scope.$index][`edit${scope.$index}`]"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="freePrice"
                               label="包邮条件(满多少元包邮)"
                               min-width="150"
                               align="center">
                <template slot-scope="scope">
                  <el-input @keyup.native="checkNumber(scope.row,'freePrice')"
                            v-model="scope.row.freePrice"
                            :disabled="isEditObj[scope.$index][`edit${scope.$index}`]"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作"
                               min-width="190"
                               align="center">
                <template slot-scope="props">
                  <div class="btn-group">
                    <el-button class="age-btn"
                               @click="editUserInfo(props.row,props.$index)"
                               type="text">编辑</el-button>
                    <el-button class="age-btn"
                               type="text"
                               @click="saveTable(props.row,props.$index)">保存</el-button>
                    <el-button class="age-btn"
                               type="text"
                               v-if="!props.row.def"
                               @click="detailForm(props.row,props.$index)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="row">
              <el-form :inline="true">
                <el-form-item>
                  <el-button type="primary"
                             @click="addStore()"
                             class="f-left">添加规则</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 分页器 -->
            <!-- <footer>
            <el-pagination
              class="pagination"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="params.page.pageNum"
              :page-sizes="[15,30,50,100]"
              :page-size.sync="params.page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
            </footer>-->
          </section>
        </div>
      </div>
      <!-- 编辑地区 -->
      <el-dialog title="编辑"
                 width="800px"
                 :visible.sync="dialogVisible"
                 size="tiny"
                 custom-class="goods-dialog"
                 class="body-city"
                 @close="resetForm">
        <div v-for="(city,index) in cityDatas"
             :key="index">
          <div class="city-children">
            <el-checkbox :disabled="city.disabled"
                         :indeterminate="city.indeterminate"
                         v-model="city.provinceSelectAll"
                         @change="(val)=>handleCheckAllChange(val,city)">{{city.province}}</el-checkbox>
          </div>
          <div class="city-children2">
            <el-checkbox-group v-model="checkedCities"
                               @change="(val)=>{return handleCheckedCitiesChange(val,city)}">
              <el-checkbox v-for="(cityChildren,ind) in city.cities"
                           :disabled="cityChildren.disabled"
                           :label="cityChildren"
                           :key="ind">{{cityChildren.city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="cancelCity()">取 消</el-button>
          <el-button type="primary"
                     @click="saveCity()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { nodeTime, renderTime, pennyToDollar } from '../../assets/utils'
import { areaCodes } from '../common/min/cityCode.js'
// import { areaCodes } from "../common/min/cityCode";

const cityOptions = areaCodes
const cityData = {}
export default {
  data() {
    var validateCheckPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.logisticsCompanyForm.contactsMobile)) {
          callback(new Error('手机号码有误，请重填'))
          return false
        } else {
          callback()
        }
      }
    }
    return {
      pennyToDollar,
      logisticsTypes: [
        { id: 1, name: '物流公司' },
        { id: 2, name: '自提点' },
        { id: 3, name: '收货地址' },
      ],
      logisticsCompanyRules: {
        address: [{ required: true, message: '请输入自提地址' }],
        name: [{ required: true, message: '请输入物流公司名称' }],
        contactsName: [{ required: true, message: '请输入联系人姓名' }],
        contactsMobile: [{ required: true, validator: validateCheckPhone, trigger: 'blur' }],
      },
      freight: {
        num: '',
      },
      rulesFreight: {
        num: [{ required: true, message: '运费不能为空', trigger: 'blur' }],
      },
      logisticsCompanies: [],
      logisticsCompanyForm: null,
      noneCity: false,
      charAll: [],
      dialogVisible: false,
      tableData: [],
      isEditObj: [],
      total: 0, //数据总条数
      params: {
        //数据传值
        condition: {},
        page: {
          pageNum: 1,
          pageSize: 15,
          orders: [],
          records: [],
        },
      },
      checkAll: false,
      checkedCities: [],
      childrenCity: [],
      cities: cityOptions,
      city: cityData,
      isIndeterminate: true,
      cityDatas: [],
      provinceSelectStatusData: [],
      cityList: [],
      setStoreForm: {
        addresses: [
          {
            address: '',
            code: 0,
            id: 0,
            storeId: 0,
            templateId: 0,
          },
        ],
        firstPrice: 0,
        firstWeight: 0,
        freePrice: null,
        id: 0,
        secondPrice: 0,
        secondWeight: 0,
        storeId: 0,
        address: '', //地址
      },
      selectedCity: [], //已选城市
      newcityData: [],
      newprint: [],
      curCityRow: null,
      address: '',
      hasEdit: false,
    }
  },
  created() {},
  computed: {},
  mounted() {
    this.getData()
    this.getLogisticsCompanies()
  },
  methods: {
    loadData() {
      this.selectedCity = []
      this.cityList = []
      let self = this
      this.cityDatas = this.cities.map((ele) => {
        ele.indeterminate = false
        ele.provinceSelectAll = false
        this.newcityData = ele.province
        let cities = ele.cities.map((item) => {
          this.newprint = item.city_code
          return {
            city: item.city,
            city_code: item.city_code,
            province_code: ele.province_code,
          }
        })
        this.cityList = this.cityList.concat(cities)
        return {
          province: ele.province,
          province_code: ele.province_code,
          cities: cities,
        }
      })
    },
    getEdit() {
      for (let i in this.tableData) {
        let a = 'edit' + i
        let obj = {}
        obj[a] = true
        this.isEditObj.push(obj)
      }
    },
    getData() {
      this.$axios.post(globalConfig.server1 + 'postpage/query', this.params).then((res) => {
        if (res.data.result === 1) {
          res.data.list.map((item) => {
            item.firstWeight = item.firstWeight / 1000
            item.firstPrice = item.firstPrice / 100
            item.secondWeight = item.secondWeight / 1000
            item.secondPrice = item.secondPrice / 100
            item.freePrice = item.freePrice / 100
            return
          })
          this.tableData = res.data.list
          this.isEditObj = []
          this.total = res.data.total
          this.getEdit()
        } else {
        }
      })
    },
    editUserInfo(row, index) {
      // row.hasAddressEdit = true;
      this.isEditObj[index][`edit${index}`] = false
    },
    addStore() {
      this.tableData.push({
        firstWeight: '',
        firstPrice: '',
        secondWeight: '',
        secondPrice: '',
        freePrice: null,
        addresses: [],
        hasAddressEdit: true,
      })
      this.getEdit()
    },
    // 设置当前收货地
    editPlace(row, index) {
      this.curCityRow = row
      this.curCityRow.index = index
      this.$axios.get(`${globalConfig.server1}postpage/getUsingAddress`).then((res) => {
        if (res.data.result === 1) {
          this.loadData()
          this.selectedCity = res.data.object

          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index]

            if (element.addresses && element.addresses.length > 0) {
              this.selectedCity = this.selectedCity.concat(element.addresses)
            }
          }
          this.selectedCity = this.getUniqueArray(this.selectedCity, 'code')

          if (this.selectedCity) {
            let checkedCities = this.cityList.filter((item) => {
              return (
                this.selectedCity.filter((ele) => {
                  return ele.code == item.city_code
                }).length > 0
              )
            })
            this.checkedCities = this.checkedCities.concat(checkedCities)

            checkedCities.forEach((item) => {
              let province = this.cityDatas.filter((obj) => {
                return obj.province_code == item.province_code
              })[0]

              item.disabled =
                row.addresses.filter((temp) => {
                  return temp.code == item.city_code
                }).length == 0
              if (item.disabled) {
                province.disabled = true
              }
              this.handleCheckedCitiesChange(item, province)
            })
          }

          this.dialogVisible = true
        } else {
        }
      })
    },
    checkSelectAll() {
      return (
        checkedCities.filter((item) => {
          return item.province_code == city.province_code
        }).length == city.cities.length
      )
    },
    getUniqueArray(arr, name) {
      return arr.filter(function (element, index, self) {
        return self.findIndex((el) => el[name] == element[name]) == index
      })
    },
    handleCheckAllChange(val, province) {
      let optionsArr = province.cities

      if (val) {
        this.checkedCities = this.checkedCities.concat(optionsArr)

        this.checkedCities = this.getUniqueArray(this.checkedCities, 'city_code')
      } else {
        this.checkedCities = this.checkedCities.filter((item) => {
          return (
            optionsArr.filter((e) => {
              return e.city_code == item.city_code
            }).length == 0
          )
        })
      }

      province.indeterminate = false
      let data = this.cityDatas
      this.cityDatas = []
      this.cityDatas = data
    },
    handleCheckedCitiesChange(value, province) {
      let optionsArr = province.cities
      let checkedCount = this.checkedCities.filter((item) => {
        return (
          optionsArr.filter((e) => {
            return e.city_code == item.city_code
          }).length > 0
        )
      }).length
      province.indeterminate = checkedCount > 0 && checkedCount < optionsArr.length
      province.provinceSelectAll = optionsArr.length == checkedCount
      let data = this.cityDatas
      this.cityDatas = []
      this.cityDatas = data
    },

    //提交城市信息
    saveCity() {
      let selectTempCities = this.checkedCities.filter((item) => {
        return !item.disabled
      })

      if (selectTempCities.length == 0) {
        this.$message.error('请至少添加一个地区')
        return
      }

      if (this.curCityRow) {
        if (selectTempCities.length > 0) {
          this.getNewSelectCities(selectTempCities)
        }
        this.curCityRow.hasAddressEdit = false
      }
      this.checkedCities = []
      this.dialogVisible = false
    },
    getNewSelectCities(selectTempCities) {
      if (selectTempCities.length == 0) {
        return
      }
      this.curCityRow.addresses = selectTempCities.map((item) => {
        return { code: item.city_code, address: item.city }
      })
    },
    //  取消
    cancelCity() {
      this.checkedCities = []
      this.cityDatas = []
      this.dialogVisible = false
    },
    // 保存单行信息
    saveTable(row, index) {
      this.hasEdit = false
      let list = {}
      let keys = Object.keys(row)
      if (!row.def) {
        if (
          row.firstWeight === '' ||
          row.firstPrice === '' ||
          row.secondWeight === '' ||
          row.secondPrice === '' ||
          row.addresses.length == 0
        ) {
          this.$message.error('必填项没有填写')
          return false
        }
      } else {
        if (row.firstWeight === '' || row.firstPrice === '' || row.secondWeight === '' || row.secondPrice === '') {
          this.$message.error('必填项没有填写')
          return false
        }
      }
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index]
        let value = row[element]
        list[element] = value
      }
      list.firstWeight = list.firstWeight * 1000
      list.secondWeight = list.secondWeight * 1000
      list.firstPrice = list.firstPrice * 100
      list.secondPrice = list.secondPrice * 100
      if (Number(list.freePrice)) {
        list.freePrice = list.freePrice * 100
      }
      let url = row.id ? 'postpage/update' : 'postpage/save'
      this.$axios.post(`${globalConfig.server1}${url}`, list).then((res) => {
        if (res.data.result === 1) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
        this.getData()
      })
    },
    //地址设置
    editSet(company) {
      company.hasEdit = true
      this.$forceUpdate()
    },
    //地址设置的保存
    savesetStore(company) {
      if (company.type === 2) {
        company.name = company.contactsName
      }
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(company.contactsMobile)) {
        this.$message.error('电话号码错误')
        return false
      }
      if (company.name === '' || company.contactsName === '' || company.address === '') {
        this.$message.error('必填项没有填写')
      } else {
        this.$axios.post(globalConfig.server1 + 'api/store/updateLogisticsCompany', company).then((res) => {
          if (res.data.result === 1) {
            this.$message.success(res.data.msg)
            this.getLogisticsCompanies()
          } else {
          }
        })
      }
    },
    //删除
    detailForm(row, index) {
      if (row.id == null) {
        this.tableData.splice(index, 1)
        return false
      }
      this.$confirm('确定删除该条角色信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let ids = [row.id]
          this.$axios.post(`${globalConfig.server1}postpage/delete`, [row.id]).then((res) => {
            if (res.data.result === 1) {
              this.$message.success(res.data.msg)
              this.cityDatas = []
              this.getData()
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
        .catch(() => {})
    },
    getLogisticsCompanies() {
      this.$http
        .ajax({
          url: APIHOST + 'api/store/getLogisticsCompany',
          dataType: 'json',
          context: this,
        })
        .done((res) => {
          if (res.result === 1) {
            this.logisticsCompanies = res.object.list
            this.logisticsCompanies.forEach((item) => {
              item.hasEdit = false
            })
          } else {
            this.$message({ message: '获取物流公司列表失败', type: 'error' })
          }
        })
        .fail(() => {
          console.log('获取物流公司列表接口出错')
        })
    },
    //设置运费
    addLogisticsCompanyItem() {
      this.logisticsCompanyForm = {
        name: '',
        contactsName: '',
        contactsMobile: '',
      }
    },

    addLogisticsCompany() {
      this.$refs['logisticsCompanyForm'].validate((valid) => {
        if (!valid) {
          this.$message.error('物流公司信息填写错误')
          return false
        }
        this.saving = true
        this.logisticsCompanyForm.type = 2
        this.$http
          .ajax({
            url: APIHOST + 'api/store/addLogisticsCompany',
            contentType: 'application/json; charset=utf-8',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(this.logisticsCompanyForm),
            context: this,
          })
          .done((res) => {
            if (res.result === 1) {
              this.$message({ message: '添加成功', type: 'success' })
              this.getLogisticsCompanies()
              this.logisticsCompanyForm = null
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
          .fail(() => {
            console.log('添加物流公司接口出错')
          })
          .always(() => {
            this.saving = false
          })
      })
    },
    deleteLogisticsCompany(id) {
      this.$confirm('确定要删除该物流公司吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .ajax({
              url: APIHOST + 'api/store/deleteLogisticsCompany/' + id,
              dataType: 'json',
              context: this,
            })
            .done((res) => {
              if (res.result === 1) {
                this.$message({ message: '删除成功', type: 'success' })
                this.getLogisticsCompanies()
              } else {
                this.$message({ message: res.msg, type: 'error' })
              }
            })
        })
        .catch(() => {})
    },

    checkNumber(row, checkName) {
      let val = row[checkName]

      if (!val) {
        return
      }

      val = val.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
      if (val.indexOf('.') < 0 && val != '') {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
      }
      row[checkName] = val
    },
    //分页器
    handleSizeChange(val) {
      this.params.page.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.params.page.pageNum = val
      this.search()
    },

    resetForm() {},
  },
}
</script>
<style scoped>
.info-sell {
  cursor: pointer;
}
.info-sell:hover,
.info-sell:focus {
  color: #fa5555;
  text-decoration: underline;
}
.saveSet {
  padding: 10px;
}
.dd {
}
.city-children {
  display: table-cell;
}
.city-children2 {
  display: table-cell;
  padding: 10px;
  padding-left: 30px;
  text-align: initial;
}
.city-children2 .el-checkbox {
  padding-top: 10px;
}
.body-city .el-dialog__body {
  height: 600px;
  overflow-y: scroll;
}
/deep/ .el-dialog__body {
  height: 600px;
  overflow-y: scroll;
  display: inline-block;
}
/deep/.el-button--text {
  border: none;
  background: none;
  width: 40px !important;
}

.form-section {
  border-radius: 3px;
  background-color: #fff;
  width: 100%;
}

.form-section .section-head {
  width: auto;
  position: relative;
  background-color: #f5f7fb;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  padding-left: 48px;
}

.form-section .section-body {
  padding: 30px 20px;
  width: auto;
  overflow-x: auto;
}

.button-ico {
  width: 65px !important;
}
.logistics-row .el-input {
  width: 180px;
}
.logistics-row {
  /* border:2px solid #eee;
  border-radius: 5px; */
  width: 100%;
  margin: 10px 0;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  line-height: 3;
}
.logistics-row > div {
  width: 20%;
}
.edit-p {
  display: contents;
  white-space: normal;
  /* width: 200px; */
}
.button-address {
  display: initial;
  float: right;
  padding-right: 45px;
}
.button-eid {
  /* float: right;
width: 15%!important; */
}
/deep/ .el-popover__reference {
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/deep/ .el-table .cell {
  display: flex;
  justify-content: center;
}
</style>
