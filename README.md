# About
## HyClops V4J
OSSのジョブ運用自動化ツールであるJobSchedulerのジョブの実行状態を可視化するためのツールです。  
表示されているジョブもしくはオーダをクリックすることで該当のログを  
レスポンシブで表示し、ジョブ運用時における原因特定をスムーズに行うことができます。  

またJobSchedulerサーバにファイルを追加するだけで導入できるため、  
非常に手軽に利用できます。  

ジョブの実行状態とログ表示
![images](/images/abstract1.png)

### 補足: JobScheduler
JobSchedulerはドイツのSoftware und Organisations-Service GmbHで開発されている、  
非常に豊富な機能を有したOSSのジョブ運用自動化ツールです。  
JobSchedulerには、
* ジョブの定義を様々なプログラミング言語で可能
* HA構成や負荷分散構成が可能
* ジョブを全てXMLとして定義
* 同期実行やスケジューリング機能、ファイル監視をトリガとする等の高度なジョブの制御
* API呼び出しによる外部アプリケーションとの連携
* GUIによるジョブの作成や管理  

等の特徴があり、近年非常に注目されているエンタープライズ向けのジョブ運用管理ツールです。  
詳細につきましては、<http://www.sos-berlin.com/jobscheduler>をご参照ください。

# Features
* ジョブの実行状態状態を可視化  
    * ジョブチェインの表示に対応し、検索も可能
* 表示されているジョブフローから任意のジョブのログを1クリックで表示可能  
* 全てレスポンシブで表示可能  
* 構成がシンプルなため、既存の環境には影響を与えない
    * JOCにも関連付けをする必要はなし

### Restriction
* ジョブの実行状態表示は最新の状態のみ表示可能  
    * 一度に表示可能なジョブチェインは20個、1つのジョブチェインに含まれるジョブは30個まで  
    * 表示可能な実行状態は、"正常終了","異常終了","未実行"の3種類  
    * 直列のジョブチェインのみ対応
        * 並列のジョブチェインを表示させると予期しない動作をする可能性あり  
* ジョブチェインの検索は部分/前方/後方一致に対応

# Requirement
### JobScheduler Server:  
    - OS: Linux/CentOS/RHEL
    - JobScheduler Server: 1.10.x  
### Client:  
    - Google Chrome ver.40以上 or FireFox ver.40以上  

# Architecture
![Architecture](/images/architecture.png)

# Installation
1. 下記HTMLファイルとフォルダをJobSchedulerサーバにダウンロードする
  
* hyclopsv4j.html
* viewer/
    * css/
    * js  
 `$ cd /home/{JobSchedulerの実行ユーザ}/`  
 `$ git clone https://github.com/tech-sketch/HyClopsV4J`  
2. viewer/js/viewer.jsのパラメータを編集する  
url=http://Jobscheduler_Server:4444 → url=http://JobScheduler ServerのIPアドレス  
`$ vi viewer/js/viewer.js`  
3. ダウンロードしたファイルとフォルダ(サブフォルダ含む)の所有者をJobSchedulerの実行ユーザへ変更する  
`$ chmod -R {JobScheduler実行ユーザ}:{JobScheduler実行ユーザ} viewer/ hyclopsv4j.html`
4. 所有者を変更したファイルとフォルダを[JobScheduler Serverのインストールパス]/operations_gui/に移動させる  
`$ mv hyclopsv4j.html viewer/ /{JobSchedulerのインストールパス}/operations_gui/` 
5. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/hyclopsv4j.html へアクセスし、  
ページが表示されることを確認する  

# Usage
1. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/hyclopsv4j.html へアクセスする  
![アクセスした際の画面](/images/usage1.png)
  
2. ジョブチェイン名を適宜指定し、検索ボタンをクリックする
(ブランクの場合には*として検索される)  
ジョブの最新の実行状態が正常終了であれば黄緑色、エラーであれば赤色、未実行であれば青色で表示される
![images](/images/usage2.png)

3. ログを確認したいジョブがあれば該当する箇所をクリックし、ログを表示させる
(ジョブ単位でログが表示される)
![images](/images/usage3.png)

# Future Works
###実行状態表示機能
<table>
    <tr>
        <td>機能名</td>
        <td>概要</td>
        <td>進捗</td>
    </tr>
    <tr>
       <td>ジョブチェイン表示(直列)</td>
       <td>直列ジョブチェインの表示</td>
       <td>○</td>
    <tr>
        <td>ジョブチェイン表示(並列)</td>
        <td>splliter、内部APIを利用した並列ジョブチェインの表示</td>
        <td>一部○</td>
        </tr>
    <tr>
        <td>オーダ、ジョブ表示</td>
        <td>オーダ、ジョブの実行一覧を表示</td>
        <td>△</td>
    </tr>
    <tr>
        <td>フィルタ機能(日付、時刻、オーダ名、ジョブ名)</td>
        <td>該当パラメータによるフィルタ機能</td>
        <td>一部○</td>
    </tr>
    <tr>
        <td>画面の自動更新</td>
        <td>画面を一定時間ごとに自動で更新する</td>
        <td>×</td>
    </tr>
</table>
###ログ表示機能
<table>
    <tr>
        <td>機能名</td>
        <td>概要</td>
        <td>進捗</td>
    </tr>
    <tr>
        <td>オーダのログ表示</td>
        <td>指定したオーダのログを表示する</td>
        <td>△</td>
    </tr>
</table>

# Note
* JOCにベーシック認証を適用している際には、その認証がそのまま適用される

# Release Notes
* 2016/4/22 READMEを公開

# Contact
お問い合わせは下記メールアドレスまでお願いします。  
hyclops@ml.tis.co.jp

# License
[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright 2016 TIS Inc.
