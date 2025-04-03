import React from 'react'

export const Tittle = ({title,subTitle}) => {
  return (
    <div className='p-2 space-x-1'>
        <h1 className='font-bold text-5xl px-3 text-center'>{title}</h1>
        <h4 className='font-base text-lg text-center py-4 px-2'>{subTitle}</h4>
    </div>
  )
}
