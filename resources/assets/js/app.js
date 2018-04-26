
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

// to import chat scrolle go to this link https://github.com/theomessin/vue-chat-scroll
// to use this command  npm install --save vue-chat-scroll
// and use this code
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data:{
    	message:'',

    	chat:{
    		message:[],
            user:[],
            color:[],
            time:[]
    	},
      typing:'',
      numberOfUsers:0
    },

    watch:{
      message(){
        Echo.private('chat')
       .whisper('typing', {
        name: this.message
    });
      }
    },

    methods:{
    	send(){
    		// in order to not add an empty pessage 
    		  if(this.message.length != 0){
                this.chat.message.push(this.message);
                this.chat.color.push('success');
                // if i send message the sender is you 
                this.chat.user.push('you');
       		    	this.chat.time.push(this.getTime());
// we get this code from  https://github.com/axios/axios
            axios.post('/send', {
                message : this.message
              })
              .then( response => {
                console.log(response);
                this.message =''
              })
              .catch (error => {
                console.log(error);
              });

    		  } 
    		
    	},
      getTime(){
        let time=new Date();
        return time.getHours()+':'+time.getMinutes();
      }
    },
    mounted(){
        Echo.private('chat')
       .listen('ChatEvent', (e) => {
       this.chat.message.push(e.message);
       // if i recive message the sender is a user 
       this.chat.user.push(e.user.name);
       this.chat.color.push('warning');
       this.chat.time.push(this.getTime());

      // console.log(e);
    })

    .listenForWhisper('typing', (e) => {
      if(e.name != ''){
        this.typing='typing...'
      }else{
       this.typing=''
      }
    })
    // here we join to chat channel 
    Echo.join(`chat`)
        .here((users) => {
          this.numberOfUsers = users.length;
            //
        })
        .joining((user) => {
          this.numberOfUsers =+1;
            console.log(user.name);
        })
        .leaving((user) => {
          this.numberOfUsers -=1;
            console.log(user.name);
        });

        }
});
