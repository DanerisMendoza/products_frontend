import api from '@/api/index'

export default {
  state: {
    USERS: [],
    USER_DETAILS: { name: null },
  },

  getters: {
    USER_DETAILS: (state) => state.USER_DETAILS,
    USERS: (state) => state.USERS,
  },

  mutations: {
    USER_DETAILS: (state, data) => { state.USER_DETAILS = data },
    USERS: (state, data) => { state.USERS = data },
  },

  actions: {
    GetUsers({ commit }) {
      return new Promise((resolve, reject) => {
        api.get('api/GetUsers').then((response) => {
          commit('USERS', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },
    DeleteUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        api.delete('api/DeleteUser', payload).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },
    
    InsertUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        api.post('api/InsertUser', payload).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },

    
    GetUserDetails({ commit }) {
      return new Promise((resolve, reject) => {
        api.get('api/GetUserDetails').then((response) => {
          commit('USER_DETAILS', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },
    Logout() {
      return new Promise((resolve, reject) => {
        api.post('api/Logout').then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },
    LOGIN({ commit }, payload) {
      return new Promise((resolve, reject) => {
        api.post('api/Login', payload).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },

  }
}