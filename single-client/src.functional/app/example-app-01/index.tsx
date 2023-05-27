import { WC } from '../../lib/jsx';
import { ArticleCard } from './components/article-card/article-card';


const article = {
    title: "How to Build a React Component",
    date: "May 1, 2023",
    author: "John Doe",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae sem quis nulla gravida aliquet. Fusce at ex tortor. Vestibulum a felis eget nisl mattis faucibus in vel quam. Etiam ut ante ac purus iaculis auctor. Sed sit amet urna non nisl fermentum hendrerit. Proin in consequat ex, sit amet volutpat turpis.",
    image: "https://picsum.photos/120/120",
  };

export function ExamplePage01() {
  return (
    <div>
      <ArticleCard {...article} />
    </div>
  );
}



