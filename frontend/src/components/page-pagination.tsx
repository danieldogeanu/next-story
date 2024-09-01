'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { Pagination } from '@mantine/core';
import { APIResponseCollectionMetadata } from '@/types/strapi';
import styles from '@/styles/page-pagination.module.scss';

export interface PagePaginationProps extends React.HTMLAttributes<HTMLElement> {
  data: APIResponseCollectionMetadata['pagination'];
}

export default function PagePagination({data: {page, pageCount}, className, ...other}: PagePaginationProps) {
  const router = useRouter();

  if (pageCount <= 1) return null;
  
  return (
    <nav className={classNames(styles.container, className)} {...other}>
      <Pagination total={pageCount} defaultValue={page} onChange={(pageNumber) => {
        router.push((pageNumber > 1) ?  `/page/${pageNumber}` : '/');
      }} size='lg' />
    </nav>
  );
}
