import React from 'react'

interface SectionDetailsProps {
    onNext: () => void;
  }

export default function SectionDetails({onNext}:SectionDetailsProps) {

    onNext()
  return (
    <div>SectionDetails</div>
  )
}
