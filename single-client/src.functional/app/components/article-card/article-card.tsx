import { WC } from '../../../lib/jsx';
import { useTheme } from './../../providers';
import { createMemo, useAsync } from '../../../lib/core';
import { signal } from '../../../lib/core/signal/signal-component/signal-component';
import { createSignal, derivedSignal } from '../../../lib/core/signal/create-signal/create-signal';
import { Signal } from '../../../lib/core/signal/models';
import { FC } from 'src.functional/lib/models/functional-component';

import './article-card.scss';


interface ArticleCardProps {
    title: string;
    date: string;
    author: string;
    content: string;
    image: string;
}

export const ArticleCard: FC<ArticleCardProps> = ({ title, date, author, content, image }) => (
    <div classname='ArticleCardContainer'>
      <img classname='ArticleCardImage' src={image} alt={title} />
      <div classname='ArticleCardBody'>
        <h2 classname='ArticleCardTitle'>{title}</h2>
        <div classname='ArticleCardMeta'>
          <span classname='ArticleCardMetaItem'>{date}</span>
          <span classname='ArticleCardMetaItem'>{author}</span>
        </div>
        <p classname='ArticleCardContent'>{content}</p>
      </div>
    </div>
  );