import { useState, useEffect } from 'react'
import './loading.css'

import loadingGif from '../../assets/icons/loading.gif';

function Loading({loading}) {

  return (
    loading && 
    <div className='loading'>
        <img src={loadingGif} alt="" />
    </div>
  )
}

export default Loading
