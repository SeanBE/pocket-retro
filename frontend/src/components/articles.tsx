import React from "react";

export interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
}

interface ArticleRowProps {
  article: Article;
  handleClick: (_: any) => void;
}

export const ArticleItem = ({ article, handleClick }: ArticleRowProps) => {
  const onClick = () => handleClick(article.id);

  return (
    <div key={article.id} className="text-orange-500">
      <div className="p-1 cursor-pointer hover:bg-orange-500 hover:text-black">
        <a
          href={article.url}
          onClick={onClick}
          rel="noopener noreferrer"
          target="_blank"
          className="block focus:bg-orange-500 focus:text-black focus:outline-none"
        >
          {article.title}
        </a>
      </div>
    </div>
  );
};
