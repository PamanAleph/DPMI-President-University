import UsersTable from '@/components/admin/users/UsersTable'
import { GetUserList } from '@/service/api/users'
import React from 'react'

export default async function page() {

  const users = await GetUserList()

  return (
    <section>
     <UsersTable users={users}/>
    </section>
  )
}
