import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Notes from '../views/Notes.vue'
import SingleNote from '../components/SingleNote.vue'
import NoData from '../views/NoData.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes,
    children: [
      {
        path: '/note/:uuid',
        name: 'note',
        component: SingleNote 
      },
    ]
  },
  {
    path: '/create-note',
    name: 'create-note',
    component: NoData
  }
  
]

const router = new VueRouter({
  routes,
  mode: 'history',
  
})

export default router
