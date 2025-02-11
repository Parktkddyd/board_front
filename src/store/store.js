import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isAuthenticated: false,
        user: null,
    },
    mutations: {
        SET_AUTH(state, user) {
            state.isAuthenticated = true
            state.user = user

        },
        CLEAR_AUTH(state) {
            state.isAuthenticated = false
            state.user = null
        }
    },
    actions: {
        async checkAuth({ commit }) {
            try {
                const response = await axios.get('/api/v1/users/session/check')
                if (response.data.header.customStatusCode != 'USER-ACCESS-200') throw new Error('Invalid Session')
                commit('SET_AUTH', response.data.data.user_id)
                return true
            } catch (error) {
                commit('CLEAR_AUTH')
                return false
            }
        },
        async login({ commit }, user) {
            commit('SET_AUTH', user)
        },
        async logout({ commit }) {
            commit('CLEAR_AUTH')
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        currentUser: state => state.user
    }
})