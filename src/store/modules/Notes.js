import axios from 'axios'
axios.defaults.baseURL = "https://notes-crud.test/api"

export default {
    namespaced: true,

    state: {
        list: [],
        item: {},  
    },
      
    mutations: {
        INDEX (state, payload) {
            state.list = payload
        },
        INDEX_ITEM (state, payload){
            const index = state.list.findIndex(note => note.uuid === payload.uuid)
            Object.assign(state.item, {...state.list[index]})
        },
        CREATE (state, payload) {
            state.list.unshift(payload)
        },
        CHANGE_STATUS (state, payload) {
            const index = state.list.findIndex(note => note.uuid === payload.uuid) 
            Object.assign(state.list[index], {...payload})  
        },
        CHANGE_TITLE (state, payload) {
            const index = state.list.findIndex(note => note.uuid === payload.uuid) 
            Object.assign(state.list[index], {...payload})
        },
        DELETE_NOTE (state, payload) {
            const index = state.list.findIndex(note => note.uuid === payload)
            state.list.splice(index, 1)
            
        }
    },
    
    actions: {
        index (context) {
            axios.get('/notes')
            .then(response => {
                const data = response.data.data
                context.commit('INDEX', data)
            })
            .catch(error => console.log(error))
        },
        indexItem (context, payload){
            axios.get(`/notes/${payload}`)
            .then(response => {
                const data = response.data.data
                console.log(data);
                context.commit('INDEX_ITEM', data)
            })
            .catch(error => console.log(error))
        },
        create (context, payload) {
            axios.post('/notes', payload)
            .then(response => {
                const data = response.data.data.data
                context.commit('CREATE', data)
            })
            .catch(error => console.log(error))
        },
        changeStatus (context, payload) {
            axios.patch(`/notes/${payload.uuid}`, payload)
            .then(response => {
                const data = response.data.data
                context.commit('CHANGE_STATUS', data)
            })
            .catch(error => console.log(error))
        },
        changeTitle (context, payload) {
            axios.patch(`/notes/${payload.uuid}`, payload)
            .then(response => {
                const data = response.data.data
                context.commit('CHANGE_TITLE', data)
            })
            .catch(error => console.log(error))
        },
        delete (context, payload) {
            axios.delete(`/notes/${payload}`)
            .then(response => {
                console.log(response);
                context.commit('DELETE_NOTE', payload)
            })
            .catch(error => console.log(error))
        } 
    }
}