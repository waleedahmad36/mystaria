import React from 'react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

const AddPost = () => {
    const user = useRecoilValue(userAtom);
  return (
    <div   className='px-4 flex w-full justify-between items-center gap-4 '  >

        <img src={user.profilePic} alt=""  className='w-10 h-10 rounded-full'   />

        <div className='h-10 flex-1 bg-gray-900 justify-center flex items-center rounded-lg'  >
        <p>What's on your mind ? {user.username}</p>
        </div>
    </div>
  )
}

export default AddPost