import React from 'react';
import { producerGrowthService } from '@/services/producer-growth-service';
import ReviewRoomClient from './ReviewRoomClient';

interface PageProps {
  params: Promise<{ producerId: string }>;
}

export default async function ProducerGrowthReviewRoomPage({ params }: PageProps) {
  const { producerId } = await params;
  const normalizedId = producerId || 'oca';

  // Retrieve existing run and feedback directly on server (SSR)
  const run = producerGrowthService.getProducerRun(normalizedId) || null;
  const feedback = producerGrowthService.getUatFeedback(normalizedId) || [];

  return (
    <ReviewRoomClient
      producerId={normalizedId}
      initialRun={run}
      initialFeedback={feedback}
    />
  );
}
