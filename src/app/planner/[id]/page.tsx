'use client';

import { useParams } from 'next/navigation';
import { PlannerView } from '@/components/planner/planner-view';

export default function PlannerPage() {
  const params = useParams();
  const id = params.id as string;

  return <PlannerView planId={id} />;
}
