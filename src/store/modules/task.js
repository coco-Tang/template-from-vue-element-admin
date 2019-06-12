import { getTask, addTask, delTask } from '@/api/task'

const state = {
  taskData: []
}

const mutations = {
  SET_TASKDATA: (state, taskData) => {
    state.taskData = taskData;
  }
}

const actions = {
  // get task data
  getTask({ commit }, params) {
    return new Promise((resolve, reject) => {
      getTask(params).then( response => {
        // console.log(response.data);
        const data = response.data;
        commit("SET_TASKDATA", data.list);
        resolve();
      } ).catch(error => {
        reject(error);
      })
    })
  },

  // add task data
  addTask({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      addTask(params).then( response => {
        console.log(response);
        dispatch("getTask");
        // const data = response.data;
        // commit("SET_TASKDATA", data.list);
        resolve();
      } ).catch(error => {
        reject(error);
      })
    })
  },
  

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
