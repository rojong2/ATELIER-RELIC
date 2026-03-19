-- =============================================
-- Orders 테이블 재생성 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. 기존 테이블 및 관련 객체 삭제
DROP TRIGGER IF EXISTS set_order_number ON orders;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- 2. Orders 테이블 재생성 (user_id nullable, 주문자 정보 추가)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  
  -- 주문자 정보 (비회원 주문 지원)
  orderer_name VARCHAR(100) NOT NULL,
  orderer_phone VARCHAR(20) NOT NULL,
  orderer_email VARCHAR(255) NOT NULL,
  
  -- 배송 정보
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  postcode VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  detail_address VARCHAR(255),
  delivery_method delivery_method DEFAULT 'delivery',
  payment_method payment_method DEFAULT 'prepaid',
  delivery_memo TEXT,
  
  -- 금액 정보
  total_product_price INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  total_price INTEGER NOT NULL,
  
  -- 시간 정보
  ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Order Items 테이블 재생성
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 5. RLS 활성화
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS 정책 생성

-- Orders: 회원은 본인 주문만, 비회원 주문도 허용
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert guest orders" ON orders;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Order Items: 연결된 주문의 권한을 따름
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- 7. 트리거 재생성

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 주문번호 자동 생성 트리거
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =============================================
-- 실행 완료 확인
-- =============================================
SELECT 'Migration completed successfully!' as result;
