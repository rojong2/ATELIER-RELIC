-- =============================================
-- ATELIER RELIC Seed Data
-- 초기 목데이터 삽입
-- =============================================

-- =============================================
-- PRODUCTS (상품 데이터)
-- =============================================

INSERT INTO products (id, name, price, origin, era, image_url, description, stock, is_active) VALUES
(1, 'Copenhagen Lounge Chair', 950000, 'Copenhagen, Denmark', '1960s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product1.png', '덴마크 코펜하겐에서 제작된 1960년대 빈티지 라운지 체어입니다. 미드센추리 모던 스타일의 우아한 곡선과 편안한 착석감이 특징입니다.', 5, TRUE),
(2, 'Baroque Accent Chair', 1850000, 'Milan, Italy', '1940s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product2.png', '이탈리아 밀라노에서 제작된 1940년대 바로크 스타일 액센트 체어입니다. 화려한 조각 디테일과 고급스러운 패브릭이 특징입니다.', 3, TRUE),
(3, 'Green Heritage Chair', 1200000, 'Vienna, Austria', 'Early 20th Century', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product3.png', '오스트리아 비엔나에서 제작된 20세기 초반 헤리티지 체어입니다. 깊은 그린 컬러와 클래식한 실루엣이 돋보입니다.', 4, TRUE),
(4, 'Nordic Reclining Lounge Chair', 2600000, 'Aarhus, Denmark', '1960s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product4.png', '덴마크 오르후스에서 제작된 1960년대 북유럽 리클라이닝 라운지 체어입니다. 인체공학적 설계와 최상의 편안함을 제공합니다.', 2, TRUE),
(5, 'Provincial Display Cabinet', 4200000, 'Provence, France', '1930s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product5.png', '프랑스 프로방스에서 제작된 1930년대 프로빈셜 스타일 디스플레이 캐비닛입니다. 섬세한 조각과 유리 도어가 특징입니다.', 1, TRUE),
(6, 'Blue Velvet Salon Chair', 2100000, 'Paris, France', '1950s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product6.png', '프랑스 파리에서 제작된 1950년대 살롱 체어입니다. 고급 블루 벨벳 패브릭과 우아한 곡선이 특징입니다.', 3, TRUE),
(7, 'Victorian Leather Lounge Chair', 2800000, 'Manchester, England', 'Late 19th Century', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product7.png', '영국 맨체스터에서 제작된 19세기 후반 빅토리안 스타일 레더 라운지 체어입니다. 고급 가죽과 버튼 터프팅이 특징입니다.', 2, TRUE),
(8, 'Florence Pattern Armchair', 1450000, 'Florence, Italy', '1970s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product8.png', '이탈리아 피렌체에서 제작된 1970년대 패턴 암체어입니다. 화려한 패턴 패브릭과 모던한 라인이 특징입니다.', 4, TRUE),
(9, 'Louis Tufted Loveseat', 3200000, 'Lyon, France', '1920s', 'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/products/product9.png', '프랑스 리옹에서 제작된 1920년대 루이 스타일 터프티드 러브시트입니다. 클래식한 버튼 터프팅과 우아한 실루엣이 특징입니다.', 2, TRUE);

-- 시퀀스 업데이트 (ID 자동 증가 값 조정)
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- =============================================
-- MAGAZINES (매거진 데이터)
-- =============================================

INSERT INTO magazines (id, title, description, content, image_url, is_published, published_at) VALUES
(1, 'Quiet Contrast Living', 
   'Warm-toned vintage seating balances bold color and classic cabinetry.',
   '따뜻한 톤의 빈티지 가구가 대담한 컬러와 클래식 캐비닛 사이에서 조화를 이루는 공간을 소개합니다. 빈티지 가구는 단순히 오래된 물건이 아닌, 시간이 지나도 변치 않는 가치를 지닌 예술품입니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine1.jpg', TRUE, NOW() - INTERVAL '30 days'),

(2, 'Timeless Salon Arrangement', 
   'Classic European silhouettes create a refined yet welcoming living space.',
   '클래식 유럽풍 실루엣이 만들어내는 세련되면서도 따뜻한 거실 공간을 소개합니다. 전통적인 디자인 요소들이 현대적인 공간에서 어떻게 조화를 이루는지 살펴봅니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine2.jpg', TRUE, NOW() - INTERVAL '25 days'),

(3, 'Layered Vintage Comfort', 
   'Soft textures and mid-century forms bring warmth into a modern interior.',
   '부드러운 텍스처와 미드센추리 폼이 모던 인테리어에 따뜻함을 더하는 방법을 소개합니다. 레이어드 스타일링으로 깊이감 있는 공간을 연출하는 팁을 공유합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine3.jpg', TRUE, NOW() - INTERVAL '20 days'),

(4, 'Heritage Meets Modern', 
   'Traditional furniture pieces add depth to contemporary architectural details.',
   '전통 가구가 현대 건축 디테일에 깊이를 더하는 방식을 탐구합니다. 과거와 현재의 조화로운 만남이 만들어내는 독특한 공간 미학을 소개합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine4.jpg', TRUE, NOW() - INTERVAL '15 days'),

(5, 'Collected Corners', 
   'Vintage storage and analog objects create a calm, lived-in atmosphere.',
   '빈티지 수납장과 아날로그 오브제가 만들어내는 차분하고 생활감 있는 분위기를 소개합니다. 수집의 미학과 큐레이션의 중요성을 이야기합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine5.jpg', TRUE, NOW() - INTERVAL '12 days'),

(6, 'Classic Domestic Scene', 
   'Antique cabinetry and decorative accents evoke a sense of everyday nostalgia.',
   '앤티크 캐비닛과 장식적인 액센트가 불러일으키는 일상의 향수를 담은 공간을 소개합니다. 클래식한 가정의 풍경이 주는 편안함과 아름다움을 탐구합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine6.jpg', TRUE, NOW() - INTERVAL '10 days'),

(7, 'Mid-Century Revival', 
   'Wooden furniture and geometric elements redefine retro living.',
   '우든 가구와 기하학적 요소가 레트로 리빙을 재정의하는 방식을 소개합니다. 미드센추리 모던의 부활과 현대적 재해석에 대해 이야기합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine7.jpg', TRUE, NOW() - INTERVAL '7 days'),

(8, 'Warm Minimal Vintage', 
   'Balanced composition highlights the harmony between nature and furniture.',
   '균형 잡힌 구성이 자연과 가구 사이의 조화를 강조하는 공간을 소개합니다. 따뜻한 미니멀리즘과 빈티지의 만남이 만들어내는 고요한 아름다움을 탐구합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine8.jpg', TRUE, NOW() - INTERVAL '3 days'),

(9, 'Editorial Vintage Space', 
   'Curated pieces transform the interior into a quiet design narrative.',
   '큐레이팅된 피스들이 인테리어를 조용한 디자인 내러티브로 변환하는 방식을 소개합니다. 에디토리얼한 접근으로 공간에 이야기를 담는 방법을 공유합니다.',
   'https://izwpcvdaakijsodjyppe.supabase.co/storage/v1/object/public/magazine/magazine9.jpg', TRUE, NOW() - INTERVAL '1 day');

-- 시퀀스 업데이트 (ID 자동 증가 값 조정)
SELECT setval('magazines_id_seq', (SELECT MAX(id) FROM magazines));

-- =============================================
-- 테스트 사용자 데이터 (개발용)
-- 실제 운영 시에는 주석 처리 또는 삭제
-- =============================================

-- 테스트 사용자가 이미 auth.users에 있다고 가정
-- Supabase Dashboard에서 테스트 계정 생성 후 아래 쿼리 실행

/*
-- 테스트 사용자 프로필 (auth.users에 계정 생성 후 UUID 교체 필요)
INSERT INTO users (id, email, name, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', '홍길동', '010-1234-5678');

-- 테스트 배송지
INSERT INTO addresses (user_id, recipient_name, phone, postcode, address, detail_address, is_default) VALUES
('00000000-0000-0000-0000-000000000001', '홍길동', '010-1234-5678', '04778', '서울특별시 성동구 연무장길 12', '1층', TRUE),
('00000000-0000-0000-0000-000000000001', '김철수', '010-9876-5432', '06234', '서울특별시 강남구 테헤란로 123', '빌딩 5층', FALSE);

-- 테스트 장바구니
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
('00000000-0000-0000-0000-000000000001', 1, 1),
('00000000-0000-0000-0000-000000000001', 3, 2);

-- 테스트 위시리스트
INSERT INTO wishlist_items (user_id, product_id) VALUES
('00000000-0000-0000-0000-000000000001', 2),
('00000000-0000-0000-0000-000000000001', 5),
('00000000-0000-0000-0000-000000000001', 7);

-- 테스트 주문
INSERT INTO orders (
  user_id, order_number, status,
  recipient_name, recipient_phone, postcode, address, detail_address,
  delivery_method, payment_method,
  total_product_price, delivery_fee, total_price,
  ordered_at, paid_at
) VALUES
('00000000-0000-0000-0000-000000000001', 'ORD-20260315-000001', 'delivered',
 '홍길동', '010-1234-5678', '04778', '서울특별시 성동구 연무장길 12', '1층',
 'delivery', 'prepaid',
 950000, 0, 950000,
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- 테스트 주문 상품
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) VALUES
(1, 1, 'Copenhagen Lounge Chair', 950000, 1, 950000);
*/

-- =============================================
-- 데이터 확인 쿼리
-- =============================================

-- SELECT * FROM products ORDER BY id;
-- SELECT * FROM magazines ORDER BY id;
