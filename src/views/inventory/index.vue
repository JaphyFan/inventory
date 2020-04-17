<template>
  <div class="app-container">
    <div class="filter-container">
      <el-header>
        <el-form ref="form" :model="manifest" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="开始时间">
                  <el-date-picker type="date" v-model="listQuery.startDate" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="结束时间">
                  <el-date-picker v-model="listQuery.endDate" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="任务单号">
                  <el-input
                    v-model="listQuery.taskNo"
                    placeholder="请输入任务单号"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-form-item label="状态">
                  <el-select
                    v-model="listQuery.status"
                    clearable
                    style="width: 106px"
                    class="filter-item"
                  >
                    <el-option
                      v-for="item in statusOptions"
                      :key="item"
                      :label="item | statusShowFilter"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content">
                <el-form-item style="margin-left: -40px">
                  <el-button
                    v-waves
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleFilter"
                  >
                    查询
                  </el-button>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4" style="float: right">
              <div class="grid-content">
                <el-form-item>
                  <el-button
                    class="filter-item"
                    style="margin-left: 10px;"
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleCreate"
                  >
                    新建订单
                  </el-button>
                </el-form-item>
              </div>
            </el-col>

          </el-row>
        </el-form>
      </el-header>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="任务单号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taskNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托单位" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.commissionedUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完工时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.doneDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusShowFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="加工内容" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{ row.processingContent }}</span>
        </template>
      </el-table-column>
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
            v-if="row.status!=2"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >
            完成
          </el-button>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listManifest } from '@/api/manifest'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'Inventory',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'primary',
        1: 'info',
        2: 'success'
      }
      return statusMap[status]
    },
    statusShowFilter(status) {
      const statusMap = {
        0: '已创建',
        1: '进行中',
        2: '已完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        taskNo: ''
      },
      statusOptions: [0, 1, 2]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listManifest(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleCreate() {
      this.$router.push({ name: 'editOrder', params: { id: '-1' }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
    },
    handleDelete(row, index) {
      this.$confirm('确定要删除本单么', '警告', {
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
    }
  }
}
</script>
