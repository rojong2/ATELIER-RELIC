-- =============================================
-- Products 테이블에 like_count 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. products 테이블에 like_count 컬럼 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 2. 기존 위시리스트 데이터 기반으로 like_count 초기화
UPDATE products 
SET like_count = (
  SELECT COUNT(*) 
  FROM wishlist_items 
  WHERE wishlist_items.product_id = products.id
);

-- 3. 위시리스트 추가 시 like_count 증가 함수 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION increment_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET like_count = like_count + 1 
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 위시리스트 삭제 시 like_count 감소 함수 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION decrement_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET like_count = GREATEST(0, like_count - 1) 
  WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 기존 트리거 삭제 (있을 경우)
DROP TRIGGER IF EXISTS on_wishlist_insert ON wishlist_items;
DROP TRIGGER IF EXISTS on_wishlist_delete ON wishlist_items;

-- 6. 트리거 생성
CREATE TRIGGER on_wishlist_insert
  AFTER INSERT ON wishlist_items
  FOR EACH ROW EXECUTE FUNCTION increment_product_like_count();

CREATE TRIGGER on_wishlist_delete
  AFTER DELETE ON wishlist_items
  FOR EACH ROW EXECUTE FUNCTION decrement_product_like_count();

-- 7. like_count 인덱스 추가 (정렬용)
CREATE INDEX IF NOT EXISTS idx_products_like_count ON products(like_count DESC);

-- =============================================
-- 실행 완료 확인
-- =============================================
SELECT 'Like count migration completed!' as result;
