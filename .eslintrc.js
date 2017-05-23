// http://eslint.org/docs/user-guide/configuring

module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        // Put things like jQuery, etc
        "jQuery": true,
        "$": true,
        "avalon": true
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-cond-assign": [2, "always"], // 禁止条件表达式中出现赋值操作符
        "no-constant-condition": 2, // 禁止在条件中使用常量表达式
        "no-debugger": 2, // 禁用 debuggerodule
        "no-dupe-args": 2, // 禁止 function 定义中出现重名参数
        "no-dupe-keys": 2, // 禁止对象字面量中出现重复的 key
        "no-duplicate-case": 2, // 禁止出现重复的 case 标签
        "no-func-assign": 2, // 禁止对 function 声明重新赋值
        "no-obj-calls": 2, // 禁止把全局对象作为函数调用
        "no-regex-spaces": 2, // 禁止正则表达式字面量中出现多个空格
        "no-sparse-arrays": 2, // 禁用稀疏数组
        "no-unexpected-multiline": 2, // 禁止出现令人困惑的多行表达式
        "no-unreachable": 2, // 禁止在return、throw、continue 和 break 语句之后出现不可达代码
        "use-isnan": 2, // 要求使用 isNaN() 检查 NaN
        "valid-typeof": 2, // 强制 typeof 表达式与有效的字符串进行比较
        "eqeqeq": [0, "always"], // 要求使用 === 和 !==
        "quotes": [2, "single"], // 强制使用一致的反勾号、双引号或单引号
        "no-caller": 2, // 禁用 arguments.caller 或 arguments.callee
        "no-eval": 2, // 禁用 eval()
        "no-redeclare": 2, // 禁止多次声明同一变量
        "no-undef": 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
        "no-unused-vars": 0, // 禁止出现未使用过的变量
        "no-use-before-define": 2, // 禁止在变量定义之前使用它们
        "comma-dangle": [1, "never"], // 要求或禁止末尾逗号
        "no-const-assign": 2, // 禁止修改 const 声明的变量
        "no-dupe-class-members": 2 // 禁止类成员中出现重复的名称
    }
}
