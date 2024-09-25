import QuestionDetails from '@/components/admin/setup/create/QuestionDetails';
import SectionDetails from '@/components/admin/setup/create/SectionDetails'
import SetupDetails from '@/components/admin/setup/create/SetupDetails';
import React from 'react'

const steps = [
  {
      id: "01",
      name: "Create Setup",
      status: "current",
  },
  {
      id: "02",
      name: "Create Sections",
      status: "upcoming",
  },
  {
      id: "03",
      name: "Create Questions",
      status: "upcoming",
  },
];

export default function page() {
  return (
    <div>
      <SetupDetails/>
      <SectionDetails/>
      <QuestionDetails/>
    </div>
  )
}
