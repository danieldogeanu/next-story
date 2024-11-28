import Link from 'next/link';
import { Card, Title } from '@mantine/core';
import { SingleTag } from '@/data/tags';
import { getPageUrl } from '@/utils/urls';
import { capitalize } from '@/utils/strings';
import styles from '@/styles/tag-card.module.scss';

export interface TagCardProps {
  data: SingleTag;
}

export default function TagCard({data}: TagCardProps) {
  const tagUrl = getPageUrl(data.slug, '/tags');
  
  return (
    <Card
      className={styles.card}
      component={Link}
      href={tagUrl || ''}
      title={`See Articles for ${capitalize(data.name)} Tag`}
      data-event-name='Tag Card'
      padding='xs'
      radius='md'>

      <Title className={styles.title} order={2}>
        {capitalize(data.name)}
      </Title>

    </Card>
  );
}
