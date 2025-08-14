import React from 'react';
import { SearchBar } from './search-bar';

export const ForYouNavbar = () => {
  return (
    <nav className='h-20 w-full border-b-2'>
      <div className='relative mx-auto flex h-full w-full max-w-[1070px] items-center justify-end px-8'>
        <SearchBar />
      </div>
    </nav>
  );
};