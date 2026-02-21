export function About() {
  return (
    <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          关于我
        </h2>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          这里是关于我的详细介绍页面。
        </p>
        <div className="mt-10 text-left text-slate-700 space-y-4">
          <p>Undergraduate student | Minecraft player</p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/ResetPower26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://github.com/ResetPower26
            </a>
          </p>
          <p>Email: resetpower26@icloud.com</p>
        </div>
      </div>
    </div>
  );
}
