<script setup lang="ts">
import { ref } from 'vue';
import styled from 'vue3-styled-components';
import { logfoo } from './logfoo';

logfoo();


defineProps<{ msg: string }>();

const GreenH1 = styled.h1`
  color: green;
  background: red;
`;

const items = ref([
  {
    completed: false,
    description: 'Doing the dishes',
    id: crypto.randomUUID()
  }
]);

const currentText = ref('');

const addItem = (e: Event) => {
  e.preventDefault();
  items.value.push({
    completed: false,
    description: currentText.value,
    id: crypto.randomUUID()
  });
  currentText.value = '';
}


const removeItem = (id: string) => {
  items.value = items.value.filter(item => item.id != id);
}
</script>

<template>
  <GreenH1>{{ msg }}</GreenH1>
  <ul>
    <li @click="removeItem(item.id)" v-for="item in items">
      {{item.description}}
    </li>
  </ul>
  <form @submit="addItem($event)">
    <input id="todo-input" v-model="currentText" placeholder="Write something..."/> 
    <button >Add Item</button>
  </form>

</template>

<style lang="sass" scoped>
  .read-the-docs 
    color: #888
  

  ul 
    display: block
    text-align: left
  

  li 
    cursor: pointer
    width: 200px

  

  li:hover
    text-decoration: underline
    opacity: 0.8
    position: relative
  

  li:hover::after 
    content: 'x'
    position: absolute
    right: 0
    top: 0
    color: red
  

  button 
    display: block
    margin: auto
    margin-top: 1rem
  
</style>
