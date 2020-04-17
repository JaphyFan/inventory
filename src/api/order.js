import request from '@/utils/request'

export function listOrder(query) {
  return request({
    url: '/vue-element-admin/orders',
    method: 'get',
    params: query
  })
}

export function createOrder(data) {
  return request({
    url: '/vue-element-admin/orders',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/vue-element-admin/orders',
    method: 'put',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: '/vue-element-admin/orders',
    method: 'delete',
    data
  })
}

