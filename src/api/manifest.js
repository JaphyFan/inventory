import request from '@/utils/request'

export function getManifest(data) {
  return request({
    url: '/vue-element-admin/manifests/1',
    method: 'get',
    data
  })
}

export function listManifest(data) {
  return request({
    url: '/vue-element-admin/manifests',
    method: 'get',
    data
  })
}

export function createManifest(data) {
  return request({
    url: '/vue-element-admin/manifests',
    method: 'post',
    data
  })
}

export function updateManifest(data) {
  return request({
    url: '/vue-element-admin/manifests',
    method: 'put',
    data
  })
}

export function deleteManifest(data) {
  return request({
    url: '/vue-element-admin/manifests',
    method: 'delete',
    data
  })
}
