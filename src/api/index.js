import request from '@/utils/request'

//获取首页图表数据
export function getHomePageData(data = {}) {
  return request({
    url: '/god/statistics/homePage',
    method: 'post',
    data
  })
}