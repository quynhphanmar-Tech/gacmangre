import { CaptureJob, ExtractedOrderRecord, CaptureStatus } from '@/types';
import { mockOrdersStore } from '@/lib/data/mock-data';

// In-Memory store for Capture Jobs
export const captureJobsStore: CaptureJob[] = [];

export class CaptureService {
  /**
   * Simulates capturing raw unstructured text from Excel/Image/PDF.
   * Employs OCR / AI extraction parsing customer name, phone, product, quantity.
   * Matches candidate orders with confidence scores.
   * Strictly flags status as 'CAPTURED' or 'NEEDS_HUMAN_REVIEW' (never automatically marks as VERIFIED).
   */
  static processRawText(
    fileName: string,
    fileType: CaptureJob['file_type'],
    producerId: string,
    rawLines: string[]
  ): CaptureJob {
    const jobId = `cap-${Date.now()}`;
    const records: ExtractedOrderRecord[] = rawLines.map((line, idx) => {
      // Basic heuristic extraction
      const phoneMatch = line.match(/(0|\+84)[3|5|7|8|9][0-9]{8}/);
      const phone = phoneMatch ? phoneMatch[0] : undefined;

      // Extract quantity number
      const qtyMatch = line.match(/([0-9]+)\s*(phần|hũ|gói|chai|khay)/i);
      const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

      // Match against confirmed orders in database
      const matchedOrder = phone
        ? mockOrdersStore.find((o) => o.customer?.phone === phone || o.customer?.phone?.includes(phone))
        : undefined;

      const confidence = matchedOrder ? 0.92 : phone ? 0.65 : 0.35;
      const status: ExtractedOrderRecord['status'] = matchedOrder
        ? 'MATCHED'
        : 'NEEDS_HUMAN_REVIEW';

      return {
        id: `rec-${jobId}-${idx}`,
        raw_text: line,
        extracted_customer_name: matchedOrder?.customer?.name || 'Người nhận',
        extracted_phone: phone,
        extracted_product: matchedOrder?.ngan?.title || 'Sản vật',
        extracted_quantity: quantity,
        extracted_address: matchedOrder?.customer?.address || 'Địa chỉ ghi nhận',
        matched_order_id: matchedOrder?.id,
        matched_order_code: matchedOrder?.order_code,
        confidence_score: confidence,
        status,
      };
    });

    const hasUncertainty = records.some((r) => r.status === 'NEEDS_HUMAN_REVIEW');

    const job: CaptureJob = {
      id: jobId,
      file_name: fileName,
      file_type: fileType,
      producer_id: producerId,
      status: hasUncertainty ? 'NEEDS_HUMAN_REVIEW' : 'MATCHED',
      records,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    captureJobsStore.unshift(job);
    return job;
  }

  /**
   * Human review confirms an extracted record and synchronizes to Fulfillment.
   */
  static confirmRecord(jobId: string, recordId: string, matchedOrderCode: string): boolean {
    const job = captureJobsStore.find((j) => j.id === jobId);
    if (!job) return false;

    const rec = job.records.find((r) => r.id === recordId);
    if (!rec) return false;

    rec.matched_order_code = matchedOrderCode;
    rec.status = 'CONFIRMED';
    job.updated_at = new Date().toISOString();

    if (job.records.every((r) => r.status === 'CONFIRMED' || r.status === 'MATCHED')) {
      job.status = 'CONFIRMED';
    }

    return true;
  }

  static getJob(id: string): CaptureJob | null {
    return captureJobsStore.find((j) => j.id === id) || null;
  }

  static getAllJobs(): CaptureJob[] {
    return captureJobsStore;
  }
}
