import { Spin } from 'antd'
import React from 'react'

function CustomButton({ className='btn btn-blue' ,text, loader, onClick}) {
  return (
    <button onClick={onClick} htmlType="submit" className={className} disabled={loader}> { loader == false ? text: <Spin/>}</button>
  )
}

export default CustomButton