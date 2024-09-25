'use client';

import path from 'path';
import classNames from 'classnames';
import { Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { APIResponseCollectionMetadata } from '@/types/strapi';
import styles from '@/styles/page-pagination.module.scss';

export interface PagePaginationProps extends React.HTMLAttributes<HTMLElement> {
  data: APIResponseCollectionMetadata['pagination'];
}

// TODO: Fix first page redirection with query params.

export default function PagePagination({data: {page, pageCount}, className, ...other}: PagePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (pageNumber: number) => {
    const cleanPath = pathname.replace(/page.*/, '');
    const queryString = searchParams.toString();
    const pagePath = (pageNumber > 1) ?  `/page/${pageNumber}` : '/';
    const newQueryString = (queryString !== '') ? '?' + queryString : '';
    const newPath = path.join(cleanPath, pagePath, newQueryString).replace('/?', '?');
    router.push(newPath);
  };

  if (pageCount <= 1) return null;
  
  return (
    <nav className={classNames(styles.container, className)} {...other}>
      <Pagination total={pageCount} defaultValue={page} onChange={handlePageChange} size='lg' />
    </nav>
  );
}
