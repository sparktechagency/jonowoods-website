// "use client";
// import { baseUrlApi } from "@/redux/baseUrl/baseUrlApi";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function CategoriesPage() {
//   const router = useRouter();
//   const { data, isLoading, isError } = useGetCategoryQuery();

//   if (isLoading) {
//     return (
//       <section className="container mx-auto mt-10">
//         <h2 className="text-xl font-semibold mb-4">All Categories</h2>
//         <p className="text-center text-gray-500">Loading categories...</p>
//       </section>
//     );
//   }

//   if (isError) {
//     return (
//       <section className="container mx-auto mt-10">
//         <h2 className="text-xl font-semibold mb-4">All Categories</h2>
//         <p className="text-center text-red-500">
//           Failed to load categories. Please try again later.
//         </p>
//       </section>
//     );
//   }

//   return (
//     <section className="container mx-auto mt-10">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">All Categories</h2>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
//         {data?.data.map((category) => (
//           <div
//             key={category._id}
//             className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
//             onClick={() => router.push(`/categories/${category._id}`)}
//           >
//             <Link href={`/categories/${category._id}`}>
//               <div className="relative w-full h-full">
//                 {/* Category Image */}
//                 <Image
//                   src={`${baseUrlApi}${category.thumbnail}`}
//                   alt={category.name}
//                   layout="fill"
//                   objectFit="cover"
//                   className="absolute inset-0 w-full h-full"
//                 />
//                 {/* Gradient Overlay */}
//                 <div
//                   className="absolute inset-0 bg-gradient-to-t"
//                   style={{
//                     backgroundImage:
//                       "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
//                   }}
//                 />
//                 {/* Category Name */}
//                 <div className="absolute inset-0 flex items-end p-4">
//                   <h3 className="text-white font-medium text-lg">
//                     {category.name}
//                   </h3>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }