'use client';

import path from 'path';
import classNames from 'classnames';
import { Pagination } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { APIResponseCollectionMetadata } from '@/types/strapi';
import styles from '@/styles/page-pagination.module.scss';

export interface PagePaginationProps extends React.HTMLAttributes<HTMLElement> {
  data: APIResponseCollectionMetadata['pagination'];
}

// TODO: Pass the query params to the next page, so that we don't break the sorting.

export default function PagePagination({data: {page, pageCount}, className, ...other}: PagePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pageCount <= 1) return null;
  
  return (
    <nav className={classNames(styles.container, className)} {...other}>
      <Pagination total={pageCount} defaultValue={page} onChange={(pageNumber) => {
        const cleanPath = pathname.replace(/page.*/, '');
        const newPath = path.join(cleanPath, (pageNumber > 1) ?  `/page/${pageNumber}` : '/');
        router.push(newPath);
      }} size='lg' />
    </nav>
  );
}
