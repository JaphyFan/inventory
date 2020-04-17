import Mock from 'mockjs'

const source = []
const count = 15

for (let i = 0; i < count; i++) {
  source.push(Mock.mock({
    id: '@increment',
    taskNo: '@increment',
    commissionedUnit: '@first',
    createDate: Mock.Random.date('yyyy-MM-dd'),
    doneDate: Mock.Random.date('yyyy-MM-dd'),
    processingContent: '@first',
    status: Mock.Random.integer(0, 2)
  }))
}

export default [
  {
    url: '/vue-element-admin/manifests',
    type: 'get',
    response: config => {
      // const { importance, type, title, page = 1, limit = 20, sort } = config.query
      //
      // let mockList = source.filter(item => {
      //   if (importance && item.importance !== +importance) return false
      //   if (type && item.type !== type) return false
      //   if (title && item.title.indexOf(title) < 0) return false
      //   return true
      // })

      // if (sort === '-id') {
      //   mockList = mockList.reverse()
      // }
      //
      // const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        data: {
          total: source.length,
          items: source
        }
      }
    }
  },

  {
    url: '/vue-element-admin/manifests/1',
    type: 'get',
    response: config => {
      const m = source.pop()
      return {
        code: 20000,
        data: m
      }
    }
  },

  {
    url: '/vue-element-admin/manifests',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: source.pop()
      }
    }
  },

  {
    url: '/vue-element-admin/manifests',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: source.pop()
      }
    }
  },

  {
    url: '/vue-element-admin/manifests',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
