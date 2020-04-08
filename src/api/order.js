import request from '@/utils/request'

// 获取订单列表信息
export function getOrderList(data) {
  return request({
    url: '/tiens/order/list',
    method: 'post',
    data
  })
}

// 获取详情
export function getOrderDetail(data) {
  return request({
    url: '/tiens/order/detail',
    method: 'post',
    data
  })
}

// 前往支付
export function handelToPay(data) {
  return request({
    url: '/tiens/order/pay',
    method: 'post',
    data
  })
}


// 前往还款
export function handelToRepay(data) {
  return request({
    url: '/tiens/order/repay',
    method: 'post',
    data
  })
}

// 订单明细
export function getDetailList(data) {
  return request({
    url: '/tiens/order/detaillist',
    method: 'post',
    data
  })
}

// 导出
export function handelExportDetail(data) {
  return request({
    url: '/tiens/order/exportdetail',
    method: 'post',
    data
  })
}