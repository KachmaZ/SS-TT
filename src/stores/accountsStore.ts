import type { Account } from '@/models'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(loadFromLocalStorage())

  function addAccount() {
    accounts.value.push({
      id: crypto.randomUUID(),
      tags: [],
      type: 'Локальная',
      login: '',
      password: '',
    })
  }

  function removeAccount(id: string) {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  function updateAccount(updated: Account) {
    const index = accounts.value.findIndex((acc) => acc.id === updated.id)
    if (index !== -1) {
      accounts.value[index] = sanitizeAccount(updated)
    }
  }

  function sanitizeAccount(account: Account): Account {
    return {
      ...account,
      password: account.type === 'LDAP' ? null : account.password,
    }
  }

  function loadFromLocalStorage(): Account[] {
    try {
      const raw = localStorage.getItem('ss-tt-accounts')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  watch(
    accounts,
    (newVal) => {
      localStorage.setItem('ss-tt-accounts', JSON.stringify(newVal))
    },
    { deep: true },
  )

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
  }
})
