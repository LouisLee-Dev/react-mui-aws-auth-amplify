import del from "rollup-plugin-delete";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import url from "@rollup/plugin-url";
import json from "@rollup/plugin-json";
import svgr from "@svgr/rollup";
import analyze from "rollup-plugin-analyzer";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import scss from "rollup-plugin-scss";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const input = "src/index.tsx";
const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};

const plugins = [
  del({ targets: "dist/*", runOnce: true }),
  typescript({ useTsconfigDeclarationDir: true }),
  json(),
  external(),
  resolve({ extensions: [".ts", ".tsx", ".js", ".jsx"] }),
  replace({ __VERSION__: `'${pkg.version}'`, preventAssignment: true }),
  analyze({ summaryOnly: true }),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    exclude: "./node_modules/**",
    include: ["src/**"],
  }),
  scss({
    insert: true,
    processor: (css) =>
      postcss([autoprefixer])
        .process(css)
        .then((result) => result.css),
  }),
  url(),
  svgr({ icon: true }),
];

export default [
  {
    input,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        globals,
      },
      {
        file: pkg.module,
        format: "esm",
        exports: "named",
        sourcemap: true,
        globals,
      },
    ],
    plugins: plugins,
  },
];
