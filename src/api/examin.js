import request from '@/utils/request'

// 获取申请列表
export function getApplyList(data) {
  return request({
    url: '/thearchy/merchant/list',
    method: 'post',
    data
  })
}

// 货主申请操作
export function handelApply(data) {
  return request({
    url: '/thearchy/merchant/save',
    method: 'post',
    data
  })
}