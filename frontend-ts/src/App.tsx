import React, { useState, useEffect } from "react";

// http://tilde.club/
// setup tailwind with https://blog.logrocket.com/create-react-app-and-tailwindcss/
// sort out jsx autoindent etc. set  autonoindent

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

  // TODO: manage set of ids vs simple filter..
  //const [archivedIds, setArchivedIds]:[Set<string>, Function] = useState(new Set());

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
      fetch(`/articles?offset=0&limit=15`)
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
    // not waiting on api response. If it fails..it will come back.
    // TODO: but what happens if every delete fails?
    fetch(`/articles/${id}`, { method: "DELETE" });
    setArticles((existing: Article[]) => existing.filter(a => a.id !== id));
    //setArchivedIds((ids: Set<string>) => new Set([...ids, id]));
  };

  //const filteredArticles = allArticles.filter(a => !archivedIds.has(a.id));
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
                onClick={() => handleClick(article.id)}
                className="p-1 cursor-pointer hover:bg-orange-500 hover:text-black"
              >
                <a
                  href={article.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="focus:bg-orange-500 focus:text-black focus:outline-none"
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
