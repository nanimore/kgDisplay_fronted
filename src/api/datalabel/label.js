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
  export function discard(query) {
    return request({
      url: '/article/discard',
      method: 'post',
      data: query
    })
  }
  export function getEntityNameByEntityType(query) {
    return request({
      url: '/proofread/getEntityName',
      method: 'post',
      params: query
    })
  }
  export function deleteEntity(query) {
    return request({
      url: '/proofread/deleteEntity',
      method: 'post',
      data: query
    })
  }
  export function getPropList(query) {
    return request({
      url: '/proofread/getPropertyList',
      method: 'post',
      data: query
    })
  }
  export function getInitDatasourceName(query) {
    console.log(query)
    return request({
      url: 'articleFilter/initDatasourceName',
      method: 'get',
      params: query
    })
  }
  export function getInitProofreaders(query) {
    console.log(query)
    return request({
      url: '/articleFilter/initProofreaders',
      method: 'get',
      params: query
    })
  }
  export function assignArticle(query) {
    console.log(query)
    return request({
      url: '/article/assignArticle',
      method: 'post',
      data: query,
    })
  }
  export function cancelAssignArticle(query) {
    return request({
      url: '/article/cancelAssignArticle',
      method: 'post',
      data: query,
    })
  }
  export function deleteArticle(query) {
    return request({
      url: '/article/delete',
      method: 'post',
      data: query,
    })
  }
  export function updateDataType(query) {
    return request({
      url: '/article/updateDataType',
      method: 'post',
      data: query,
    })
  }