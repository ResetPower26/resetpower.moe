// Responsible for rendering the projects list with loading and error states.
import { Github, Globe } from "lucide-react";
import { Card } from "../components/Card";
import { useProjects } from "../hooks/useProjects";

function ProjectListSkeleton() {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-6 shadow-sm border border-slate-100"
        >
          <div className="flex gap-2 mb-4">
            <div className="h-5 w-16 rounded bg-slate-200" />
            <div className="h-5 w-16 rounded bg-slate-200" />
          </div>
          <div className="h-6 w-3/4 rounded bg-slate-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectList() {
  const { projects, isLoading, errorMessage } = useProjects();

  return (
    <div className="bg-white py-24 sm:py-32" id="projects">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            项目
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-600">一些项目🤓</p>
        </div>

        {isLoading && <ProjectListSkeleton />}

        {errorMessage && (
          <p className="mt-16 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col justify-between h-full p-6 border border-slate-100"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold leading-6 text-slate-900">
                    {project.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1.5" />
                    GitHub
                  </a>
                  {project.link_demo && (
                    <a
                      href={project.link_demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-1.5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
