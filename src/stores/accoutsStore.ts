import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Account {
  id: string
  label: string
  tags: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(loadFromLocalStorage())

  function addAccount() {
    accounts.value.push({
      id: crypto.randomUUID(),
      label: '',
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
    const tags = account.label
      .split(';')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((text) => ({ text }))

    return {
      ...account,
      tags,
      password: account.type === 'LDAP' ? null : account.password,
    }
  }

  function loadFromLocalStorage(): Account[] {
    try {
      const raw = localStorage.getItem('accounts')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  watch(
    accounts,
    (newVal) => {
      localStorage.setItem('accounts', JSON.stringify(newVal))
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
