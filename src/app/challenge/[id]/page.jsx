"use client";

import React from 'react';
import VideoPlayer from '../../../components/VideoPlayer';
import { useSingleChallengeVideoQuery } from '../../../redux/featured/CommingSoon/commingSoonApi';

const page = ({ params }) => {
  const { id } = React.use(params);
  const { data , isLoading } = useSingleChallengeVideoQuery(id, { skip: !id });
  console.log(data?.data);

  return (
    <div>
      {isLoading ? <div className='h-[400px] flex justify-center items-center text-2xl font-bold'>Loading...</div> : <VideoPlayer data={data?.data} />}
    </div>
  );
};

export default page;