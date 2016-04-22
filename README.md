# About
JobSchedulerのジョブの実行状態を可視化し、一目で失敗したジョブを特定できるようになります。  
ジョブを基準とした表示だけでなく、オーダ基準によるジョブの状態の表示も可能です。  
さらに、表示されているジョブもしくはオーダをクリックすることで、  該当のログをレスポンシブで表示できます。  
NOTE: JobSchedulerについては[ここ](http://www.sos-berlin.com/jobscheduler)をご参照ください

![images](/images/abstract1.png)
![images](/images/abstract2.png)
※開発中の画面のため、変更がある可能性があります。

# Release Notes
* 2016/4/22 READMEを公開

# Features
* ジョブの実行状態を可視化  
    * オーダ、ジョブ、ジョブチェインの3種類の表示に対応  
    * 日付/時刻、名前で表示したい情報をフィルタ可能  
* 表示されているジョブフローから任意のジョブのログを1クリックで表示可能  
* 全てレスポンシブで表示可能  

# Requirement
### JobScheduler Server:  
    - JobScheduler Server 1.10.x  
### Client:  
    - Google Chrome ver.40以上 or FireFox ver.40以上  

# Architecture
![Architecture](/images/architecture.png)

   $ git clone https://github.com/tech-sketch/HyClopsV4J  
# Installation
   $ vi viewer/js/viewer.js  
     [url=http://jobscheduler_server:4444] → IPAddress of JobScheduler Server    
   $ mv jobmap_illustration.html viewer/ /{SERVER_INSTALL_PATH}/operations_gui/  
   $ chmod -R JobScheduler_USER:JobScheduler_USER viewer/ jobmap_illustration.html  

# Usage
1. ブラウザからhttp://{JobScheduler ServerのIPアドレス:4444}/jobmap_illustration.html へアクセスする  
![アクセスした際の画面](/images/usage1.png)
2. 日付、時刻、オーダ名、ジョブ名、ジョブチェイン名を適宜指定し、検索ボタンをクリックする  
3. エラーが発生しているジョブやオーダがあれば該当する箇所をクリックし、ログを表示させ、  
調査を行う


# Author
[Takashi Adachi]

# License
[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright 2016 TIS Inc.
