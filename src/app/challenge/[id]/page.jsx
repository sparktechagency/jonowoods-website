"use client";

import React from 'react';
import VideoPlayer from '../../../components/VideoPlayer';
import { useSingleChallengeVideoQuery } from '../../../redux/featured/CommingSoon/commingSoonApi';
import Spinner from '../../(commonLayout)/Spinner';

const page = ({ params }) => {
  const { id } = React.use(params);
  const { data , isLoading } = useSingleChallengeVideoQuery(id, { skip: !id });
  console.log(data?.data);

  return (
    <div>
      {isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />}
    </div>
  );
};

export default page;