<script setup lang="ts">
import { createStore } from "vuex";
import MenuBar from "./components/ui/MenuBar.vue";

type StateType = {
  count: number;
};

const mystore = createStore<StateType>({
  state: () => ({
    count: 1,
  }),
  getters: {
    count: (state) => {
      console.log("GETTER count called");
      return state.count;
    },
  },
  mutations: {
    increment: (state, args: { delta: number }) => {
      state.count += args.delta;
    },
  },
});

mystore.commit("increment", { delta: 10 });
const count = mystore.getters.count;

console.log(count);
</script>

<template>
  <div class="w-screen h-screen bg-background flex flex-col">
    <MenuBar />
    <main class="p-4 overflow-auto grow p-4 flex flex-col gap-4">
      <RouterView />
    </main>
  </div>
</template>
