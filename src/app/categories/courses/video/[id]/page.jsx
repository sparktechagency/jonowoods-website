"use client";

import React from "react";
import { useSingleVidoeQuery } from "../../../../../redux/featured/homeApi.jsx/homeApi";

const page = ({ params }) => {
  const { id } = React.use(params);
  const { data: video, isLoading: videoLoading } = useSingleVidoeQuery(id, { skip: !id });
  console.log(video?.data)
  return (
    <div>
      This is video section
    </div>
  );
};

export default page;