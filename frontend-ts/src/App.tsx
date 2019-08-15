import React, { useState, useEffect } from 'react';

// http://tilde.club/
// setup tailwind https://blog.logrocket.com/create-react-app-and-tailwindcss/
// set  autonoindent

// TODO: if articles empty => fetch more.
// TODO: use set for archived ids to avoid deleting wrong index.
// BUILD AND SERVE.

interface Article {
  id: string,
  title: string,
  url: string,
  excerpt: string
}

const App: React.FC = () => {
  const [offset, setOffset]:[number, Function] = useState(0);
  const [allArticles, setArticles]:[Article[], Function] = useState([]);
  const [isFetching, setIsFetching]:[boolean, Function] = useState(true);

  useEffect(() => {
    fetch(`/articles?offset=0`)
      .then(res => res.json())
      .then(({ articles }: { articles: Article[] }) => {
          setArticles((existing: Article[]) => {
              return [...existing, ...articles];
              });
          setOffset((offset: number) => offset + articles.length);
      })
      .then(() => setIsFetching(false));
  }, []);

  const handleClick = (index:number) => {
    const article: Article = allArticles[index];
    fetch(`/articles/${article.id}`, {method:'DELETE'})
     .then(() => {
         setArticles((articles: Article[]) => {
           return [...articles.slice(0, index), ...articles.slice(index + 1)]
           });
     });
  };

  return (
      <div className="h-screen flex items-center flex-col font-mono p-1">
        <div className="sm:w-2/3 md:w-1/2 text-center bg-orange-500 uppercase font-bold mt-4">
          $ WELCOME TO POCKET RETRO
        </div>
        <p className="sm:w-2/3 md:w-1/2 text-center bg-orange-500 font-bold mt-4">
          Application will attempt to retrieve articles untill exhausted.
        </p>
        <table className="sm:w-2/3 md:w-1/2 table border-orange-500 mt-4 p-2 border-2 mb-4">
          <tbody className="text-orange-500 font-thin font-base">
            {allArticles.map((article: Article, idx: number) => (
              <tr key={article.id}>
                <td 
                  onClick={() => handleClick(idx)}
                  className="p-1 cursor-pointer hover:bg-orange-500 hover:text-black"
                >
                  <a href={article.url} rel="noopener noreferrer" target="_blank">{article.title}</a>
                </td>
              </tr>
            ))}
            {isFetching && (<tr><td valign="top">Loading...</td></tr>)}
        </tbody></table>
    </div>
  );
}

export default App;
