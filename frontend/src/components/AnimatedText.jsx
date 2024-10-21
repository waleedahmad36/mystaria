
import { useRecoilValue } from 'recoil';
import themeAtom from '../atoms/themeAtom';



const AnimatedText = () => {
  const theme = useRecoilValue(themeAtom);


  return (
    <>
    <div>
    <div className='flex gap-2 absolute -bottom-40'  >
        <img src="https://media.licdn.com/dms/image/v2/D4D03AQEJONB2vmLTxw/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1727368631041?e=1735171200&v=beta&t=sAyudqtVrbswGoEPRTIqJp6H0NfOAPoo0_319sHCUq0" alt=""  className='w-10 h-10 rounded-full'   />
        <p  className='text-balance'  >All rights reserved by <span  style={{color:theme}}  >@Mystaria owners</span></p>
      </div>
      </div>
    </>
  );
};

export default AnimatedText;
