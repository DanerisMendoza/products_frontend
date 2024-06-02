import { createStore } from 'vuex';
import User from '@/store/modules/User'


export default createStore({
  strict: false,
  modules: {
    User,
  },
});
