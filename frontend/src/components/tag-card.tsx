import Link from 'next/link';
import path from 'node:path';
import { Card, Title } from '@mantine/core';
import { SingleTag } from '@/data/tags';
import { capitalize } from '@/utils/strings';
import styles from '@/styles/tag-card.module.scss';

export interface TagCardProps {
  data: SingleTag;
}

export default function TagCard({data}: TagCardProps) {
  const tagHref = path.join('/tags', data.slug);
  
  return (
    <Card
      className={styles.card}
      component={Link}
      href={tagHref}
      title={`See Articles for ${capitalize(data.name)} Tag`}
      padding='xs'
      radius='md'>

      <Title className={styles.title} order={2}>
        {capitalize(data.name)}
      </Title>

    </Card>
  );
}
