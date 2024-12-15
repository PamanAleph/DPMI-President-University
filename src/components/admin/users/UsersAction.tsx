import React from 'react'
import Button from '../Button'

export default function UsersAction() {
  return (
    <section className='flex gap-2 justify-center items-center'>
      <Button className='bg-yellow-300 text-white hover:bg-yellow-200 duration-300'>Edit</Button>
      <Button>Delete</Button>
    </section>
  )
}
