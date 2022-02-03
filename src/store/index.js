import Vue from 'vue'
import Vuex from 'vuex'
import Notes from './modules/Notes'

Vue.use(Vuex)
export default new Vuex.Store({
  strict: false,
    modules: {
      Notes
    }
})
