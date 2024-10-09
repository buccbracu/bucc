import React from 'react'

interface PolicyContainerProps{
    title:string
    description:string
}
const PolicyContainer = (props:PolicyContainerProps) => {
  return (
    <div className='my-10'>
        <h1 className='text-lg md:text-xl font-bold'>{props.title}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{props.description}</p>
    </div>
  )
}

export default PolicyContainer