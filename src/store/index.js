import { createStore } from 'vuex';
import User from '@/store/modules/User'
import Product from '@/store/modules/Product'


export default createStore({
  strict: false,
  modules: {
    User, Product
  },
});
