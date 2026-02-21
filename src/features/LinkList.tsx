// Responsible for rendering the link exchange list with loading and error states.
import { Card } from "../components/Card";
import { useLinks } from "../hooks/useLinks";

function LinkListSkeleton() {
  return (
    <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
          <div className="mt-4 mx-auto h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-2 mx-auto h-3 w-full rounded bg-slate-200" />
          <div className="mt-1 mx-auto h-3 w-4/5 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function LinkList() {
  const { links, isLoading, errorMessage } = useLinks();

  return (
    <div className="bg-slate-50 py-16 sm:py-24" id="links">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            友链
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-600">诶嘿嘿🥰</p>
        </div>

        {isLoading && <LinkListSkeleton />}

        {errorMessage && (
          <p className="mt-16 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-4">
            {links.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex flex-col items-center p-6 h-full text-center">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <span className="mt-4 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </span>
                  <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
