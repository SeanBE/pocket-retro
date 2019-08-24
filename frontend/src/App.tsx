import React, { useState, useEffect } from "react";


interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
}

const App: React.FC = () => {
  const [allArticles, setArticles]: [Article[], Function] = useState([]);
  const [isFetching, setIsFetching]: [boolean, Function] = useState(true);
  const [errorMessage, setErrorMessage]: [string, Function] = useState("");

  useEffect(
    () => {
      if (allArticles.length !== 0 || errorMessage) return;
      setIsFetching(true);
    },
    [allArticles, errorMessage]
  );

  useEffect(
    () => {
      if (!isFetching) return;
      fetch(`/api/articles?offset=0&limit=15`)
        .then(res => res.json())
        .then(({ articles }: { articles: Article[] }) => {
          if (articles.length === 0) {
            setErrorMessage("No more articles.");
          }
          setArticles((existing: Article[]) => articles);
        })
        .then(() => setIsFetching(false));
    },
    [isFetching]
  );

  const handleClick = (id: string) => {
    // TODO: introduce max timeout to avoid waiting on event. 
    fetch(`/api/articles/${id}`, { method: "DELETE" })
      .then(() => {
          // list will only contain at most 10 elements so filter is fine.
          setArticles((existing: Article[]) => existing.filter(a => a.id !== id));
      })
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
                className="p-1 cursor-pointer hover:bg-orange-500 hover:text-black"
              >
                <a
                  href={article.url}
                  onClick={() => handleClick(article.id)}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="block focus:bg-orange-500 focus:text-black focus:outline-none"
                >
                  {article.title}
                </a>
              </td>
            </tr>
          ))}
          {isFetching && (
            <tr>
              <td valign="top">Loading...</td>
            </tr>
          )}
          {errorMessage && (
            <tr>
              <td valign="top">{errorMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
