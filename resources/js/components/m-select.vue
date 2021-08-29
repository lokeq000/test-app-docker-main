<template>
    <div class="m-select">
        <p 
        class="title"
        @click="areOptionsVisible = !areOptionsVisible"
        >{{selected}}</p>
        <div 
        class="options"
        v-if='areOptionsVisible'
        >
            <p 
            class='m-select-p'
            v-for='option in options'
            :key='option.value'
            @click="selectOption(option)"
            >
     {{option.name}} 
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name:'m-select',
        props:{
            selected:{
                type:String,
                default: '',
            },
            options:{
                type:Array,
                default(){return []}
            }
        },
        data(){
            return{
                areOptionsVisible:false,
            }
        },
        methods:{
            selectOption(option){
                this.$emit('select', option)
       
                this.areOptionsVisible = false;

            },
            hideSelect(){
                  this.areOptionsVisible = false;
            }
        },
        mounted(){
            document.addEventListener('click',this.hideSelect.bind(this), true)
        },
        beforeDestroy(){
            document.removeEventListener('click',this.hideSelect)
        }
    }
</script>

<style>
.m-select{
    margin-bottom: 15px;
}
.m-select-p{
margin:0;
cursor: pointer;
}
.title{
    border: solid 1px #aeaeae;
}
.m-select{
    position: relative;
    width: 150px;
}
.options{
    border: solid 1px #aeaeae;
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 40px;
    right: 0;
    width: 100%;
}
.options p:hover{
    background: #e7e7e7;
}
</style>