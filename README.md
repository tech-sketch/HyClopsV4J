# About
JobSchedulerのジョブの実行状態を可視化し、一目で失敗したジョブを特定できるようになります。  
ジョブを基準とした表示だけでなく、オーダ基準によるジョブの状態の表示も可能です。  
さらに、表示されているジョブもしくはオーダをクリックすることで、  該当のログをレスポンシブで表示できます。  

![images](/images/)
※開発中の画面のため、変更がある可能性があります。

# Release Notes
* 2016/4/22 READMEを公開

# Features
* ジョブの実行状態を可視化  
    ** オーダ、ジョブ、ジョブチェインの3種類の表示に対応  
    ** 日付/時刻、名前で表示したい情報をフィルタ可能  
* 表示されているジョブフローから任意のジョブのログを1クリックで表示可能  
* 全てレスポンシブで表示可能  

# Requirement
JobScheduler Server:  
    - JobScheduler Server 1.10.x  
Client:  
    - Google Chrome ver.40以上 or FireFox ver.40以上  

# Architecture
![Architecture](/images/)

# Installation
1. git clone https://github.com/tech-sketch/HyClopsV4J
2. viewer/js/viewer.js を編集
[url=http://jobscheduler_server:4444]をJobSchedulerサーバのIPアドレスに変更
3. mv jobmap_illustration.html viewer/ /{SERVER_INSTALL_PATH}/operations_gui/
4. 配置したファイル/フォルダの所有者をJobScheduler実行ユーザへ変更する
   chmod -R JobScheduler_USER:JobScheduler_USER viewer/ jobmap_illustration.html

# Usage
1. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/jobmap_illustration.html へアクセスする
![アクセスした際の画面](/images/)
※開発中の画面のため、変更がある可能性があります。

# Author
[Takashi Adachi]

# License
[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright 2016 TIS Inc.
