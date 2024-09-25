import React from 'react'

interface QuestionsDetailsProps {
  onNext: () => void;
  
}

export default function QuestionDetails({onNext}:QuestionsDetailsProps) {
  onNext()
  return (
    <div>QuestionDetails</div>
  )
}
