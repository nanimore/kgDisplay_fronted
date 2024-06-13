import request from '@/utils/request'

  export function labelNewsList(query) {
    console.log(query)
    return request({
      url: 'articleFilter/getDocList',
      method: 'post',
      data: query
    })
  }
  export function getinitDocType(query) {
    return request({
      url: 'articleFilter/initDocType',
      method: 'get',
      params: query
    })
  }
  export function getInitDocCategory(query) {
    return request({
      url: 'articleFilter/initDocCategory',
      method: 'get',
      params: query
    })
  }
  export function annotationFistPage(query) {
    return request({
      url: '/proofread/AnnotationFirstPage',
      method: 'post',
      data: query
    })
  }
  export function getEntityList(query) {
    return request({
      url: '/proofread/getEntityList',
      method: 'post',
      data: query
    })
  }
