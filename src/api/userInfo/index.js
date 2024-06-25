import request from '@/utils/request'

  export function getPersonalInfo(query) {
    console.log(query)
    return request({
      url: '/personalInfo',
      method: 'post',
    })
  }
  export function managePersonalInfo(query) {
    console.log(query)
    return request({
      url: '/managePersonalInfo',
      method: 'post',
      params:query
    })
  }