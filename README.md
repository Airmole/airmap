# AirMap

<img width="100%" style="width: 100%;" alt="image" src="https://github.com/Airmole/airmap/assets/20333663/63247a4a-9cca-491d-a017-a31ea54ab24b" />

<p>高德地图标注工具，适用于旅行攻略地图标注，交通线路路径规划，市政管线分布走向图，地图数据可视化标注等应用场景，目前仍然在开发完善中...</p>

## 开发调试

> 请先[申请高德地图Key和安全码](https://lbs.amap.com/api/javascript-api/guide/abc/prepare)

1. 复制并重命名编辑.env文件

```shell
# cp .env.example .env
# vim .env
```

编辑填入自己申请到的高德地图Key、安全密钥。

2. 安装依赖

```shell
# yarn install
```

3. 启动调试开发

```shell
# yarn serve
```

## 打包发布线上环境

1. 在本项目目录下执行

```shell
# yarn build
```

2. 待打包完成后，拷贝dist下所有文件到 [airmap-pages](https://github.com/Airmole/airmap-pages) 项目下替换文件

```shell
# cp -r ./dist/* ../airmap-pages/
```

3. 提交合并到 [airmap-pages](https://github.com/Airmole/airmap-pages) 项目main分支， [New pull request](https://github.com/Airmole/airmap-pages/pulls) 合并后自动发布

```shell
# cd ../airmap-pages
# git add .
# git commit -m 'updated'
# git push origin main // 如果你有main分支权限的话
```

4. 成功，访问 [https://airmap.airmole.net/](https://airmap.airmole.net/)
