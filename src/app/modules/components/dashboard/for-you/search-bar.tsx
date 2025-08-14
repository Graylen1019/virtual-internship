import { BiSearchAlt2 } from "react-icons/bi";

export const SearchBar = () => {
    return ( 
        <div className='relative flex w-full max-w-[340px] items-center gap-2'>
          <input
            className=' text-sm font-medium tracking-tight h-[40px] w-full rounded-sm border-2 border-[#e1e7ea] bg-[#f1f6f4] px-4 pr-12 text-[#042330]'
            type='text'
            placeholder='Search for books'
          />
          <div className='absolute right-0 flex h-full items-center justify-center border-l-2 border-[#e1e7ea] px-2'>
            <BiSearchAlt2 size={24} />
          </div>
        </div>
    );
}