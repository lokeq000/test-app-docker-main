import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users:[],
 
  },
  mutations: {
    SET_USERS_TO_VUEX:(state,users) =>{
      users.forEach(element => {
        element.date = element.date.replace(/\D/g, '')
      });
      state.users = users
    },

    
  },
  actions: {

    GET_USERS_FROM_API({commit}){
     return axios('http://localhost/api/comments/', {
       method:'GET'
     })
     .then((response)=>{
        commit('SET_USERS_TO_VUEX', response.data)
     })
    }
  },
  getters:{
      GET_USERS(state){
        return state.users
      }
    }
  
})