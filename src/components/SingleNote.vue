<template>
    <div>
        <v-card flat height="120">
            <v-card-text>
                <v-row>
                    <v-col cols="1">
                        <v-checkbox
                            @change="local_change_status(note)" 
                            v-model="note.completed" 
                            color="success"
                            hide-details>
                        </v-checkbox>
                    </v-col>
                
                    <v-col cols="7">
                        <v-card-title v-if="edit_title" class="mb-4">
                            <textarea ref="input" :messages="title_status" class="title_text title_text_input" autofocus flat v-model="note.title" @keydown="local_edit_title(note)"></textarea>
                        </v-card-title>
                        <v-card-title class="mb-4" v-else @click="local_edit_title_mode(note)">
                            <span class="title_text">{{ note.title }}</span>
                        </v-card-title>

                        <v-card-subtitle v-if="edit_description" class="mb-4">
                            <textarea ref="input" class="blue--text text--darken-3 text-h6 font-weight-bold description_text_input" flat v-model="note.description" autofocus @keyup="local_edit_description(note)"></textarea>
                        </v-card-subtitle>
                        <v-card-subtitle v-else @click="local_edit_description_mode(note)">
                            <span class="blue--text text--darken-3 text-h6 font-weight-bold">{{ note.description }}</span>
                        </v-card-subtitle>
                    </v-col>

                    <v-col cols="2">
                        <v-card-title>
                            <v-btn color="red accent-1" text @click="local_delete(note)">
                                <span class="pr-2">delete</span>
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-card-title>
                    </v-col>
                    
                </v-row>
                <v-row class="mt-8">
                    <div v-show="note.completed" class="pl-4">
                        <h2 class="green--text">COMPLETED !</h2>
                    </div>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Snackbar DELETE-->
            <v-snackbar color="red" timeout="2000" v-model="deleted" absolute bottom tile>
                <v-icon>info</v-icon>
                <span class="font-weight-bold ml-6 text-subtitle-1">Deleted successfully !</span>
            </v-snackbar>
        <!--EDIT-->
            <v-snackbar color="info" timeout="2000" v-model="edited" absolute bottom tile>
                <v-icon>info</v-icon>
                <span class="font-weight-bold ml-6 text-subtitle-1">Edited successfully !</span>
            </v-snackbar>
        
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data () {
        return {
            title_status: ['editing...'],
            deleted: false,
            edited: false,
            edit_title: false,
            edit_description: false,
            input: '',
            delay: ''
        }
    },
    mounted () {
        this.notes_index()
    },
    computed: {
        itemId () {
            return this.$route.params.uuid
        },
        note () {
            const index = this.notes_list.findIndex(note => note.uuid === this.itemId)
            return {...this.notes_list[index]}
        },
        ...mapState('Notes', {
            note_item: 'item',
            notes_list: 'list',
        })
    },
    methods : {
        ...mapActions('Notes', {
            notes_index: 'index',
            note_change_status: 'changeStatus',
            note_change_title: 'changeTitle',
            note_change_description: 'changeDescription',
            note_delete: 'delete'
        }),
        local_change_status (note) {
            const editedData = {
                "uuid": note.uuid,
                "title": note.title,
                "completed": note.completed ? 1 : 0
            }
            
            this.note_change_status(editedData)
        },
        local_edit_title_mode () {
            this.edit_title = true
            // this.$nextTick(() => {
            //     this.$refs.input.focus() //not working why?
            // })
        },
        local_edit_description_mode () {
            this.edit_description = true
        },
        local_edit_title (note) {

            clearTimeout(this.delay)

            const edited_data = {
                "uuid": note.uuid,
                "title": note.title,
            }
                this.delay = setTimeout(() => {
                    if (this.$refs.input.value) {
                
                        if (edited_data.title === '' || edited_data.title.trim() === '' || ((edited_data.title.length < 3) || (edited_data.title.length > 255)) ) alert('Characters must be 3-255')
                        else {
                            this.note_change_title(edited_data)
                            this.edited = true
                            clearTimeout(this.delay)
                        }
                    }
                }, 2000)

        },
            
        local_edit_description (note) {
            
            clearTimeout(this.delay)

            const edited_data = {
                "uuid": note.uuid,
                "title": note.title,
                "description": note.description
            }

            this.delay = setTimeout(() => {
                if (this.$refs.input.value) {
                
                    if (edited_data.description === '' || edited_data.description.trim() === '' || ((edited_data.description.length < 3) || (edited_data.description.length > 1000)) ) alert('Characters must be 3-1000')
                    else {
                        this.note_change_title(edited_data)
                        this.edited = true
                        clearTimeout(this.delay)
                    }
                }
            }, 2000) 
        },
        local_finish_edit () {
            this.edit_title = false
            this.edit_description = false
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
                
                if ((note.uuid === this.notes_list[0].uuid) && (this.notes_list.length >= 2)) {
                    this.$router.push({name: "note", params: {uuid: this.notes_list[1].uuid}})
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
    },

}
</script>

<style scoped>
    .title_text {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .title_text_input:focus, .description_text_input:focus{
        outline: none;
    }
    .description_text_input {
        width: 700px; 
    }
    .title_text_input {
        color: rgb(107, 103, 103);
        font-size: 1.5rem;
        font-weight: bold;
        width: 700px;
    }
    
</style>