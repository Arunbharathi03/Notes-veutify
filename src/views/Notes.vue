<template>
    <div>
        <div class="d-flex">
            <v-navigation-drawer height="760px" permanent width="400">
                <v-list>
                    <v-list-item>
                        <v-list-item-content class="mt-4 mb-4" >
                            <v-btn color="orange darken-2 white--text" @click="local_create_mode">create</v-btn>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content class="px-2">
                            <v-text-field placeholder="Search" v-model= "search_text" @keyup="local_search_mode"></v-text-field>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-group value="true">
                        <template v-slot:activator>
                            <v-list-item-title class="pa-8">
                                <span class="blue-grey--text font-weight-bold text--lighten-1">Notes</span>
                            </v-list-item-title>
                        </template>

                        <!--search mode-->

                        <!-- <v-skeleton-loader v-if="loading" class="mx-auto" max-width="300" :loading="loading"  type="list-item-two-line"></v-skeleton-loader> -->

                        <div v-if="search_mode">
                            <div class="d-flex align-center">
                                <div>
                                    <p class="px-12 pt-4">Search results</p>
                                </div>
                                <div @click="local_cancel_search">
                                    <v-icon small color="blue">cancel</v-icon>
                                </div>
                            </div>
                            <v-card  elevation="3" height="70px" width="350px" class="d-flex px-4 mx-auto card mb-4 mt-4"  @click="local_preview(search_result.uuid)">
                                <v-card-text>
                                    <v-row class="d-flex justify-space-between align-center">
                                        <div class="pb-4" @click.stop>
                                            <v-checkbox
                                                @change="local_change_status(search_result)" 
                                                v-model="search_result.completed" 
                                                color="success"
                                                hide-details>
                                            </v-checkbox>
                                        </div>  
                                        <v-card-title><span :class="[search_result.completed ? 'completed': '','title_text']">{{ local_truncated_title(search_result.title, 13) }}</span>
                                        </v-card-title>
                                        <div >
                                            <v-icon class="delete_icon" tag="delete" size="20" @click.stop="local_delete(search_result)">delete</v-icon>
                                        </div>
                                    </v-row>
                                </v-card-text>
                            </v-card>    
                        </div>

                        <!--normal mode -->
                        <div v-else>
                            <v-skeleton-loader v-if="loading" class="mx-auto" max-width="300" :loading="loading"  type="list-item-two-line"></v-skeleton-loader>

                            <v-card v-else elevation="3" height="70px" width="350px" class="d-flex px-4 mx-auto card mb-4 mt-4" v-for="note in notes_list" :key="note.uuid"  @click="local_preview(note.uuid)">
                                <v-card-text>
                                    <v-row class="d-flex justify-space-between align-center">
                                        <div class="pb-4" @click.stop>
                                            <v-checkbox
                                                @change="local_change_status(note)" 
                                                v-model="note.completed" 
                                                color="success"
                                                hide-details>
                                            </v-checkbox>
                                        </div>  
                                        <v-card-title><span :class="[note.completed ? 'completed': '','title_text']">{{ local_truncated_title(note.title, 12) }}</span>
                                        </v-card-title>
                                        <div >
                                            <v-icon class="delete_icon" tag="delete" size="20" @click.stop="local_delete(note)">delete</v-icon>
                                        </div>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-list-group>
                </v-list>
            </v-navigation-drawer> 

        <!--display area -->
            
            <v-skeleton-loader v-if="loading" class="pa-12" width="1400" type="table-heading, list-item-two-line, table-tfoot"></v-skeleton-loader>
            <div v-else>
                <router-view  class="display"></router-view>
            </div>
        </div>

        <!--create pop-->

        <v-dialog v-model="create_mode" max-width="600px" >
            <v-form ref="form">
                <v-card>
                    <v-card-title>
                    <span class="text-h5">Create Note</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="pa-4" sm="6" md="4">
                            <v-text-field label="Enter title*" :rules="titleRules" v-model="title" autofocus required></v-text-field>
                        </v-row>
                        <v-row class="pa-4">
                            <v-text-field label="Enter note*" v-model="description" :rules="descRules" @keyup.enter="local_create" required></v-text-field>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="local_cancel_create">Close</v-btn>
                        <v-btn color="blue darken-1" text @click="local_create">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!--delete pop-->

        <v-dialog v-model="delete_mode" max-width="600px">
            <v-card class="pa-4">
                <v-card-title class="text-h6">Do you want to delete ?</v-card-title>
                <v-card-text></v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="delete_mode = false" text>Cancel</v-btn>
                    <v-btn color="red darken-1" text @click="local_delete()" >Delete</v-btn>
                </v-card-actions>
            </v-card>         
        </v-dialog>
        

        <!--snack bar-->

            <!--CREATE-->
            <v-snackbar color="success" timeout="2000" v-model="created" absolute bottom tile>
                <v-icon>info</v-icon>
                <span class="font-weight-bold ml-6 text-subtitle-1">Created successfully !</span>
            </v-snackbar>
            <!--DELETE-->
            <v-snackbar color="red" timeout="2000" v-model="deleted" absolute bottom tile>
                <v-icon>info</v-icon>
                <span class="font-weight-bold ml-6 text-subtitle-1">Deleted successfully !</span>
            </v-snackbar>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
    data () {
        return {
            loading: '',
            search_mode: false,
            search_text: '',
            search_result: {},
            deleted: false,
            created: false,
            title: '',
            description: '',
            create_mode: false,
            delete_mode: false,
            is_disabled: true,
            titleRules: [
                v => ( v.length >= 3 && v.length <= 255 ) || 'characters must be between 3-255', 
            ],
            descRules: [
                v => v.length >= 3 || 'characters must be between 3-1000'
            ]
        }
    },
    mounted () {
        this.notes_index()
        this.loading = true
        
        setTimeout(() => {
            if (this.notes.length === 0) {
                this.$router.push({path: '/create-note'})
                this.loading = false
            } else {
                this.$router.push({name: "note", params: {uuid: this.first_item_id}})
                this.loading = false
            }
        }, 2300)
        
        
    },
    computed: {
        notes_list () {
            return this.notes
        },
        first_item_id () {
            return this.notes[0].uuid
        },
        
        ...mapState('Notes', {
            notes: 'list',
        })
    },
    
    methods: {
        local_truncated_title (title, num) {
            if (num > title.length) {
            return title;
            } else {
            title = title.substring(0,num);
            return title + "...";
            }
        },
        local_search_mode () {
            if(this.search_text !== '') {
                this.search_mode = true
                const searchItem = this.notes.find(note => note.title.toLowerCase().includes(this.search_text.toLowerCase()))
                this.search_result = {...searchItem}
            } else {
                this.search_mode = false
            }
        },
        local_cancel_search () {
            this.search_mode = false
            this.search_text = ''
        },
        local_create_mode () {
            this.create_mode = true
        },
        local_cancel_create () {
            this.create_mode = false
            this.title = ''
            this.description = ''
        },

        local_create () {
            const note = {
                "title": this.title,
                "description": this.description,
                "completed": 0
            }
        
            if (this.$refs.form.validate()) {
                this.note_create(note)
                this.create_mode = false
                this.created = true
                this.title = ''
                this.description = ''
            }
        },

        local_change_status (note) {
            const editedData = {
                "uuid": note.uuid,
                "title": note.title,
                "completed": note.completed ? 1 : 0
            }
            this.note_change_status(editedData)
        },

        local_delete (note) {
            let title
            const num = 12

            if (num > note.title.length) {
                title = note.title
            } else {
                title = note.title.substring(0,num);
                title = title + "...";
            }
            
            let confirmation = confirm(`Are you sure to delete ${title} `)

            if (confirmation) {
                
                if ((note.uuid === this.notes[0].uuid) && (this.notes.length >= 2)) {
                    this.$router.push({name: "note", params: {uuid: this.notes[1].uuid}})
                    this.deleted = true
                    this.note_delete(note.uuid)
                }   
                else if ((note.uuid === this.notes[0].uuid) && (this.notes.length === 1)) { 
                        this.$router.push({path: '/create-note'})
                        this.deleted = true
                        this.note_delete(note.uuid)
                }
                else {
                    this.$router.push({name: "note", params: {uuid: this.notes[0].uuid}})
                    this.deleted = true
                    this.note_delete(note.uuid)
                }

            } 
        },

        local_preview (id) {
            this.search_text = ''
            this.search_mode = false
            if (id !== this.$route.params.uuid) {
                this.$router.push({ name: 'note', params: {uuid: id}})
            }
        },

        ...mapActions('Notes', {
            notes_index: 'index',
            note_create: 'create',
            note_change_status: 'changeStatus',
            note_delete: 'delete',
        })
    }
  }
</script>

<style scoped>
    .card:hover {
        background-color: rgb(226, 226, 226);
        cursor: pointer;
    }
    .display {
        padding: 2rem;
        height: 700px;
        width: 1400px;
    }
    .title_text {
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0rem 2rem;
    }
    .completed {
        text-decoration-line: line-through;
       
    }
    .delete_icon:hover {
        color: rgb(231, 112, 112);
    }
</style>