<template>
    <div>
      <div class="container">
      <div class="selects">
        <div class="select_inner">
          <p class="selectName">По дате: </p>
           <m-select
       @select="selectOptionDate"
       :selected="selectDateSort"
        :options="[{value:'New', name:'Сначала новые'},{value:'Old', name:'Сначала старые'}]" />
        </div>
        <div class="select_inner">
          <p class="selectName">По id : </p>
 <m-select
      @select="selectOptionId"
       :selected="selectIdSort"
        :options="[{value:'New', name:'Сначала новые'},{value:'Old', name:'Сначала старые'}]" />
        </div>
        
      </div>
     
      <div class="inner innerCom" v-for="user in paginatedComm" :key="user.id">
        <div class="usersCommHeader">
         
            <div class="userCommName"><strong>{{user.name}}</strong></div> <div>{{`${user.date[0]}${user.date[1]}${user.date[2]}${user.date[3]}-${user.date[4]}${user.date[5]}-${user.date[6]}${+user.date[7]+1} `}}</div>  
        </div>
           <div class="usersComm">
             <div class="userCommText">{{user.text}}</div>
             <button class="btn" @click="deleteUserComm(user.id)">Удалить</button>
          </div>
      </div>
    
    <div class="comm_pagination">
      <div
      @click="pageClick(page)"
       class="page"
       :class="{'page__selected': page === pageNumber}"
      v-for="page in pages"
      :key="page"
      >{{page}}</div>
    </div>

    <div class="formAddComment">
     
          <form action="./">
                <div class="inner innerForm">
               <div class="FlexCont">
                       <label for="name" class="label" >Имя пользователя: </label>
              <input type="text" class="input" name="name" v-model="userData.name" id="name">
               </div>
                <div class="FlexCont" style="margin-top:20px">
                   <label class="label" for="comment">Комментарий: </label>
              <textarea name="comment" class="input" id="comment" v-model="userData.text"></textarea>
                </div>
             <div class="inputDate"><label >Дата добавления: </label>  <date-picker v-model="userData.date" :lang="lang" :popupStyle='{"background-color":"#f1f1f1"}'></date-picker></div> 
               
              <button class="btn"  @click.prevent="setFunc" >Добавить комментарий</button>
                      <p v-if="Validate.name" class="error">Введите имя пользователя</p>
                      <p v-if="Validate.date" class="error">Введите дату добавления</p>
                      <p v-if="Validate.text" class="error">Введите текст комментария</p>
              </div>
      
          </form>
       


    
    </div>
    </div>

    </div>
</template>
<script>
const default_layout = "default";
 import {mapActions, mapGetters} from 'vuex'
import DatePicker from 'vue2-datepicker'
import mSelect from '../components/m-select.vue'




   export default {
  components: { mSelect, DatePicker },
 data(){
   return {
         lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }},
     Validate:{
       name:false,
       text:false,
       date:false
     },
     selectDateSort:'Сортировка по дате',
     selectIdSort:'Сортировка по id',
     sortedArr:[],
     userData:{
       name:'',
       text:'',
       date:'',
     },
     comPerPage: 3,
     pageNumber: 1
   }
 },
  name: 'App',
  methods: {
    ...mapActions([
     'GET_USERS_FROM_API'
    ]),
    pageClick(page){
      this.pageNumber = page
    },
    selectOptionDate(option){
      this.selectDateSort = option.name;
 
      if (this.selectDateSort === 'Сначала новые')
      {
          this.GET_USERS.sort((a, b) => a.date < b.date ? 1 : -1)  
      }
      if (this.selectDateSort === 'Сначала старые'){
          this.GET_USERS.sort((a, b) => a.date < b.date ? -1 : 1)  
      }
    },
       selectOptionId(option){
      this.selectIdSort = option.name;
 
      if (this.selectIdSort === 'Сначала новые')
      {
        console.log('eeeeeeeeeeeeeeeeeeee')
          this.GET_USERS.sort((a, b) => a.id < b.id ? 1 : -1)  
      }
      if (this.selectIdSort === 'Сначала старые'){
        console.log('ddddddddddddddd')
          this.GET_USERS.sort((a, b) => a.id < b.id ? -1 : 1)  
      }
    },
    validate(){
      if (this.userData.name === ''){
        this.Validate.name = !this.Validate.name
      }
        if (this.userData.text === ''){
        this.Validate.text = !this.Validate.text
      }
        if (this.userData.date === ''){
        this.Validate.date = !this.Validate.date
      }
    },
    //add comment
    async setFunc(){
      this.validate()
      if (this.userData.date != '' && this.userData.text != '' && this.userData.name != '' )
      {
 try {   const res = await fetch('http://localhost/api/comments/', {
      method:'POST',
      headers:{
        'content-Type':'application/json'
      },
      credentials:'include',
      body: JSON.stringify({
        name: this.userData.name,
        text: this.userData.text,
        date: this.userData.date,
      }),
    
    })
    const data = await res.json()
    console.log(data)
    } catch (error){
        console.error(error)
      }
    this.GET_USERS_FROM_API()
      }
     this.userData.name=''
     this.userData.text=''
     this.userData.date=''
    },

  //delete comment
    async deleteUserComm(id){
      await fetch(`http://localhost/api/comments/${id}`, {
        method: 'DELETE'
      })
      this.GET_USERS_FROM_API()
    }
  },
  computed:{
    ...mapGetters([
      'GET_USERS'
    ]),
    pages(){
      return Math.ceil(this.GET_USERS.length / 3)
    },
    paginatedComm(){
      let from = (this.pageNumber - 1) * this.comPerPage
      let to = from + this.comPerPage;
      return this.GET_USERS.slice(from, to)
    }
  },
  mounted(){
   
    this.GET_USERS_FROM_API()
    
      
  }
}

</script>
<style>
*{
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
    #date{
  border:1.5px solid #dddddd;
}
.error{
  color: red;
}
.label{
  margin-bottom: 5px;
}
.inputDate{
  margin-top: 20px;
}
.btn{
  border-radius: 3px;
  cursor: pointer;
  padding: 5px;
  margin-top: 20px;
  background-color: #ffffff;
  border:1px solid #d1d1d1;
  transition: .2s linear;
}
.btn:hover{
  background-color: #b7e5ff;
}
.FlexCont{
  display: flex;
  flex-direction: column;
 
}
.input{
  max-width: 300px;
  border:1.5px solid #dddddd;

}

.container{
  margin: 0 auto;
  max-width: 1200px;
}
textarea{
  resize:none;
  width: 300px;
}
.inner{

  padding: 15px;
  margin: 0 auto;
  
  max-width: 400px ;

}
.innerCom{

  border-bottom: 1px solid #bebebe;
  margin-bottom: 15px;

}
.usersCommHeader{
  display: flex;
  justify-content: space-between;
}
.innerForm{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaeaea;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.userCommName{

  font-size: 20px;
  margin-bottom: 5px;
}
.comm_pagination{
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.page{
  padding: 5px;
  border: 1px solid #e4e4e4;
  margin-right: 5px;
  transition: .2s linear;
}
.page:hover{
  background: #b7e5ff;
  cursor: pointer;
}
.page__selected{
  background: #b7e5ff;
}
.selects{
  display: flex;
  justify-content: center;
}
.selectName{
  display: inline;
  margin-right: 7px;
}
.select_inner{
  display: flex;
  margin-right: 15px;
}
    @media screen and (max-width:470px){
      .selects{
        flex-direction: column;
      }
      textarea{

  width: 280px;
}

     }
</style>