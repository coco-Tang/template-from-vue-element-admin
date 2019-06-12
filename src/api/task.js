import request from '@/utils/request'
const url = "/importvoice/task";

export function getTask(params) {
  return request({
    url,
    method: 'GET',
    params
  })
}

export function addTask(params) {
  return request({
    url: '/importvoice/items',
    method: 'POST',
    params
  })
}

export function delTask(id) {
  return request({
    url: `${url}/${id}`,
    method: 'DELETE'
  })
}

export function validTaskid() {
  return request({
    url: "/importvoice/batchids",
    method: 'GET'
  })
}

export function validTaskname() {
  return request({
    url: "/importvoice/batchnames",
    method: 'GET'
  })
}
