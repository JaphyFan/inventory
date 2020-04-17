<template>
  <div class="app-container">
    <div class="filter-container">
      <el-header>
        <el-form ref="form" :model="manifest" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="开始时间">
                  <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-form-item label="结束时间">
                  <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="任务单号">
                  <el-input
                    v-model="listQuery.title"
                    placeholder="请输入任务单号"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                  />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <el-form-item label="状态">
                  <el-select
                    v-model="listQuery.importance"
                    clearable
                    style="width: 90px"
                    class="filter-item"
                  >
                    <el-option
                      v-for="item in importanceOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              查询
            </el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate"
            >
              新建订单
            </el-button>
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
      @sort-change="sortChange"
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
            {{ row.status }}
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
            v-if="row.status!='published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,'published')"
          >
            完成
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
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
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'Inventory',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'createDate') {
        this.sortByCreateDate(order)
      }
    },
    sortByCreateDate(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+createDate'
      } else {
        this.listQuery.sort = '-createDate'
      }
      this.handleFilter()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
