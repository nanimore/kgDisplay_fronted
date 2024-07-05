import request from '@/utils/request'

  export function getInitDocList(query) {
    console.log(query)
    return request({
      url: '/entity/getEntityList',
      method: 'post',
      data: query
    })
  }