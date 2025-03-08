import React from 'react'

export const Buttons = ({label1,label2,reverse}) => {
  return (
    <div className="buttons ">
        {reverse ?<div className='flex gap-6'>
          <div className="button w-24  h-10 border flex items-center justify-center bg-black text-white">
            <button>{label1}</button>
          </div>
            <div className="button w-24 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
          <button>{label2}</button>
        </div>

        
        </div>:<div className='flex gap-6'>
        <div className="button w-24 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
          <button>{label1}</button>
        </div>

          <div className="button w-24  h-10 border flex items-center justify-center bg-black text-white">
            <button>{label2}</button>
          </div>
          </div>}
        
        </div>
  )
}
