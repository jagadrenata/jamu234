'use client'
import React from 'react'
import Image from 'next/image'

const WhatsAppFloat = () => {
  return (
    <a href='https://wa.me/62882006186099' target='_blank' rel='noopener noreferrer' className='fixed bottom-5 right-5 w-16 h-16 z-50 hover:scale-110 transition-transform animate-bounce'>
      <Image
        src='/images/WhatsApp.svg.png' // taruh file icon WA di folder public
        alt='WhatsApp'
        width={64}
        height={64}
      />
    </a>
  )
}

export default WhatsAppFloat
