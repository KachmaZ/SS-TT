<template>
  <VContainer class="py-6">
    <VRow justify="space-between">
      <VCol cols="12" sm="3" align-self="center">
        <div class="text-h5 font-weight-bold">Учетные записи</div>
      </VCol>
      <VCol cols="auto">
        <VBtn :icon="'$plus'" color="primary" @click="addLocalAccount"></VBtn
      ></VCol>
    </VRow>

    <VRow>
      <VCol cols="12">
        <VAlert type="info" class="mb-4">
          Введите метки через точку с запятой (;), например: <code>admin;dev;test</code>
        </VAlert>
      </VCol>
    </VRow>

    <TransitionGroup tag="div" name="list-fade">
      <AccountItem
        v-for="account in localAccounts"
        :key="account.id"
        :account="account"
        @delete="removeLocalAccount(account.id)"
        @save="(savedAcc) => saveAccount(savedAcc)"
      />
    </TransitionGroup>
  </VContainer>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores'
import AccountItem from '@/components/AccountItem.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Account } from '@/models'

const accountsStore = useAccountStore()
const { accounts } = storeToRefs(accountsStore)
const localAccounts = ref<Account[]>([...accounts.value])

const addLocalAccount = () => {
  const accountID = crypto.randomUUID()
  localAccounts.value.push({
    id: accountID,
    tags: [],
    type: 'Локальная',
    login: '',
    password: '',
  })
}

const removeLocalAccount = (accountID: string) => {
  localAccounts.value = localAccounts.value.filter((account) => account.id !== accountID)
  removeAccount(accountID)
}

const { removeAccount, saveAccount } = accountsStore
</script>

<style scoped>
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.3s ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
