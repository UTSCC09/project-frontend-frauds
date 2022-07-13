<script setup>
import FlightSearch from "../components/FlightSearch.vue";
import SearchResult from "../components/SearchResult.vue";
</script>

<template>
  <main>
    <h2 class="page-title">Flight Results</h2>
    <!--<FlightSearch />-->
    <SearchResult />
  </main>
</template>

<style>
.page-title {
  padding-top: 1rem;
  padding-left: 0;
  padding-bottom: 1rem;
  font-weight: bold;
}
</style>
