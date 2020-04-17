import Mock from 'mockjs'

const List = []
const count = 5

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    no: '@increment',
    createDate: +Mock.Random.date('T'),
    productionOperation: '@first',
    itemType: '@first',
    itemName: '@integer(1, 3)',
    itemCount: '@integer(1, 3)',
    itemNo: '@integer(1, 3)',
    remark: '@first',
    doneDate: +Mock.Random.date('T')
  }))
}

export default [
  {
    url: '/vue-element-admin/orders',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  },

  {
    url: '/vue-element-admin/orders',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: List.pop()
      }
    }
  },

  {
    url: '/vue-element-admin/orders',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: List.pop()
      }
    }
  },

  {
    url: '/vue-element-admin/orders',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
