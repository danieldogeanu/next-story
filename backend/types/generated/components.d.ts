import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

export interface SharedSocialLink extends Schema.Component {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'twitter';
    description: '';
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    link: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 256;
      }>;
    icon: Attribute.Enumeration<
      [
        'IconBrandBehance',
        'IconBrandBluesky',
        'IconBrandDeviantart',
        'IconBrandDribbble',
        'IconBrandFacebook',
        'IconBrandFlickr',
        'IconBrandGithub',
        'IconBrandGitlab',
        'IconBrandGoogle',
        'IconBrandInstagram',
        'IconBrandLinkedin',
        'IconBrandMastodon',
        'IconBrandMedium',
        'IconBrandMeetup',
        'IconBrandMeta',
        'IconBrandOnlyfans',
        'IconBrandPinterest',
        'IconBrandReddit',
        'IconBrandSnapchat',
        'IconBrandSoundcloud',
        'IconBrandSpotify',
        'IconBrandStrava',
        'IconBrandThreads',
        'IconBrandTidal',
        'IconBrandTiktok',
        'IconBrandTumblr',
        'IconBrandTwitch',
        'IconBrandTwitter',
        'IconBrandVimeo',
        'IconBrandX',
        'IconBrandYoutube',
        'IconWorld',
        'IconLink'
      ]
    >;
  };
}

export interface SiteSecretEntry extends Schema.Component {
  collectionName: 'components_site_secret_entries';
  info: {
    displayName: 'Secret Entry';
    icon: 'key';
    description: '';
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    value: Attribute.String & Attribute.Required;
  };
}

export interface UserSubscriptions extends Schema.Component {
  collectionName: 'components_user_subscriptions';
  info: {
    displayName: 'Subscriptions';
    icon: 'envelop';
  };
  attributes: {
    account: Attribute.Boolean & Attribute.DefaultTo<true>;
    articles: Attribute.Boolean & Attribute.DefaultTo<true>;
    comments: Attribute.Boolean & Attribute.DefaultTo<true>;
    promotions: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'site.secret-entry': SiteSecretEntry;
      'user.subscriptions': UserSubscriptions;
    }
  }
}
