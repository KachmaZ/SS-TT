<template>
  <VCard class="mb-4" elevation="2">
    <VCardText>
      <VForm @submit.prevent>
        <VRow align-content="center">
          <VCol cols="12" sm="3">
            <VTextField
              v-model="getTags"
              label="Метка"
              :error-messages="errors.tags"
              @blur="emitSave"
            />
          </VCol>

          <VCol cols="12" sm="2">
            <VSelect
              v-model="localAccount.type"
              label="Тип"
              :items="['LDAP', 'Локальная']"
              @update:modelValue="onTypeChange"
            />
          </VCol>

          <VCol cols="12" sm="3">
            <VTextField
              v-model="localAccount.login"
              label="Логин"
              :error-messages="errors.login"
              @blur="emitSave"
            />
          </VCol>

          <VCol cols="12" sm="3" v-if="localAccount.type === 'Локальная'">
            <VTextField
              v-model="localAccount.password"
              label="Пароль"
              type="password"
              :error-messages="errors.password"
              @blur="emitSave"
            />
          </VCol>
          <VCol v-else cols="12" sm="3"></VCol>

          <VCol cols="12" sm="1" class="d-flex align-center justify-end">
            <VBtn icon color="error" @click="$emit('delete', account.id)">
              <VIcon icon="mdi-delete" />
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { Account } from '@/models'
import { computed, reactive, watch } from 'vue'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  (e: 'save', account: Account): void
  (e: 'delete', accountId: string): void
}>()

const localAccount = reactive({ ...props.account })
const getTags = computed({
  get() {
    return localAccount.tags.map((item) => item.text).join(';')
  },
  set(newValue) {
    localAccount.tags = newValue.split(';').map((tag) => ({
      text: tag.trim(),
    }))
  },
})

const errors = reactive({
  tags: [] as string[],
  login: [] as string[],
  password: [] as string[],
})

function emitSave() {
  if (!validate()) return
  emit('save', { ...localAccount })
}

function validate() {
  errors.tags = getTags.value.length > 50 ? ['Максимум 50 символов'] : []

  errors.login = []
  if (!localAccount.login) errors.login.push('Обязательное поле')
  if (localAccount.login.length > 100) errors.login.push('Максимум 100 символов')

  errors.password = []
  if (localAccount.type === 'Локальная') {
    if (!localAccount.password) errors.password.push('Обязательное поле')
    if ((localAccount.password || '').length > 100) errors.password.push('Максимум 100 символов')
  }
  return Object.values(errors).every((entity) => entity.length === 0)
}

function onTypeChange() {
  if (localAccount.type === 'LDAP') {
    localAccount.password = null
  }
  emitSave()
}

watch(
  () => props.account,
  (newVal) => {
    Object.assign(localAccount, newVal)
  },
)
</script>
