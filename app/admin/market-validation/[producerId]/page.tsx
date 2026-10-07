import React from 'react';
import { producerGrowthService } from '@/services/producer-growth-service';
import MarketValidationClient from './MarketValidationClient';

interface PageProps {
  params: Promise<{ producerId: string }>;
}

export default async function MarketValidationRoomPage({ params }: PageProps) {
  const { producerId } = await params;
  const normalizedId = producerId || 'oca';

  // Server-side retrieval for zero-loading SSR
  const run = producerGrowthService.getProducerRun(normalizedId) || null;
  const initialFeedback = producerGrowthService.getMarketValidationFeedback(normalizedId) || [];
  const initialLearnings = producerGrowthService.getInternalMarketLearning(normalizedId) || [];

  return (
    <MarketValidationClient
      producerId={normalizedId}
      initialRun={run}
      initialFeedback={initialFeedback}
      initialLearnings={initialLearnings}
    />
  );
}
