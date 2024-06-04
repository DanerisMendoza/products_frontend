import api from '@/api/index'

export default {
  state: {
    PRODUCTS: [],
  },

  getters: {
    PRODUCTS: (state) => state.PRODUCTS,
  },

  mutations: {
    PRODUCTS: (state, data) => { state.PRODUCTS = data },
  },

  actions: {
    GetProducts({ commit }, payload) {
      return new Promise((resolve, reject) => {
        api.get('api/GetProducts',payload).then((response) => {
          commit('PRODUCTS', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        });
      })
    },
 
    InsertProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
          api.post('api/InsertProduct', payload.params, payload.config).then((response) => {
            resolve(response.data)
          }).catch((error) => {
            reject(error)
          });
        })
      },
 
      UpdateProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
          api.post('api/UpdateProduct', payload.params, payload.config).then((response) => {
            resolve(response.data)
          }).catch((error) => {
            reject(error)
          });
        })
      },
 
    DeleteProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
          api.delete('api/DeleteProduct', payload).then((response) => {
            resolve(response.data)
          }).catch((error) => {
            reject(error)
          });
        })
      },

  }
}