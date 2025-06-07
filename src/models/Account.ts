export interface AccountTag {
  text: string
}

export interface Account {
  id: string
  tags: AccountTag[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}
