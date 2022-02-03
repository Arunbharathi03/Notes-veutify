<template>
    <div class="page">
        <div class="container">
            <v-alert class="pa-8" type="info" prominent text shaped>
            <span class="px-2 text-h5">No data found !</span>
            </v-alert>
            <div class="text-center">
                <v-btn color="orange darken-2 white--text" @click="local_create_mode">create</v-btn>
            </div>
        </div>

        <!--create pop -->

        <v-dialog v-model="create_mode" max-width="600px" >
            <v-form ref="form">
                <v-card>
                    <v-card-title>
                    <span class="text-h5">Create Note</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="pa-4" sm="6" md="4">
                            <v-text-field label="Enter title*" :rules="titleRules" v-model="title" required></v-text-field>
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
    </div>

    
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data () {
        return {
            create_mode: false,
            title: '',
            description: '',
            titleRules: [
                v => ( v.length >= 3 && v.length <= 255  ) || 'characters must be between 3-255'
            ],
            descRules: [
                v => v.length >= 3 || 'characters must be between 3-1000'
            ]
        }
    },
    methods: {
        local_create_mode () {
            this.create_mode = true
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
                this.$router.push({path: '/notes'})
                
                this.title = ''
                this.description = ''
            }
        },

        local_cancel_create () {
            this.create_mode = false
            this.title = ''
            this.description = ''
        },
        ...mapActions('Notes', {
            note_create: 'create',
        })
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        
    }
    .page {
        margin: auto;
        margin-top: 12rem;
        max-width: 1200px;
    }
</style>