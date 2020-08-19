module.exports = {
    // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
    env: {
        browser: true, // 浏览器环境中的全局变量。
        es6: true, // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）
    },
    // 一个配置文件可以被基础配置中的已启用的规则继承。
    extends: ["airbnb", "plugin:prettier/recommended", "prettier/flowtype", "prettier/react", "prettier/standard"],
    // 自定义全局变量
    globals: {
        document: true,
        localStorage: true,
        window: true,
        React: true,
    },
    // settings: {
    //   'import/resolver': {
    //     webpack: {
    //       config: 'build/webpack.config.js', // 这是你设置alias的配置文件路径
    //     },
    //   },
    // },
    // ESLint 默认使用Espree作为其解析器，你可以在配置文件中指定一个不同的解析器
    parser: "babel-eslint",
    // 配置解析器支持的语法
    parserOptions: {
        ecmaFeatures: {
            // 表示使用的额外的语言特性
            jsx: true, // 开启jsx
        },
        ecmaVersion: 2018, // 启用 ECMAScript 版本; 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
        sourceType: "module",
    },
    // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。
    // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀。
    plugins: ["react"],
    // ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：
    // "off" 或 0 - 关闭规则
    // "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
    // "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
    rules: {
        semi: 2,
        "no-plusplus": 0,
        "no-unused-vars": [
            1,
            {
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: true,
                varsIgnorePattern: "^_",
                argsIgnorePattern: "^_|^err|^ev", // _xxx, err, error, ev, event
            },
        ],
        "no-useless-escape": 2,
        "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
        "no-restricted-globals": ["error", "event", "fdescribe"],
        "no-restricted-properties": 0,
        "no-underscore-dangle": 0,
        "react/self-closing-comp": [
            "error",
            {
                component: true,
                html: false,
            },
        ],
        "import/no-unresolved": [
            2,
            {
                ignore: ["_less", "_components", "_utils", "_consts", "_statics", "_src", "_service", "_store"], // @ 是设置的路径别名
            },
        ],
        camelcase: 0,
        "react/forbid-prop-types": [2, { forbid: ["any"] }], //禁止某些propTypes
        "react/sort-comp": 0,
        "prettier/prettier": ["error", { singleQuote: true, parser: "flow" }],
        "class-methods-use-this": 0,
        "jsx-a11y/control-has-associated-label": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/no-noninteractive-element-interactions": 0,
        "jsx-a11y/anchor-is-valid": 0,
    },
};
