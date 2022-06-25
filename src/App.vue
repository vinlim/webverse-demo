<template>
  <RouterView />
</template>

<script>

import MoralisService from "./services/MoralisService";
export default {
  setup() {
    MoralisService.init();
  },
}
</script>
