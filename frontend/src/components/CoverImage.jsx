import React from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const CoverImage = () => {
    const user = useRecoilValue(userAtom);
  return (
    <div className="flex flex-col w-full mb-3">
    <div  className='w-full  h-[100px] relative cover mx-auto' >

        <div className="flex flex-col text-white pl-2">
        <p className="text-slate-300">{user.name}</p>
        <p>{user.bio}</p>
        </div>
        <img  src={user.profilePic} className="absolute w-10 h-10 rounded-full bg-slate-300 -bottom-4 left-2"/>
        </div>
    </div>
  )
}

export default CoverImage