# 更新日志

## 0.0.1

- `jqfree` 初版，整合成一个文件。

## 0.0.2

*2017-04-10*

- 加入 `webpack` 打包代码。
- 加入 `webpack-dev-server` ，只要运行 `npm run dev` 就能启动本地

## 0.0.3

*2017-04-10*

- 加入 `mocha` & `chai`，进行单测，只要运行 `npm run test` 就能启动本地测试文件。
- 把 attributes.js 文件中的 `html()` 方法移动到 dom.js 文件里
- 修改 init 初始化 jqfree 函数，关于 `$('<p class="p">test</p>')` 这样的输入所作的判断逻辑。
- 修改 dom.js 里的 `append()` 方法和 `prepend()` 方法
- 追加 `test.js` 里的 `init` `traverse` `dom` 的三个单元测试
- 追加 `test.js` 里的 `css` `attributes` `events` `effect` `ajax` `cookie` 的六个单元测试
- 追加 `test.js` 里的 `utils` 的单元测试
