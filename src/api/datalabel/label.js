import request from '@/utils/request'

  export function labelNewsList(query) {
    return request({
      url: 'articleFilter/getDocList',
      method: 'get',
      params: query
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
      url: '/AnnotationFistPage',
      method: 'post',
      data: query
    })
  }