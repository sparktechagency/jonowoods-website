"use client";

import ClassSilder from '@/components/Category/ClassSilder';
import CourseSlider from '@/components/Category/CourseSlider';
import { useCategoryVideoQuery, useCategoryWithSubcategoryQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import { Search } from 'lucide-react';
import React from 'react';
import Spinner from '../../Spinner';
// import Spinner from '../../(commonLayout)/Spinner';
// import ClassSilder from '../../../components/Category/ClassSilder';
// import CourseSlider from '../../../components/Category/CourseSlider';
// import { useCategoryVideoQuery, useCategoryWithSubcategoryQuery } from '../../../redux/featured/homeApi.jsx/homeApi';

const page = ({ params }) => {
  const { id } = React.use(params);

  const { data: category, isLoading: categoryLoading } = useCategoryWithSubcategoryQuery(id, { skip: !id });
  console.log(category?.data?.result)

  const { data: classVideo, isLoading: classVideoLoading } = useCategoryVideoQuery(id, { skip: !id });
  console.log(classVideo?.data?.result)

  if (categoryLoading || classVideoLoading) return <Spinner />

  if (!category?.data?.result.length && !classVideo?.data?.result.length) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Try Another course</p>
      </div>
    )
  }

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