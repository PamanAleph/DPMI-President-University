// import Button from "@/components/admin/Button";
// import Setup from "@/models/setup";
// import { fetchSetupBySlug } from "@/service/api/setup";
// import Link from "next/link";
// import { redirect } from "next/navigation";
// import React from "react";

// interface SetupDetailsPageProps {
//   params: { slug: string };
// }

// export default async function SetupDetailsPage({
//   params,
// }: SetupDetailsPageProps) {
//   if (!params.slug || params.slug.length < 1) {
//     return redirect("/404");
//   }

//   const setup: Setup | null = await fetchSetupBySlug(params.slug);

//   if (!setup) {
//     return redirect("/404");
//   }

//   return (
//     <section>
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Setup Details</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">
//             Setup Name
//           </h2>
//           <p className="text-lg text-gray-600">{setup.name}</p>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Semester</h2>
//           <p className="text-lg text-gray-600">{setup.}</p>
//         </div>

//         <div className="md:col-span-2">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Major(s)</h2>
//           <ul className="list-disc pl-6 text-lg text-gray-600">
//             {setup.major_name.map((major, index) => (
//               <li key={index}>{major}</li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">
//             Start Date
//           </h2>
//           <p className="text-lg text-gray-600">
//             {new Date(setup.start_date).toLocaleDateString()}
//           </p>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">End Date</h2>
//           <p className="text-lg text-gray-600">
//             {new Date(setup.end_date).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       <div className="mt-6">
//         <Link href="/admin/setup">
//           <Button className="bg-green-600 text-white rounded-md hover:bg-green-700">
//             Back to Setup List
//           </Button>{" "}
//         </Link>
//       </div>
//     </section>
//   );
// }
