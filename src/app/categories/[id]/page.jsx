"use client";

import React from 'react';
import ClassSilder from '../../../components/Category/ClassSilder';
import CourseSlider from '../../../components/Category/CourseSlider';
import { useCategoryVideoQuery, useCategoryWithSubcategoryQuery } from '../../../redux/featured/homeApi.jsx/homeApi';
import Spinner from '../../(commonLayout)/Spinner';

const page = ({ params }) => {
  const { id } = React.use(params);

  const { data: category, isLoading: categoryLoading } = useCategoryWithSubcategoryQuery(id, { skip: !id });

  const { data: classVideo, isLoading: classVideoLoading } = useCategoryVideoQuery(id, { skip: !id });

  // console.log(category?.data?.result[0].categoryId._id);

  if (categoryLoading || classVideoLoading) return <Spinner />

  return (
    <div>


      {
        classVideo?.data?.result.length > 0 && <ClassSilder data={classVideo?.data?.result} />
      }

      {
        category?.data?.result.length > 0 && <CourseSlider data={category?.data?.result} />
      }




    </div>
  );
};

export default page;