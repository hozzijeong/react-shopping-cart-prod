/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { MESSAGE } from 'src/constants';
import useGetQuery from 'src/hooks/useGetQuery';
import useToast from 'src/hooks/useToast';
import { $CurrentServerUrl } from 'src/recoil/atom';
import { Product } from 'src/types';
import LoadingView from 'src/components/Common/LoadingView';
import ProductItem from 'src/components/ProductItem';
import styles from './index.module.scss';
import ErrorBoundary from '../ErrorBoundary';

function ProductItemList() {
  const currentServerUrl = useRecoilValue($CurrentServerUrl);
  const { data: productsData, loading, error } = useGetQuery<Product[]>(`${currentServerUrl}/products`);
  const Toast = useToast();

  useEffect(() => {
    if (error) {
      Toast.error(MESSAGE.PRODUCT_GET_FAILED);
    }
  }, [error]);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%', background: 'black' }}>{error}</div>}>
      <section className={styles.container}>
        {productsData?.map((item: Product) => (
          <ProductItem key={item.id} product={item} />
        ))}
      </section>
    </ErrorBoundary>
  );
}

export default ProductItemList;
