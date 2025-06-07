export interface AccountTag {
  text: string
}

export interface AccountData {
  tags: AccountTag[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export interface Account extends AccountData {
  id: string
}
