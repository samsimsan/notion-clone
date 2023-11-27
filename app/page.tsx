"use client"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className='text-center text-gray-700 mt-[30vh] leading-10'>
      <h2 className='text-xl font-semibold'>This is the begining of the Notion Clone Saga</h2>
      <p className='text-sm text-gray-400'>filled with long hard hours of grinding and eyes that bled. Behold...</p>
      <h1 className='font-serif text-6xl text-gray-800 font-bold my-5'>Sam's Notion Clone</h1>
      <Button variant="sam" size="lg" className="font-semibold">
        The Button
      </Button>
    </main>
  )
}
