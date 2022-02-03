<template>
  <div id="App">
    <v-app>
      <nav>
          <v-toolbar flat class="px-8 d-l" color="blue darken-1">
            <div class="pr-6">
              <v-icon size="30" color="grey lighten-4">menu</v-icon>
            </div>
            
            <v-toolbar-title>
              <span class="white--text text--darken-2 text-h4 font-weight-bold">Be<span class="orange--text">a</span>st</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="px-6 py-4" transparent small>
              <span>sign out</span>
            </v-btn>

            <template v-slot:extension>
              <v-tabs optional active-class="active" centered>
                <v-tabs-slider color="red"></v-tabs-slider>
                <v-tab class="px-16" link to="/">
                  <v-icon class="mr-4" color="white">home</v-icon>
                  <span class="white--text">Home</span>
                </v-tab>
                <v-tab class="px-16" link to="/about">
                  <v-icon class="mr-4" color="white">info</v-icon>
                  <span class="white--text">About</span>
                </v-tab>
                <v-tab class="px-16" link to="/notes">
                  <v-icon class="mr-4" color="white">notes</v-icon>
                  <span class="white--text">Notes</span>
                </v-tab>
              </v-tabs>
            </template>

          </v-toolbar>
        </nav>
        <v-main>
          <router-view></router-view>
        </v-main>
      </v-app>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
      return {
        
      }
    },
    computed: {
      itemId () {
        return this.notes_list[0].uuid
      },
      ...mapState('Notes', {
        notes_list: 'list'
      })
    }
  }
</script>

<style scoped>
  #app {
    
  }
 .active {
   border-bottom: 1px solid red;
 }
</style>
