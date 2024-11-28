'use client';

import path from 'path';
import classNames from 'classnames';
import { Pagination } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { APIResponseCollectionMetadata } from '@/types/strapi';
import { capitalize } from '@/utils/strings';
import styles from '@/styles/page-pagination.module.scss';

export interface PagePaginationProps extends React.HTMLAttributes<HTMLElement> {
  data: APIResponseCollectionMetadata['pagination'];
}

export default function PagePagination({data: {page, pageCount}, className, ...otherProps}: PagePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (pageNumber: number) => {
    const cleanPath = pathname.replace(/page.*/, '');
    const queryString = searchParams.toString();
    const pagePath = (pageNumber > 1) ?  `/page/${pageNumber}` : '/';
    const newQueryString = (queryString !== '') ? '?' + queryString : '';
    const newPath = path.join(cleanPath, pagePath, newQueryString);
    router.push(newPath);
  };

  if (pageCount <= 1) return null;
  
  return (
    <nav className={classNames(styles.container, className)} {...otherProps}>
      <Pagination
        total={pageCount}
        defaultValue={page}
        onChange={handlePageChange}
        getItemProps={(page) => ({ 'data-event-name': `Page ${page}` })}
        getControlProps={(control) => ({ 'data-event-name': `${capitalize(control)} Page` })}
        size='lg'
      />
    </nav>
  );
}
