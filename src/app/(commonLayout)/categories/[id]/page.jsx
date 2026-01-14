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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(12);
  const queryParams=[
    {
      name: "page",
      value: currentPage,
    },
    {
      name: "limit",
      value: perPage,
    },
  ]


  const { data: category, isLoading: categoryLoading } = useCategoryWithSubcategoryQuery(id, { skip: !id });
 


  const { data: classVideo, isLoading: classVideoLoading } = useCategoryVideoQuery({
    id,
    params: queryParams,
  });

  if (categoryLoading || classVideoLoading) return <Spinner />

  if (!category?.data?.result.length && !classVideo?.data?.result.length) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Go Another course</p>
      </div>
    )
  }

  if (!classVideo?.data?.result.length) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-600">Go Another Category</p>
      </div>
    )
  }


    const handlePageChange = (page) => {
    const meta = classVideo?.data?.meta;
    if (page >= 1 && page <= meta?.totalPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>


      {
        classVideo?.data?.result.length > 0 && <ClassSilder data={classVideo?.data?.result} handlePageChange={handlePageChange}  />
      }


  {classVideo?.data?.meta?.totalPage > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {classVideo?.data?.meta?.totalPage}
            </span>

            <button
              disabled={currentPage === classVideo?.data?.meta?.totalPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === classVideo?.data?.meta?.totalPage
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Next
            </button>
          </div>
        )}

      {/* {
        category?.data?.result.length > 0 && <CourseSlider data={category?.data?.result} />
      } */}




    </div>
  );
};

export default page;