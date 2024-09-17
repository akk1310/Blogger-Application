import React from 'react'
// import {bg1} from '../assets/logo.png'

function Logo({width = '100px'}) {
  return (
    <img className='mt-2 mx-auto' width={width} src="src/assets/logo.png" alt="Logo" />
  )
}

export default Logo