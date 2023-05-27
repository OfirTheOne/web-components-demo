import { WC } from '../../../../lib/jsx';

import { FC } from '../../../../lib/models/functional-component';

import './article-card.scss';


interface ArticleCardProps {
    title: string;
    date: string;
    author: string;
    content: string;
    image: string;
}

export const ArticleCard: FC<ArticleCardProps> = ({ title, date, author, content, image }) => (
    <div className='ArticleCardContainer'>
      <img className='ArticleCardImage' src={image} alt={title} />
      <div className='ArticleCardBody'>
        <h2 className='ArticleCardTitle'>{title}</h2>
        <div className='ArticleCardMeta'>
          <span className='ArticleCardMetaItem'>{date}</span>
          <span className='ArticleCardMetaItem'>{author}</span>
        </div>
        <p className='ArticleCardContent'>{content}</p>
      </div>
    </div>
  );