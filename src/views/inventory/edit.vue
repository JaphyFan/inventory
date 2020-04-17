<template>
  <div class="app-container">
    <el-form ref="form" :model="manifest" label-width="80px">
      <el-row>
        <el-button
                class="filter-item"
                style="margin-left: 10px; float: right"
                type="danger"
                @click="handleReturn"
        >
          返回
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px; float: right"
          type="primary"
          @click="handleCreate"
        >
          保存主单
        </el-button>
      </el-row>
      <el-container>
        <el-header height="250px">
          <el-row
            :gutter="20"
          >
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="任务单号">
                  <el-input v-model="manifest.taskNo" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="委托单位">
                  <el-input v-model="manifest.commissionedUnit" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="下单时间">
                  <el-date-picker v-model="manifest.createDate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="完工时间">
                  <el-date-picker v-model="manifest.doneDate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="加工内容">
                <el-input
                  v-model="manifest.processingContent"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  type="textarea"
                  placeholder="加工内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table
            v-loading="listLoading"
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              prop="no"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="createDate"
              label="日期"
              width="120"
              align="center"
            />
            <el-table-column
              prop="productionOperation"
              label="生产工序"
              align="center"
              width="200"
            />
            <el-table-column label="使用材料" align="center">
              <el-table-column
                prop="itemType"
                label="类别"
                width="150"
                align="center"
              />
              <el-table-column
                prop="itemName"
                label="名称"
                width="250"
                align="center"
              />
              <el-table-column
                prop="itemCount"
                label="数量"
                width="80"
                align="center"
              />
              <el-table-column
                prop="itemNo"
                label="编号"
                width="200"
                align="center"
              />
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              width="250"
              align="center"
            />
            <el-table-column
              prop="doneDate"
              label="完工日期"
              width="120"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
              width="230"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{row,$index}">
                <router-link :to="'/inventory/edit/'+row.id" class="link-type">
                  <el-button type="primary" size="small" icon="el-icon-edit">
                    修改
                  </el-button>
                </router-link>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(row,$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col>
              <div
                class="el-table-add-row"
                style="width: 99.2%"
                @click="createDataConfig()"
              >
                <span>+ 添加新数据</span>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-form>
  </div>
</template>

<script>
import { listOrder, createOrder, updateOrder, deleteOrder } from '@/api/order'
import { getManifest, createManifest, updateManifest } from '@/api/manifest'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'OrderEdit',
  directives: { waves },
  data() {
    return {
      listLoading: true,
      manifest: {
        id: '',
        taskNo: '',
        commissionedUnit: '',
        createDate: '',
        doneDate: '',
        processingContent: ''
      },
      list: null,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{
          type: 'date',
          required: true,
          message: 'timestamp is required',
          trigger: 'change'
        }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getManifest()
    this.getList()
  },
  methods: {
    getManifest() {
      getManifest(1).then(response => {
        this.manifest = response.data.items

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定要删除本行么', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    createDataConfig() {
      // for (const i of this.dataConfig.paginate.data) {
      //   if (i.isSet) return this.$message.warning('请先保存当前编辑项');
      // }
      const j = {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        no: 1,
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }
      this.tableData.push(j)
    },
    getList() {
      this.listLoading = true
      listOrder(1).then(response => {
        this.list = response.data.items

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleReturn() {
      this.$router.push({ name: 'inventory' })
    },
    handleCreate() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateOrder(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style>
  .el-header {
    padding-top: 20px;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
  }

</style>
