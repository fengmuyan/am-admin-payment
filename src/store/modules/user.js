import { login, logout, getInfo, getRealInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    isReal: '',
    isOpenAccount: '',
    userNumber: '',
    permissions: [],
    tipAppeared: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_REAL: (state, isReal) => {
      state.isReal = isReal
    },
    SET_ACCOUNT: (state, isOpenAccount) => {
      state.isOpenAccount = isOpenAccount
    },
    SET_NUMBER: (state, number) => {
      state.userNumber = number
    },
    TOGGLE_TIP: (state, bool) => {
      state.tipAppeared = bool
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const randstr = userInfo.randstr
      const ticket = userInfo.ticket
      return new Promise((resolve, reject) => {
        login(username, password, randstr, ticket).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user;
          const avatar = require("@/assets/image/profile.jpg");
          if (res.roles && res.roles.length > 0) {
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', res.phoneUserName ? res.phoneUserName : "admin")
          commit('SET_REAL', res.realNameState)
          commit('SET_ACCOUNT', res.bankAccountState)
          commit('SET_NUMBER', user.phonenumber)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        });
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    toggleTip({ commit }, bool) {
      return new Promise(resolve => {
        commit('TOGGLE_TIP', bool)
        resolve()
      })
    },

    setAvatar({ commit }, url) {
      return new Promise(resolve => {
        commit('SET_AVATAR', url)
        resolve()
      })
    },
  }
}

export default user