# 実行環境

[こちら](https://takuhackathons.github.io/QiitaHackathon2024/) より遊ぶことができます

* https://takuhackathons.github.io/QiitaHackathon2024/

# 動かし方メモ

## ローカル環境の開発の仕方

### VOICEVOXの起動

`voicevox/` 以下に移動(`cd voicevox/`)
そして以下のコマンドを実行するとVOICEVOXのサーバーが立ち上げる

```
docker-compose up -d
```

または

```
docker compose up -d
```

VOICEVOXのサーバーが立ち上がったら
http://localhost:50021/docs
にアクセスすることでVOICEVOXのAPIドキュメントを参照することができます
また
http://localhost:50021/setting
にアクセスすることでCORSの設定の変更などを行うことができます

### web frontendの起動

`web/` 以下に移動(`cd web/`)
し

```
yarn install
```

を実行してライブラリのインストールを行い
そして以下のコマンドを実行するとローカルのサーバーが起動する

```
yarn run dev
```

上記の [VOICEVOXの起動](#VOICEVOXの起動) が行われていれば、問題なくweb から音声合成が行われます

## サーバー内での動かし方メモ

### VOICEVOX

まずは上記の [VOICEVOXの起動](#VOICEVOXの起動) を行う

*  VOICEVOXのサーバーはポート番号が`50021`番で動いているのでリバースプロ式または`50021`番ポートを解放する
* VOICEVOXのcorsの設定を更新しないと外部webからVOICEVOXのAPIを実行することができない。VOICEVOXが起動しているサーバー内で以下のコマンドを実行してCORSの設定を更新する

```
curl -X 'POST' 'http://localhost:50021/setting' -H 'accept: */*' -H 'Content-Type: application/x-www-form-urlencoded' -d 'cors_policy_mode=all'
```

* VOICEVOXのCORSの設定を更新したのでVOICEVOXのサーバーを再起動します。再起動するために以下のコマンドを実行します。

```
docker-compose stop
```

または

```
docker compose stop
```

その後

```
docker-compose up -d
```

または

```
docker compose up -d
```

を実行して再起動する

# 各種使用ツールや素材一覧

* [VOICEVOX](https://voicevox.hiroshiba.jp/)
* [ずんだもんVRM](https://booth.pm/ja/items/3733351)
* 背景画像
  * [学校のグラウンド（4枚）](https://min-chi.material.jp/fm/bg_c/school_ground/)
  * [和風の家の玄関ホール（2枚）](https://min-chi.material.jp/fm/bg_c/jp_entrance_hall/)
  * [飲食店の店内（3枚）](https://min-chi.material.jp/fm/bg_c/casual_restaurant/)
* [ChatVRM 記事](https://inside.pixiv.blog/2023/04/28/160000)
* [ChatVRM Github](https://github.com/pixiv/ChatVRM)