# About
## JobScheduler
JobSchedulerはドイツのSoftware und Organisations-Service GmbHで開発されている、非常に豊富な機能を有したOSSのジョブ運用自動化ツールです。
JobSchedulerでは、
* ジョブの定義を様々なプログラミング言語で可能
* HA構成や負荷分散構成が可能
* ジョブが全てXMLとして定義されている
* 同期実行やスケジューリング機能、ファイル監視をトリガとした高度なジョブの制御
* API呼び出しによる外部アプリケーションとの連携
* GUIによるジョブの作成や管理
といった特徴があり、近年非常に注目されているエンタープライズ向けのジョブ運用管理ツールです。
詳細につきましては、
<http://www.sos-berlin.com/jobscheduler>をご参照ください。

## HyClopsV4J
JOCには存在しない機能である、ジョブの実行履歴とその状態をグラフィカルに可視化するためのツールです。  
表示されているジョブもしくはオーダをクリックすることで該当のログをレスポンシブで表示し、  
エラーの原因特定に役立てることができます。  
またJobSchedulerサーバにファイルを追加するだけで導入できるため、非常に手軽に利用できます。
(Webで管理をするためのJOCと関連付ける必要はありません)

ジョブの実行履歴表示
![images](/images/abstract1.png)
  
ジョブのログを表示
![images](/images/abstract2.png)
※開発中の画面のため、変更がある可能性があります。

# Release Notes
* 2016/5/8 ver0.1を公開予定
* 2016/4/22 READMEを公開

# Features
* ジョブの実行履歴状態を可視化  
    * ジョブチェインの表示に対応 
* 表示されているジョブフローから任意のジョブのログを1クリックで表示可能  
* 全てレスポンシブで表示可能  

## Restriction
* ジョブの実行履歴は最新の状態のみ表示可能  
    * 一度に表示可能なジョブチェインは20個、1つのジョブチェインに含まれるジョブは30個まで  
    * 表示可能な実行状態は、"正常終了","異常終了","未実行"の3種類  
    * 直列のジョブチェインのみ対応
* ジョブチェインの検索は部分一致のみ  
* 一度に表示可能なログは1種類  

# Requirement
### JobScheduler Server:  
    - JobScheduler Server 1.10.x  
### Client:  
    - Google Chrome ver.40以上 or FireFox ver.40以上  

# Architecture
![Architecture](/images/architecture.png)

# Installation
## Preparation
下記ファイルとフォルダをダウンロードする
* jobmap_illustration.html (ViewerのHTML)
* viewer (スクリプト群)  

## Process
1. Preparationに記載されているファイルを、JobSchedulerサーバにダウンロードする
2. viewer/js/viewer.jsのパラメータを編集する  
　　[url=http://jobscheduler_server:4444] → IPaddress of JobScheduler Server]  
3. ダウンロードしたファイルとフォルダ(サブフォルダ含む)の所有者をJobSchedulerの実行ユーザへ変更する
4. 所有者を変更したファイルとフォルダを{SERVER_INSTALL_PATH}/operations_gui/に移動させる 
5. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/jobmap_illustration.html へアクセスし、  
ページが表示されることを確認する

### Example
gitを使ったインストール方法  
　$ cd /home/{JobScheduler_USER}/  
　$ git clone https://github.com/tech-sketch/HyClopsV4J
　$ cd HyClopsV4J/verx.x
　$ vi viewer/js/viewer.js  
　　　　[url=http://jobscheduler_server:4444] → IPaddress of JobScheduler Server]  
　$ chmod -R {JobScheduler_USER}:{JobScheduler_USER} viewer/ jobmap_illustration.html  
　$ mv jobmap_illustration.html viewer/ /{SERVER_INSTALL_PATH}/operations_gui/  

# Usage
1. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/jobmap_illustration.html へアクセスする  
![アクセスした際の画面](/images/usage1.png)
  
2. ジョブチェイン名を適宜指定し、検索ボタンをクリックする  
3. エラーが発生しているジョブやオーダがあれば該当する箇所をクリックし、ログを表示させ、  
調査を行う

# Future Works
## ジョブ実行履歴表示  
* ジョブ、オーダ単位での表示に対応  
* 日付、時間によるジョブフィルタ機能  
    * 完全一致、前方一致/後方一致に対応

## ログ表示
* オーダのログの表示に対応  

# Author
Takashi Adachi (TIS Inc.)  
Kazuhiko Miyoshi (CyberCom Inc)

# License
[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright 2016 TIS Inc.
