<script setup>
import { storeToRefs } from 'pinia';
import AdministerUser from '~/components/admin/AdministerUser.vue';
import { useFormStore } from '~/store/form';

defineProps({
  u: {
    type: String,
    required: true,
  },
});

const { isRTL, lang } = storeToRefs(useFormStore());
</script>

<template>
  <v-container>
    <h1 class="mt-6" :class="{ 'dir-rtl': isRTL }" :lang="lang">
      {{ $t('trans.admin.user.administerUser') }}
    </h1>

    <AdministerUser :user-id="u" />
  </v-container>
</template>
