import request from '@/utils/request'

// 登录方法
export function login(username, password, randstr, ticket) {
  const data = {
    username,
    password,
    ticket,
    randstr
  }
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 获取用户是否实名认证
export function getRealInfo() {
  return request({
    url: '/god/register/getRealNameInfo',
    method: 'get'
  })
}



// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function validateCapt(data) {
  return request({
    url: '/god/register/sendSmsCode',
    method: 'post',
    data
  })
}

// 审核验证码提交
export function submitCapt(data) {
  return request({
    url: '/god/register/checkSmsCode',
    method: 'post',
    data
  })
}

// 账号信息提交
export function submitAccountInfo(data) {
  return request({
    url: '/god/register/inputUserInfo',
    method: 'post',
    data
  })
}

// 用户实名信息提交
export function submitRealInfo(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/register/register',
    method: 'post',
    data,
  })
}

// 用户实名信息提交(修改)
export function realNameAuth(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/god/register/realNameAuth',
    method: 'post',
    data,
  })
}