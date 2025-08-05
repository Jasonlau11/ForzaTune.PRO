<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <NavBar />
    <main class="pt-16">
      <router-view />
    </main>
    <Footer />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
</script> 