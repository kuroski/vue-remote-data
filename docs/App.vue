<script setup lang="ts">
import * as RD from "@devexperts/remote-data-ts";
import { onMounted, ref } from "vue";
import { RemoteData } from "../src";

const remoteData = ref<RD.RemoteData<Error, unknown>>(RD.initial);

onMounted(() => {
  setTimeout(() => {
    remoteData.value = RD.pending;
    fetch("https://api.github.com/users123/octocat")
      .then((result) =>
        result.ok ? result.json() : Promise.reject(new Error(result.statusText))
      )
      .then((user) => {
        setTimeout(() => {
          remoteData.value = RD.success(user);
        }, 1000);
      })
      .catch((error: Error) => {
        setTimeout(() => {
          remoteData.value = RD.failure(error);
        }, 1000);
      });
  }, 1000);
});
</script>

<template>
  <RemoteData :remote-data="remoteData">
    <template #initial> Hello world </template>
    <template #pending>Loading...</template>
    <template #failure="failure">
      Oops...
      {{ failure.message }}
    </template>
    <template #success="success">
      Yaay!
      {{ JSON.stringify(success) }}
    </template>
  </RemoteData>
</template>