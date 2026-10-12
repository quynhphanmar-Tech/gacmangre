/**
 * GẠC MĂNG RÊ — Test T4: Alias Slug Resolution (getNganBySlug)
 *
 * Tiêu chuẩn duyệt:
 * - Gọi THẬT hàm getNganBySlug('cacao-oca') trong hai trường hợp:
 *   (a) Không có Supabase (mock)
 *   (b) Có Supabase với client giả trả về một Ngăn
 * - Ở (b), kiểm tra truy vấn gửi đi dùng canonical slug: 'cacao-len-men-thu-cong-oca'
 * - Dữ liệu trả về đúng Ngăn tương ứng.
 */

import { spawnSync } from 'child_process';

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✅ PASS: ${message}`);
}

async function run() {
  console.log('================================================================');
  console.log('🧪 TEST T4: KIỂM TRA ALIAS SLUG KHI GỌI THẬT getNganBySlug');
  console.log('================================================================\n');

  // -------------------------------------------------------------------------
  // CASE (A): KHÔNG CÓ SUPABASE (MOCK BRANCH)
  // -------------------------------------------------------------------------
  console.log('▶ [Trường hợp a]: Không có Supabase (nhánh Mock fallback)');

  const scriptA = `
    (async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { isSupabaseConfigured } = await import('./lib/supabase/client.ts');
      const { getNganBySlug } = await import('./services/ngan-service.ts');

      const result = await getNganBySlug('cacao-oca');
      console.log(JSON.stringify({
        isSupabaseConfigured,
        slugReceived: result?.slug,
        numberReceived: result?.number,
        titleReceived: result?.title
      }));
    })();
  `;

  const procA = spawnSync('npx', ['tsx', '-e', scriptA], {
    encoding: 'utf-8',
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: '' },
  });

  if (procA.status !== 0) {
    console.error('Lỗi thực thi Case A:', procA.stderr);
    process.exit(1);
  }

  const outputA = JSON.parse(procA.stdout.trim().split('\n').pop());
  console.log('  • Input: "cacao-oca"');
  console.log('  • isSupabaseConfigured:', outputA.isSupabaseConfigured);
  console.log('  • Canonical slug trả về:', outputA.slugReceived);
  console.log('  • Mã Ngăn trả về:', outputA.numberReceived);
  console.log('  • Tên Ngăn:', outputA.titleReceived);

  assert(outputA.isSupabaseConfigured === false, 'Xác nhận Supabase không bật');
  assert(outputA.slugReceived === 'cacao-len-men-thu-cong-oca', 'Mock trả về đúng canonical slug: cacao-len-men-thu-cong-oca');
  assert(outputA.numberReceived === '#001', 'Mock trả về đúng Ngăn #001');

  // -------------------------------------------------------------------------
  // CASE (B): CÓ SUPABASE VỚI CLIENT GIẢ (SUPABASE BRANCH)
  // -------------------------------------------------------------------------
  console.log('\n▶ [Trường hợp b]: Có Supabase với client giả (nhánh Supabase query)');

  const scriptB = `
    (async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-supabase-test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key-12345';

      const clientModule = await import('./lib/supabase/client.ts');

      let capturedQuery = {};
      const fakeDbRow = {
        id: 'db-row-ngan-001',
        number: '#001',
        slug: 'cacao-len-men-thu-cong-oca',
        title: 'Cacao Lên Men Thủ Công OCA (Bản ghi từ DB Supabase)',
        price: 280000,
        status: 'OPEN'
      };

      // Cài đặt client giả trên clientModule.supabase
      clientModule.supabase.from = (table) => {
        capturedQuery.table = table;
        return {
          select: (cols) => ({
            eq: (col, val) => {
              capturedQuery.column = col;
              capturedQuery.value = val;
              return {
                single: async () => ({
                  data: fakeDbRow,
                  error: null
                })
              };
            }
          })
        };
      };

      const { getNganBySlug } = await import('./services/ngan-service.ts');
      const result = await getNganBySlug('cacao-oca');

      console.log(JSON.stringify({
        isSupabaseConfigured: clientModule.isSupabaseConfigured,
        capturedQuery,
        resultFromDb: result
      }));
    })();
  `;

  const procB = spawnSync('npx', ['tsx', '-e', scriptB], {
    encoding: 'utf-8',
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: 'https://fake-supabase-test.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fake-anon-key-12345' },
  });

  if (procB.status !== 0) {
    console.error('Lỗi thực thi Case B:', procB.stderr);
    process.exit(1);
  }

  const outputB = JSON.parse(procB.stdout.trim().split('\n').pop());
  console.log('  • Input: "cacao-oca"');
  console.log('  • isSupabaseConfigured:', outputB.isSupabaseConfigured);
  console.log('  • Bắt vết truy vấn Supabase:', outputB.capturedQuery);
  console.log('  • Dữ liệu trả về từ hàm thật:', {
    id: outputB.resultFromDb.id,
    number: outputB.resultFromDb.number,
    slug: outputB.resultFromDb.slug,
    title: outputB.resultFromDb.title
  });

  assert(outputB.isSupabaseConfigured === true, 'Xác nhận Supabase đã bật');
  assert(outputB.capturedQuery.table === 'ngans', 'Truy vấn gửi đến bảng "ngans"');
  assert(outputB.capturedQuery.column === 'slug', 'Lọc theo cột "slug"');
  assert(
    outputB.capturedQuery.value === 'cacao-len-men-thu-cong-oca',
    'Truy vấn gửi đi đúng canonical slug: cacao-len-men-thu-cong-oca (không bị lệch "cacao-oca")'
  );
  assert(
    outputB.resultFromDb.id === 'db-row-ngan-001' && outputB.resultFromDb.title.includes('Bản ghi từ DB Supabase'),
    'Kết quả hàm thật trả về đúng bản ghi từ Supabase client'
  );

  console.log('\n================================================================');
  console.log('🎉 KẾT LUẬN: ĐẠT (PASS) — CẢ 2 TRƯỜNG HỢP GỌI THẬT ĐỀU ĐẠT TIÊU CHUẨN DUYỆT T4');
  console.log('================================================================');
}

run();
