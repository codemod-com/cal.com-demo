import { glob } from "glob";
import { posix } from "path";

const run = async () => {
  const legacyPagePaths = await glob("pages/**/*.{ts,tsx}", {
    ignore: "pages/api/**",
  });
  const legacyPageCount = legacyPagePaths.length;

  const map: Map<string, string | null> = new Map(legacyPagePaths.map((path) => [path.split(".")[0], null]));

  const futurePagePaths = await glob("app/future/**/page.tsx");
  const futurePageCount = futurePagePaths.length;

  for (const futurePagePath of futurePagePaths) {
    const pathWithoutSharedLayout = futurePagePath
      .split(posix.sep)
      .filter((segment) => !segment.startsWith("("))
      .slice(2, -1)
      .join(posix.sep);
    const legacyPath = ["pages", pathWithoutSharedLayout].join(posix.sep);

    [legacyPath, `${legacyPath}/index`].forEach((path) => {
      if (map.has(path)) {
        map.set(path, futurePagePath);
      }
    });
  }

  const data = Array.from(map.entries())
    .map(([legacyPagePath, futurePagePath]) => ({
      legacyPagePath,
      futurePagePath,
      migrated: futurePagePath !== null,
    }))
    .sort((a) => {
      return a.migrated ? -1 : 1;
    });

  console.log(`Migrated: ${futurePageCount} / ${legacyPageCount}`);
  console.table(data);
};

run();
