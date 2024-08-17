import NextLink from 'next/link';
import { Badge } from '@mantine/core';
import { capitalize } from '@/utils/strings';
import { getPageUrl } from '@/utils/urls';
import { SingleTag } from '@/data/tags';
import styles from '@/styles/tag.module.scss';

export interface TagProps {
  data: SingleTag;
}

export default function Tag({data, ...props}: TagProps) {
  const tagName = capitalize(data?.name);
  const tagUrl = getPageUrl(data?.slug, '/tags');

  return (
    <Badge
      className={styles.badge}
      component={NextLink}
      href={tagUrl as string}
      title={`See all articles tagged ${tagName}.`}
      variant='light' color='dark' size='xl' target='_blank'
      {...props}>{tagName}</Badge>
  );
}
