<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

import { useAuthStore } from '~/store/auth';

const { locale } = useI18n({ useScope: 'global' });

const authStore = useAuthStore();
const { authenticated, ready } = storeToRefs(authStore);

const hasLogin = computed(() => useRoute()?.meta?.hasLogin);

// Tablet (incl. landscape) & mobile: collapse logout/login to icon-only.
// Vuetify's mdAndDown is <1280px — covers phone, portrait tablet, and
// landscape iPad / small laptops; full text shows only on lg+ desktop.
const { mdAndDown } = useDisplay();
const compact = computed(() => mdAndDown.value);
</script>

<template>
  <div v-if="ready" class="d-print-none">
    <v-btn
      v-if="authenticated"
      id="logoutButton"
      color="white"
      variant="outlined"
      :icon="compact"
      :title="$t('trans.baseAuthButton.logout')"
      :aria-label="$t('trans.baseAuthButton.logout')"
      @click="authStore.logout"
    >
      <v-icon v-if="compact">mdi-logout</v-icon>
      <span v-else :lang="locale">{{ $t('trans.baseAuthButton.logout') }}</span>
    </v-btn>
    <v-btn
      v-else-if="hasLogin"
      id="loginButton"
      color="white"
      density="default"
      variant="outlined"
      :icon="compact"
      :title="$t('trans.baseAuthButton.login')"
      :aria-label="$t('trans.baseAuthButton.login')"
      @click="authStore.login"
    >
      <v-icon v-if="compact">mdi-login</v-icon>
      <span v-else :lang="locale">{{ $t('trans.baseAuthButton.login') }}</span>
    </v-btn>
  </div>
</template>

<style scoped>
.v-btn {
  height: 40px;
}
</style>
