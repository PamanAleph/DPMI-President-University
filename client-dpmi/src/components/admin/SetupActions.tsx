// "use client";
// import Swal from "sweetalert2";
// import Button from "./Button";
// import React from "react";
// import { deleteMajor, updateMajor } from "@/service/api/major";
// import Setup from "@/models/setup";

// interface SetupActionsProps {
//   setupId: number;
//   setup: Setup;
// }

// export default function SetupActions({ setupId, setup }: SetupActionsProps) {
//   const handleEditSetup = async () => {
//     const { value: majorData } = await Swal.fire({
//       title: "Edit setup",
//       html: `<input type="text" id="setup-name" class="swal2-input" value="${setup.name}" placeholder="Setup Name"/>
//                  <input type="text" id="setup-semester" class="swal2-input" value="${setup.semester}" placeholder="Setup Semester ex (20221)"/>
//                  <input type="text" id="setup-major" class="swal2-input" value="${setup.major_id}" placeholder="Emails (comma separated)"/>
//                  <input type="text" id="setup-start-date" class="swal2-input" value="${setup.start_date}" placeholder="Start Date"/>
//                  <input type="text" id="setup-end-date class="swal2-input" value="${setup.end_date}" placeholder="End Date"/>`,
//       focusConfirm: false,
//       preConfirm: () => {
//         const major_name = (
//           document.getElementById("setup-name") as HTMLInputElement
//         )?.value;
//         const major_head = (
//           document.getElementById("major-head") as HTMLInputElement
//         )?.value;
//         const emails = (
//           document.getElementById("emails") as HTMLInputElement
//         )?.value
//           .split(",")
//           .map((email) => email.trim());

//         if (!major_name || !major_head || !emails.length) {
//           Swal.showValidationMessage("Please fill all fields");
//         }

//         return { major_name, major_head, emails };
//       },
//       showCancelButton: true,
//       confirmButtonText: "Update",
//       cancelButtonText: "Cancel",
//     });

//     if (majorData) {
//       try {
//         await updateMajor({ ...major, ...majorData });
//         Swal.fire("Updated!", "The major has been updated.", "success").then(
//           () => {
//             window.location.reload();
//           }
//         );
//       } catch {
//         Swal.fire("Error", "Failed to update the major.", "error");
//       }
//     }
//   };

//   const handleDeleteMajor = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this major? This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await deleteMajor(majorId);
//           Swal.fire("Deleted!", "The major has been deleted.", "success").then(
//             () => {
//               window.location.reload();
//             }
//           );
//         } catch {
//           Swal.fire("Error", "Failed to delete the major.", "error");
//         }
//       }
//     });
//   };

//   return (
//     <>
//       <Button className="bg-yellow-400 text-white" onClick={handleEditMajor}>
//         Edit
//       </Button>
//       <Button
//         className="bg-red-400 text-white"
//         onClick={() => handleDeleteMajor()}
//       >
//         Delete
//       </Button>
//     </>
//   );
// }
