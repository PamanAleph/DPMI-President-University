import EvaluationTable from '@/components/admin/evaluations/EvaluationTable';
import { fetchEvaluations } from '@/service/api/evaluation'
import React from 'react'

export default async function page() {
    const evaluation = await fetchEvaluations();
  return (
    <>
    <EvaluationTable evaluations={evaluation} />

    </>
  )
}
