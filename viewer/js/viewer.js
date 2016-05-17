/*Copyright 2016 TIS Inc. HyClopsV4J (hyclops@ml.tis.co.jp)
* Licensed under the Apache License, Version 2.0. The Apache v2 full text is 
* published at [this link](http://www.apache.org/licenses/LICENSE-2.0).
*/

angular.module("Viewer", ['ngSanitize']).config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }])

//controller module
        .controller("JobMap", function ($scope, $http, filterFilter, $document, $log) {
            /********************************************************************************/
            /* You should change following the IP Address & Port to your JobScheduler Server.
             */
            url = 'http://JobScheduler_Server:4444/';
            /********************************************************************************/

            $log.debug("Loading JobMap Module");

	    $scope.textlog = "ログ表示領域";

            //Search Jobs When an user click the search-button.
            $scope.SearchHistory = function () {

                //Get Parameter(Job/JobChain/OrderName)
                parameter =
                        {
                            order_name: $scope.order_name,
                            job_name: $scope.job_name,
                            jobchain_name: $scope.jobchain_name
                        };
                // Choose Search mode (Unimplemented)
                kind = "";
                if (!angular.isUndefined(parameter.order_name)) {
                    $log.debug("filter:" + parameter.order_name);
                    kind = "order";
                }
                if (!angular.isUndefined(parameter.job_name)) {
                    $log.debug("filter:" + parameter.job_name);
                    kind = "job";
                }
                if (!angular.isUndefined(parameter.jobchain_name)) {
                    $log.debug("filter:" + parameter.jobchain_name);
                    kind = "jobchain";
                }

                //Get JobChain States
                api = url + '<show_state what=\'job_commands job_chains task_history\'/>';
                $log.debug(api);

                $http({
                    method: 'GET',
                    url: api,
                })
                        .success(function (data, status, headers, config) {
                            obj = xmltoJson(data);

                            jobchain_obj = obj.spooler.answer.state.job_chains.job_chain;
                            jobchain_obj_history = obj.spooler.answer.state.jobs.job;

                            /* Unimplemented
                             if(!angular.isUndefined(parameter.jobchain_name)){
                             tmp_job = tmp_obj.state.job_chains;
                             $log.debug(tmp_job);
                             $log.debug("=============order_history=================");
                             angular.forEach(tmp_order,function(value,index,tmp_order){
                             $log.debug(value._name);
                             });
                             }
                             else if(!angular.isUndefined(parameter.job_name)){
                             tmp_job = obj.jobs;
                             $log.debug(tmp_job);
                             $log.debug("============jobs======================");
                             //			angular.forEach(tmp_job,function(value,index,tmp_job){
                             //				$log.debug(value_				
                             //});		
                             }
                             else {
                             tmp_order = tmp_obj.state.job_chains.job_chain;
                             $log.debug(tmp_order);
                             $log.debug("=============order_history=================");
                             angular.forEach(tmp_order,function(value,index,tmp_order){
                             $log.debug(value.order_history);
                             });
                             }
                             */

                            //Print Jobchains for debug 
                            $log.debug("===========jobchains===============");
                            angular.forEach(jobchain_obj, function (value, index, jobchain_obj) {
                                $log.debug(value._name);
                            });

                            //Filter to Jobs
                            $log.debug("===========filter job name=================");
                            print_jobchain = (function (jobchain_obj) {
                                tmp_obj = [];

                                //System Job List for Default Filtering
                                filter = ['CleanupNotifications', 'Reporting', 'jade_history_file_order', 'ResetNotifications', 'Inventory', 'SystemNotifier', 'CheckHistory', 'jade_history_receive', 'UncriticalJobNodes', 'jade_history', 'ideal_insert_to_export_table_parallel'];

                                // Search Jobchain 
                                if (typeof (parameter.jobchain_name) != "undefined" && parameter.jobchain_name) {
                                    angular.forEach(jobchain_obj, function (value, index, jobchain_obj) {
                                        if (value._name.match(parameter.jobchain_name))
                                            tmp_obj.push(value);
                                    });
                                } else { //Filter System Jobs
                                    angular.forEach(jobchain_obj, function (value, index, jobchain_obj) {
                                        result = filterFilter(filter, value._name);
                                        if (result.length == 0) {
                                            tmp_obj.push(value);
                                        }
                                    });
                                }
                                return tmp_obj;
                            }(jobchain_obj));

                            $log.debug(print_jobchain);

                            //Calculate number of jobchains for resizing canvas
                            max_jobchain = (function (print_jobchain) {
                                max_length = 0;
                                angular.forEach(print_jobchain, function (value, index, print_jobchain) {
                                    if (max_length < value.job_chain_node.length)
                                        max_length = value.job_chain_node.length;
                                });
                            }(print_jobchain));

                            $log.debug(max_length);
                            $log.debug(print_jobchain.length);

                            $scope.nodes = [];

                            //Draw JobMap of JobChains
                            drawinit(render($document, max_length, print_jobchain.length), print_jobchain, jobchain_obj_history);

                        })
                        .error(function (data, status, headers, config) {
                            $scope.result = "error";
                            $log.debug($scope.result);
                        });

                //Convert xml to Json
                function xmltoJson(data) {
                    x2js = new X2JS();
                    jsonObj = x2js.xml_str2json(data);
                    $log.debug(jsonObj);
                    obj = angular.fromJson(jsonObj);
                    return jsonObj
                }

                //Allocate Canvas & Set EventHandler
                function render($document, jobnum_width, jobnum_height) {
                    var canvas = $document.find('canvas')[0];
                    if (jobnum_width == 0)
                        canvas.width = 800;
                    else
                        canvas.width = 100 + 150 * jobnum_width + 60 * jobnum_width + 100;

                    if (jobnum_height == 0)
                        canvas.height = 400;
                    else
                        canvas.height = 100 + 100 * jobnum_height + 50 * jobnum_height + 300;

                    $log.debug(canvas.width);
                    $log.debug(canvas.height);

                    //Set EventHandler for Log
                    canvas.addEventListener('click', onClick, false);
                    var ctx = canvas.getContext('2d');
                    return ctx;
                }

                //Draw JobChains
                function drawinit(ctx, job_chains, jobchain_obj_history) {
                    //Draw Paramateres
                    ArrowColor = '#000000';
                    NodeColor = '#98fb98';
                    JobColor = '#00ff7f';
                    TextColor = '#000000';
                    defaultwidth = 150
                    defaultheight = 100;
                    defaultfontsize = "14px";
                    defaultfontstyle = "Italic Bold";
                    defaultfontkind = "arial, sans-serif";
                    startx = 20;
                    starty = 40;
                    fontspace = 20;
                    nodespace = 40;
                    jobspace = 50;

                    //Draw Point X and Y
                    nowx = startx;
                    nowy = starty;

                    $log.debug("==================Start Draw Jobs====================");
                    $log.debug(job_chains);

                    //Print Message if no Jobchains
                    if (job_chains.length == 0) {
                        drawText(ctx, TextColor, 100, 100, "該当するジョブチェインはありません", defaultfontstyle, "30px", defaultfontkind);
                    }

                    //Get states of Each Jobs
                    angular.forEach(job_chains, function (value, index, job_chains) {
                        $log.debug(value);
                        nodes = value.job_chain_node;
			$log.debug(nodes);
                        $log.debug("==========draw jobchain:" + value._name + "===============");

                        drawText(ctx, TextColor, nowx, nowy - fontspace, value._name, defaultfontstyle, defaultfontsize, defaultfontkind);
                        jobchain = value._name;
			jobchain_title = "";

		     angular.forEach(nodes, function (value_node, index_node, nodes) {
			state = "";
			$log.debug("===========================value_node=============================");
			jobchain_title = value_node._job;
                        angular.forEach(jobchain_obj_history, function (value_history, index_history, jobchain_obj_history) {
			    tmphistory = value_history.history;
                            angular.forEach(tmphistory, function (task, index_task, tmphistory) {
                                 if(!angular.isUndefined(jobchain_title)){
				     if (jobchain_title.match(task._job_name) && state == "" && typeof(task._jobname) !== "undefined") {
                                        if (!angular.isUndefined (task[0].ERROR)) {
                                                state = "error";
                                        } else {
                                            state = "finish";
                                        }

                                    } else if (task.length > 1) {
                                        angular.forEach(task, function (task_job, index_task, task) {
                                            if (typeof (task_job._job_name) !== "undefined") {
                                                if (jobchain_title.match(task_job._job_name)) {
                                                    if (!angular.isUndefined(task[0].ERROR)) {
                                                        state = "error";
                                                    } else {
                                                        state = "finish";
                                                    }
                                                }
                                            }
                                        });
                                    } 
				}
                            });

                        });
			if(state === "")
				state = "unexecuted";

                        $log.debug("state: " + state);

                            // Print Jobchains of Parallel (Unimplemented)
                            if (!angular.isUndefined(value_node._job)) {
                                if (value_node._job.match("jitl") != null) {
                                    jtil = value_node._job.split("jitl");
                                    jtil = jtil[jtil.length - 1];
                                    $log.debug("Detect JITL:" + jtil);
                                }
                                $log.debug("draw node:" + value_node._job);

                                //Job Node Info
                                obj = {};
                                obj['jobchainame'] = value._name;
                                obj['x'] = nowx;
                                obj['y'] = nowy;
                                obj['width'] = defaultwidth;
                                obj['height'] = defaultheight;
                                obj['nodename'] = value_node._state;
                                obj['jobname'] = value_node._job;
                                $scope.nodes.push(obj);

				//choose Job and Node Color
				if(state == "error"){
				    NodeColor = "#ff0000";
				    JobColor = "#ff6347";
				}
				else if(state == "unexecuted"){
				    NodeColor = "#87ceeb";
				    JobColor = "#4682b4";
				}
				else{
				    NodeColor = "#98fb98";
				    JobColor = "#00ff7f";	
				}

                                //Draw Rectangle
                                drawRect(ctx, NodeColor, JobColor, nowx, nowy, defaultwidth, defaultheight, value_node._state, value_node._job);

                                //Draw Allow 
                                drawLine(ctx, ArrowColor, nowx, nowy, defaultwidth, defaultheight, nowx + defaultwidth + nodespace * 2, nowy, defaultwidth, defaultheight); //x,y,w,h,x2,y2,w2,h2

                                //Update Draw Point
                                nowy = nowy;
                                nowx = nowx + defaultwidth + nodespace * 2;
                            }
                        });

                        drawRect(ctx, NodeColor, JobColor, nowx, nowy, defaultwidth, defaultheight, "finish", "finish");

                        //Init Points for Drawing Next Job Chains
                        nowx = startx;
                        nowy = nowy + jobspace + defaultheight;
                    });

                }

                //Log View when a user clicks job
                function onClick(e) {
                    //Get click position
                    var rect = e.target.getBoundingClientRect();
                    x = e.clientX - rect.left;
                    y = e.clientY - rect.top;

                    $log.debug(x);
                    $log.debug(y);

                    //Jobs Parameters
                    tmpobj = $scope.nodes;
                    taskid = 0;
                    jobname = "";

                    //Get Jobs clicked
                    angular.forEach(tmpobj, function (value, index, tmpobj) {
                        if ((x >= value.x && (x <= value.x + value.width)) && (y >= value.y && (y <= value.y + value.height))) {
                            jobname = value.jobname;
                            $log.debug("click jobname: " + jobname);
                        }
                    });

                    //Get Log 
                    api = url + '<show_state what=\"task_history\"/>';
                    $http({
                        method: 'GET',
                        url: api
                    })
                            .success(function (data, status, $http) {
                                obj = xmltoJson(data);
                                tmpjobs = obj.spooler.answer.state.jobs.job;

                                //Get TaskID of Job
                                angular.forEach(tmpjobs, function (value, index, tmpjobs) {
                                    tmphistory = value.history;
                                    angular.forEach(tmphistory, function (task, index_task, tmphistory) {
                                        if (typeof (task._job_name) !== "undefined") {
                                            if (jobname.match(task._job_name)) {
                                                $log.debug("taskid: " + task._task);
                                                taskid = task._task;
                                            }
                                        } else if (task.length > 1) {
                                            angular.forEach(task, function (task_job, index_task, task) {
                                                $log.debug(task_job);
                                                if (typeof (task_job._job_name) !== "undefined") {
                                                    if (jobname.match(task_job._job_name)) {
                                                        $log.debug("taskid: " + task_job._task);
                                                        taskid = task_job._task;
                                                    }
                                                }
                                            });
                                        }
                                    });

                                });

                                //Print Messeage if no Log
                                if (taskid == 0) {
                                    $scope.textlog = "ログはありません";
                                } else {
                                    getLog(taskid);
                                }

                            });
                }

                //Get Log using taskid
                function getLog(taskid) {
                    var task_param = {task: taskid};
                    api = url + 'show_log';
                    $http({
                        method: 'GET',
                        url: api,
                        params: task_param
                    })
                            .success(function (data, status, $http) {
                                $scope.textlog = data;
                            });
                }

                //参考: http://honttoni.blog74.fc2.com/blog-entry-185.html
                //Draw Rectangle Nodes
                function drawRect(ctx, NodeColor, JobColor, x, y, w, h, nodename, jobname) {
		    //Circle of Outline
                    ctx.beginPath();
                    ctx.moveTo(x + 10, y);
                    ctx.arcTo(x + w, y, x + w, y + 10, 10);
                    ctx.arcTo(x + w, y + h, x + w - 10, y + h, 10);
                    ctx.arcTo(x, y + h, x, y + h - 10, 10);
                    ctx.arcTo(x, y, x + 10, y, 10);

                    ctx.fillStyle = NodeColor;

                    ctx.globalAlpha = 0.5;
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = '#ffbf00';
                    ctx.lineWidth = 3;
                    ctx.stroke();

                    ctx.fillStyle = '#000';
                    ctx.fillText(nodename, x + 8, y + 17);

                    ctx.fillText(nodename, x + 8, y + 17);
                    //Cicle of Inline
                    ctx.beginPath();
                    y += 30;
                    h -= 34;
                    ctx.moveTo(x + 10 + 4, y);
                    ctx.arcTo(x + w - 4, y, x + w - 4, y + 10, 10);
                    ctx.arcTo(x + w - 4, y + h, x + w - 10 - 4, y + h, 10);
                    ctx.arcTo(x + 4, y + h, x, y + h - 10 - 4, 10);
                    ctx.arcTo(x + 4, y, x + 10 + 4, y, 10);

                    ctx.fillStyle = JobColor;

                    ctx.globalAlpha = 0.5;
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                    ctx.strokeStyle = '#ffbf00';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.fillStyle = '#000';

                    //Print JobName
                    while (true) {
                        ctx.fillText(jobname.substr(0, 25), x + 8, y + 17);
                        jobname = jobname.substr(25);
                        y += 17;
                        if (jobname.length < 25) {
                            ctx.fillText(jobname.substr(0, 25), x + 8, y + 17);
                            break;
                        }
                    }

                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#000000';
                }

                //Draw Allow
                function drawLine(ctx, ArrowColor, x, y, w, h, x2, y2, w2, h2) {
                    ctx.beginPath();
                    ctx.fillStyle = ArrowColor;
                    ctx.moveTo(x + w, h / 2 + y);
                    ctx.lineTo(x2, h2 / 2 + y2);
                    ctx.stroke();
                }

                //Draw Allow Branch (Unimplemented)
                function drawBranch(ctx, x, y, w, h, x2, y2, w2, h2) {
                    ctx.beginPath();
                    ctx.moveTo((x + w + x2) / 2, y + h / 2);
                    ctx.lineTo((x + w + x2) / 2, y2 + h2 / 2);

                    ctx.moveTo((x + w + x2) / 2, y2 + h2 / 2);
                    ctx.lineTo(x2, y2 + h2 / 2);
                    ctx.stroke();
                }

                //Draw Merge Allow (Unimplemented)
                function drawMerge(ctx, ArrowColor, x, y, w, h, x2, y2, w2, h2) {
                    ctx.beginPath();
                    ctx.fillStyle = ArrowColor;
                    ctx.moveTo(x + w, y + (h2 / 2));
                    ctx.lineTo(x2, h2 / 2 + y2);
                    ctx.stroke();
                    $log.debug(ArrowColor);
                }

                //Draw Nodes Text (Unimplemented)
                function drawText(ctx, TextColor, x, y, text, fontstyle, fontsize, kind) {
                    ctx.fillStyle = TextColor;
                    tmpfont = ctx.font;
                    ctx.font = fontstyle + " " + String(fontsize) + " \'" + kind + "\'";
                    $log.debug(fontstyle + " " + String(fontsize) + " \'" + kind + "\'");
                    ctx.fillText(text, x, y);
                    ctx.font = tmpfont;
                }

                //Draw Error Text (Unimplemented)
                function drawTextError(ctx, TextColor, x, y, text, font) {
                    drawText(ctx, TextColor, x - 10, y - 10, text, font);
                }

            };
        });
