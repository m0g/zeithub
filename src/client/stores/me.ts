import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Me } from '../../models';
import http from '../http';

export const useMeStore = defineStore('me', () => {
  const me = ref(new Me());

  async function fetchMe() {
    const response = await http('/api/me');
    const data = await response.json();

    if (data.success) {
      me.value = data.me;
    }
  }

  return { me, fetchMe };
});
