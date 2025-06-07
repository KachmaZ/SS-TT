import type { Account } from '@/models'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(loadFromLocalStorage())

  function addAccount(account: Account): void {
    accounts.value.push(sanitizeAccount(account))
  }

  function removeAccount(id: string): void {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  function saveAccount(account: Account): void {
    const index = accounts.value.findIndex((acc) => acc.id === account.id)
    const sanitizedAccount = sanitizeAccount(account)
    if (index !== -1) {
      accounts.value[index] = sanitizedAccount
    } else {
      accounts.value.push(sanitizedAccount)
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
    saveAccount,
  }
})
