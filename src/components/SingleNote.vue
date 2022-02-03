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
                            <textarea ref="input" class="title_text title_text_input" flat v-model="note.title" @keyup="local_update_title(note)"></textarea>
                        </v-card-title>
                        <v-card-title class="mb-4" v-else @click="local_edit_title(note)">
                            <span class="title_text">{{ note.title }}</span>
                        </v-card-title>
                        <v-card-subtitle>
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
        
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data () {
        return {
           deleted: false,
           edit_title: false,
           input: ''
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
        local_edit_title () {
            this.edit_title = true
            console.log(this.$refs.input); //not working why?
        },
        local_update_title (note) {
            const edited_data = {
                "uuid": note.uuid,
                "title": note.title,
            }
            if (edited_data.title === '' || edited_data.title.trim() === '' ) alert('Title cannot be empty.')
            

            else {
                setTimeout( () => {
                    this.note_change_title(edited_data)
                    setTimeout(() => {
                        this.edit_title = false
                    },2000)
                }, 1500)
                
            }
           
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
                else if (this.notes_list.length >= 2) {
                    this.$router.push({name: "note", params: {uuid: this.notes_list[0].uuid}})
                    this.deleted = true
                    this.note_delete(note.uuid)
                
                } else {
                    this.$router.push({path: '/create-note'})
                    this.deleted = true
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
    .title_text_input:focus {
        outline: none;
    }
    .title_text_input {
        color: rgb(107, 103, 103);
        font-size: 1.5rem;
        font-weight: bold;
    }
    .completed {
        text-decoration-line: line-through;
    }
</style>