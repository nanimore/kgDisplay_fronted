import request from '@/utils/request'

export function getAllEntityType() {
    return request({
      url: '/proofread/getAllEntityType',
      method: 'get',
    })
  }