
//字段标志
var fieldSign = '';

var serverDataArray = new Array();

//当前操作的栏目
var targetClassId;

//所有图片组
var imageGroup = new Array();


//所有已经上传的图片
var allUploadImageInfoArray = new Array();

//已经存在的图片
var allExistImageInfoArray = new Array();

//已经删除的图片
var mustDeleteImageInfoArray = new Array();

var dialogApi = '';


function fileQueueError(file, errorCode, message) {
	
	var api = frameElement.api, W = api.opener; 
	
	var window = W;
			
	if('' != dialogApi)
	{
		window =  api.get('main_content');
	}
	
	try {
		var imageName = "<font color='red'>文件上传错误</font>";
		var errorName = "";
		if (errorCode === SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED) {
			errorName = "You have attempted to queue too many files.";
		}

		if (errorName !== "") {
			//alert(errorName);
			return;
		}
		
		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			window.$.dialog.tips('文件大小为0...',1);
			break;
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			window.$.dialog.tips('文件大小超过限制...',1); 
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
		default:
			//alert(message);
			break;
		}
		
	} catch (ex) {
		this.debug(ex);
	}
}

/**
 * 当文件选择对话框关闭消失时，如果选择的文件成功加入上传队列，
 * 那么针对每个成功加入的文件都会触发一次该事件（N个文件成功加入队列，就触发N次此事件）。
 * @param {} file
 * id : string,			    // SWFUpload控制的文件的id,通过指定该id可启动此文件的上传、退出上传等
 * index : number,			// 文件在选定文件队列（包括出错、退出、排队的文件）中的索引，getFile可使用此索引
 * name : string,			// 文件名，不包括文件的路径。
 * size : number,			// 文件字节数
 * type : string,			// 客户端操作系统设置的文件类型
 * creationdate : Date,		// 文件的创建时间
 * modificationdate : Date,	// 文件的最后修改时间
 * filestatus : number		// 文件的当前状态，对应的状态代码可查看SWFUpload.FILE_STATUS }
 */
function fileQueued(file)
{
	var api = frameElement.api, W = api.opener; 
	 //alert(file.id +' : ' + file.index + ' : ' + file.name + " : " +file.size + ' : ' +file.type );
	//addReadyFileInfo(file.id,file.name,"成功加载到上传队列");

	swfu.addPostParam("type", 1);
	swfu.addPostParam("classId", targetClassId);
	swfu.addPostParam("file.size",file.size);
	swfu.addPostParam("file.type",file.type);
	swfu.addPostParam("fileCount", swfu.getStats().files_queued);
	
	
	
    var kbSize =  accDiv(file.size,1024);
	 var size = 0;
	 var testKb = Math.floor(kbSize);
	 if(testKb > 1024)
	 {
	 	size = accDiv(file.size,1024 * 1024).toFixed(1)+" MB";	
	 }else
	 {
	 	size = kbSize.toFixed(1)+" KB";	
	 }
	 
	 document.getElementById('fileInfo').value = document.getElementById('fileInfo').value + file.name+' ('+size+')  \n';
	 
	
	
	
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	//alert('hjhkhkj:'+(numFilesQueued > 0)+' : '+numFilesSelected);
	try {
		if (numFilesQueued > 0) {
			//document.getElementById('btnCancel').disabled = "";
			//this.startUpload();
			//document.getElementById("divProcessing").style.display='';
		}
	} catch (ex) {
		this.debug(ex);
	}
}


function startUploadFile()
{	
	var api = frameElement.api, W = api.opener; 
	
	var window = W;
			
	if('' != dialogApi)
	{
		window =  api.get('main_content');
	}
	
	if(swfu.getStats().files_queued >0)
	{
		//动态设定参数在此设定
		swfu.addPostParam("maxWidth", document.getElementById('maxWidth').value);
		swfu.addPostParam("maxHeight", document.getElementById('maxHeight').value);
		swfu.addPostParam("disposeMode", document.getElementById('disposeMode').value);
		//swfu.addPostParam("titleName", encodeURI(document.getElementById('titleName').value));
		
        //swfu.addPostParam("mark", getRadioCheckedValue('needMark'));
        
		document.getElementById("divProcessing").style.display='';
		
 		swfu.startUpload();
	}
	else
	{
		if('undefined' != typeof(imageOrder) && imageOrder != -1)
		{
			//图集独立编辑模式，可以只改动名称
			 window.document.getElementById('photoName-'+imageOrder).value = document.getElementById('photoName').value;
			 window.document.getElementById('resizeUrl-'+imageOrder).alt = document.getElementById('photoName').value;
			 
			 api.close();
		}
		else
		{
			window.$.dialog
			({ 
						id:'filetip',
	   					title :'提示',
	    				width: '160px', 
	    				height: '60px', 
	                    lock: true, 
	    				icon: '32X32/i.png', 
	    				parent:api,
	                    content: '请选择所需上传文件',
	                    
	   				 	cancel: true 
	    	});	
		}
	
		
	}
}

function uploadProgress(file, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / file.size) * 100);
		
		if (percent > 100) {
			percent = 100;
		}
		
		$('#uploadPercent').html(percent+"%");
		//document.getElementById("uploadPercent")
		//alert(file.name+" -: "+percent+"%");

		var progress = new FileProgress(file,  this.customSettings.upload_target);
		progress.setProgress(percent);
		 
		if (percent >= 100) {
			progress.setStatus("");//正在创建缩略图...
			progress.toggleCancel(false, this);
		} else {
			progress.setStatus("正在上传...");
			addFileInfo(file.id,"正在上传...");
			progress.toggleCancel(true, this);
		}
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	//try {
		//var progress = new FileProgress(file,  this.customSettings.upload_target);
	//	addFileInfo(file.id,"文件上传完成");
	//	addFileId(file.id,serverData);
		//alert("success:"+serverData);
		
		serverDataArray.push(serverData);
		
		
	//} catch (ex) {
	//	this.debug(ex);
	//}
}

function addFileId(fileId,id){
	var row = document.getElementById(fileId);
	row.cells[4].innerHTML = id;
//	alert(row.cells[4].innerHTML);
}
function addFileInfo(fileId,message){
	var row = document.getElementById(fileId);
	row.cells[2].innerHTML = "<font color='green'>"+message+"</font>";
}
function addReadyFileInfo(fileid,fileName,message,status){
	//用表格显示
	var infoTable = document.getElementById("infoTable");
	$("#thumbnails").css("display","block");
	//获取浏览器的类型
	var oType = getBrowserType();
	var row;
	var col1;
	var col2;
	var col3;
	var col4;
	var col5;
	switch(oType){
	    case "ie":
	    	row = infoTable.insertRow();
	    	row.id = fileid;
	    	col1 = row.insertCell();
	    	col2 = row.insertCell();
	    	col3 = row.insertCell();
	    	col4 = row.insertCell();
	    	col5 = row.insertCell();
	        break;
	    case "firefox":
	    	row = infoTable.insertRow(-1);
	    	row.id = fileid;
	    	col1 = row.insertCell(-1);
	    	col2 = row.insertCell(-1);
	    	col3 = row.insertCell(-1);
	    	col4 = row.insertCell(-1);
	    	col5 = row.insertCell(-1);
	        break;
	    default:
	    	row = infoTable.insertRow();
	    	row.id = fileid;
	    	col1 = row.insertCell();
	    	col2 = row.insertCell();
	    	col3 = row.insertCell();
	    	col4 = row.insertCell();
	    	col5 = row.insertCell();
	        break;
	}
	col4.align = "right";
	col1.innerHTML = message+" : ";
	col2.innerHTML = fileName;
	if(status!=null&&status!=""){
		col3.innerHTML="<font color='red'>"+status+"</font>";
	}else{
		col3.innerHTML="";
	}
	col4.innerHTML = "<a href='javascript:deleteFile(\""+fileid+"\")'>删除</a>";
	col1.style.width="150";
	col2.style.width="150";
	col3.style.width="80";
	col4.style.width="50";
	col5.style.display="none";
}

function cancelUpload(){
	var infoTable = document.getElementById("infoTable");
	var rows = infoTable.rows;
	var ids = new Array();
	var row;
	if(rows==null){
		return false;
	}
	for(var i=0;i<rows.length;i++){
		ids[i] = rows[i].id;
	}	
	for(var i=0;i<ids.length;i++){
		deleteFile(ids[i]);
	}	
}

function deleteFile(fileId){
	//用表格显示
	var infoTable = document.getElementById("infoTable");
	var row = document.getElementById(fileId);
	var filePath = row.cells[4].innerHTML;
	//删除上传成功的文件
	$.ajax({
		type : 'post',
		url : "DeleteFileServlet",
		data : 'filePath='+filePath,
		success : function(data) { // 判断是否成功
			//处理被删除的节点
			infoTable.deleteRow(row.rowIndex);
			swfu.cancelUpload(fileId,false);
		},
		error:function(data){
			addFileInfo(fileId,"<font color='red'>删除文件夹出错</a>");
		}
	});
	
}



function uploadComplete(file) {
	
	//try {
		/*  I want the next upload to continue automatically so I'll call startUpload here */
		if (this.getStats().files_queued > 0) {
			this.startUpload();
		} else 
		{
			var api = frameElement.api, W = api.opener; 
			
			var window = W;
			
			if('' != dialogApi)
			{
				window =  api.get('main_content');
			}
			
			var currentCount = parseInt(window.document.getElementById(fieldSign+'CmsSysImageCurrentCount').value);
		 
			var imageCount = 0;
			
			var sortArray = window.allImageGroupSortInfo[fieldSign];
			
		    var mw = window.document.getElementById(fieldSign+'CmsSysMaxWidth').value;
		    
		    var mh = window.document.getElementById(fieldSign+'CmsSysMaxHeight').value;
								
			for(var i = 0 ; i < serverDataArray.length; i++)
			{
				 	 
				var jsonObj = eval("("+serverDataArray[i]+")");
				
				//addImage(jsonObj.obj_0.resizeImageUrl);
		       
		        imageCount = parseInt(sortArray.length) ;
		        
		       // imageCount = currentCount + 1;
											
	            var pName = jsonObj.obj_0.imageName.substring(0,jsonObj.obj_0.imageName.indexOf('.'));	
	            	 
		        var uploadImageTr =	 
		        '<div id="'+fieldSign +'-cmsSysDiv-'+imageCount+'" style="height:12px"></div>'
		        +'<table id="'+fieldSign +'-uploadPhotoTable-'+imageCount+'" border="0" cellpadding="0" cellspacing="0" class="form-table-upload">'
								+'<tr>'
									+'<td>'
										 +'<a id="'+fieldSign +'-cmsSysImageShowUrl-'+imageCount+'" href="'+jsonObj.obj_0.imageUrl+'" class="cmsSysShowSingleImage"><img id="'+fieldSign +'-resizeUrl-'+imageCount+'" src="'+jsonObj.obj_0.resizeImageUrl+'" width="141" height="102" title="'+pName+'"/></a>'
										 +'<input type="hidden" id="'+fieldSign +'-resId-'+imageCount+'" name="'+fieldSign +'-resId-'+imageCount+'" value="'+jsonObj.obj_0.resId+'" />'
										 +'<input type="hidden" id="'+fieldSign +'-relatePath-'+imageCount+'" name="'+fieldSign +'-relatePath-'+imageCount+'" value="'+jsonObj.obj_0.relatePath+'" />'
										 +'<input type="hidden" id="'+fieldSign +'-photoName-'+imageCount+'" name="'+fieldSign +'-photoName-'+imageCount+'" value="'+pName+'" />'	
										 +'<input type="hidden" id="'+fieldSign +'-photoOutLinkUrl-'+imageCount+'" name="'+fieldSign +'-photoOutLinkUrl-'+imageCount+'" value="" />'
										 +'<input type="hidden" id="'+fieldSign +'-orderFlag-'+imageCount+'" name="'+fieldSign +'-orderFlag-'+imageCount+'" value="'+imageCount+'" />'
										 +'<input type="hidden" id="'+fieldSign +'-height-'+imageCount+'" name="'+fieldSign +'-height-'+imageCount+'" value="'+jsonObj.obj_0.height+'" />'
										 +'<input type="hidden" id="'+fieldSign +'-width-'+imageCount+'" name="'+fieldSign +'-width-'+imageCount+'" value="'+jsonObj.obj_0.width+'" />'
									+'</td>'
									+'<td>'
										+'<table border="0" cellpadding="0" cellspacing="0" height="95px" class="form-table-big">'
											+'<tr>'
												+'<td>'
													+'&nbsp;&nbsp;'
													+'<textarea id="'+fieldSign +'-photoDesc-'+imageCount+'" name="'+fieldSign +'-photoDesc-'+imageCount+'" style="height:65px;width:598px" class="form-textarea"></textarea>'										
													+'&nbsp;&nbsp;&nbsp;<img class="a_pointer" src="../../core/style/icons/arrow-skip-090.png" onclick=\'javascript:changePhotoPos("'+fieldSign+'", '+imageCount+', "up")\' />'
												+'</td>'
											+'</tr>'
											+'<tr>'
												+'<td>'
												    +'&nbsp;&nbsp;封面&nbsp;<input class="form-checkbox" id="'+fieldSign +'-cover-'+imageCount+'" name="'+fieldSign +'-cover" onclick="javascript:setImageGroupCover(\''+fieldSign +'\',\''+imageCount+'\',\''+jsonObj.obj_0.relatePath+'\');" type="checkbox" value="1"/>&nbsp;'
												    +'&nbsp;&nbsp;名称&nbsp;<input style="width:177px;" class="form-input" id="'+fieldSign +'-name-show-'+imageCount+'" name="'+fieldSign +'-name-show-'+imageCount+'" type="text" value="'+pName+'"/>&nbsp;'
													+'&nbsp;&nbsp;宽&nbsp;'
													+'<input id="'+fieldSign +'-width-show-'+imageCount+'" class="form-input" readonly type="text" style="width:43px;" value="'+jsonObj.obj_0.width+'"/>'
													+'&nbsp;&nbsp;高&nbsp;'
													+'<input id="'+fieldSign +'-height-show-'+imageCount+'" class="form-input" readonly type="text" style="width:43px;" value="'+jsonObj.obj_0.height+'"/>'

													//+'&nbsp;<input type="checkbox" class="form-checkbox" />水印' 
													//+'&nbsp;<input type="checkbox" class="form-checkbox" />内容' 
													+'&nbsp;&nbsp;'
													+'&nbsp;&nbsp;&nbsp;<input type="button" value="替换" onclick="javascript:showEditSingleImageDialog(\''+fieldSign+'\', \''+imageCount+'\')" class="btn-1" />&nbsp;'
													+'<input type="button" value="裁剪" onclick="javascript:disposeImage(\''+fieldSign +'\',\''+mw+'\',\''+mh+'\','+true+',\''+imageCount+'\');" class="btn-1" />&nbsp;'

													+'<input type="button" value="删除" onclick="javascript:deleteGroupPhotoSingleInfo(\''+fieldSign+'\', \''+imageCount+'\', \''+jsonObj.obj_0.relatePath+'\');" width="16" height="16" alt="删除图片" class="btn-1" />'
													
													+'&nbsp;&nbsp;&nbsp;<img class="a_pointer" src="../../core/style/icons/arrow-skip-270.png" onclick=\'javascript:changePhotoPos("'+fieldSign+'", '+imageCount+', "down")\' />'
												+'</td>'
											+'</tr>'
										+'</table>'
									+'</td>'
								+'</tr>'
				+'</table>';
				
               
				allUploadImageInfoArray.push(jsonObj.obj_0.relatePath);
								
				//alert(uploadImageTr2);
				sortArray[imageCount] = imageCount;
				
				//设定当前数组实际数量
				window.document.getElementById(fieldSign+'CmsSysImageArrayLength').value = sortArray.length;
				
				$(window.document.getElementById(fieldSign+'CmsSysImageUploadTab')).append(uploadImageTr);
				
				document.getElementById("divProcessing").style.display='none';
			}
			
			//总图片数
			//计算真实图片数
			var count = 0;
			for(var i = 0 ; i< sortArray.length;i++)
			{
				if(sortArray[i] != null)
				{
					 count++;
				}
				
			}
				
			window.document.getElementById(fieldSign+'CmsSysImageCurrentCount').value = count;
			
			window.document.getElementById(fieldSign+'CmsSysImageGroupCount').innerHTML = window.document.getElementById(fieldSign+'CmsSysImageCurrentCount').value;
	
			//为同一页面下一次上传做准备
			serverDataArray = new Array();
			//alert('asd');
			//加载图片显示效果
			window.loadImageShow();
			
			
			//alert(W.document.getElementById(fieldSign+'CmsSysImageCurrentCount').value);
			
			api.close();
		}
	//} catch (ex) {
	//	this.debug(ex);
	//}
}



function disposeImage(imageUrl,w,h,relatePath)
{
	$.dialog({ 
	    id : 'di',
    	title : '编辑图片',
    	width: '1080px', 
	    height: '625px',
    	lock: true, 
        max: false, 
        min: false,
        resize: false,
       
       // content: 'url:'+base+'/core/content/CropImageArea.jsp?imageUrl='+imageUrl
      
        
        content: 'url:'+basePath+'/core/content/DisposeImage.jsp?imageUrl='+imageUrl+"&width="+w+"&height="+h+"&relatePath="+relatePath

	});
	
}



function uploadError(file, errorCode, message) {
	var imageName =  "<font color='red'>文件上传出错!</font>";
	var progress;
	try {
		alert(errorCode+" : "+message);
		switch (errorCode) 
		{
			
			case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
				try {
					progress = new FileProgress(file,  this.customSettings.upload_target);
					progress.setCancelled();
					progress.setStatus("<font color='red'>取消上传!</font>");
					progress.toggleCancel(false);
				}
				catch (ex1) {
					this.debug(ex1);
				}
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
				try {
					progress = new FileProgress(file,  this.customSettings.upload_target);
					progress.setCancelled();
					progress.setStatus("<font color='red'>停止上传!</font>");
					progress.toggleCancel(true);
				}
				catch (ex2) {
					this.debug(ex2);
				}
			case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
				imageName = "<font color='red'>文件大小超过限制!</font>";
				break;
			default:
				//alert('i:'+message);
				break;
		}
		addFileInfo(file.id,imageName);
	} catch (ex3) {
		this.debug(ex3);
	}

}


function addImage(src) {

	var newImg = document.createElement("img");
	newImg.style.margin = "5px";

	document.getElementById("thumbnails").appendChild(newImg);
	if (newImg.filters) {
		try {
			newImg.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 0;
		} catch (e) {
			// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
			newImg.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + 0 + ')';
		}
	} else {
		newImg.style.opacity = 0;
	}

	newImg.onload = function () {
		fadeIn(newImg, 0);
	};
	newImg.src = src;
}

function fadeIn(element, opacity) {
	var reduceOpacityBy = 5;
	var rate = 30;	// 15 fps


	if (opacity < 100) {
		opacity += reduceOpacityBy;
		if (opacity > 100) {
			opacity = 100;
		}

		if (element.filters) {
			try {
				element.filters.item("DXImageTransform.Microsoft.Alpha").opacity = opacity;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')';
			}
		} else {
			element.style.opacity = opacity / 100;
		}
	}

	if (opacity < 100) {
		setTimeout(function () {
			fadeIn(element, opacity);
		}, rate);
	}
}



/* ******************************************
 *	FileProgress Object
 *	Control object for displaying file info
 * ****************************************** */
/**
 * 此方法目前没用到，显示的层已经隐藏了。如果需要的话，只需要把divFileProgressContainer
 * 这个层的display设置为显示就行
 */
function FileProgress(file, targetID) {
	this.fileProgressID = "divFileProgress";

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;

		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "progressContainer";

		var progressCancel = document.createElement("a");
		progressCancel.className = "progressCancel";
		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.appendChild(document.createTextNode(" "));

		var progressText = document.createElement("div");
		progressText.className = "progressName";
		progressText.appendChild(document.createTextNode("上传文件: "+file.name));

		var progressBar = document.createElement("div");
		progressBar.className = "progressBarInProgress";

		var progressStatus = document.createElement("div");
		progressStatus.className = "progressBarStatus";
		progressStatus.innerHTML = "&nbsp;";

		this.fileProgressElement.appendChild(progressCancel);
		this.fileProgressElement.appendChild(progressText);
		this.fileProgressElement.appendChild(progressStatus);
		this.fileProgressElement.appendChild(progressBar);

		this.fileProgressWrapper.appendChild(this.fileProgressElement);
		document.getElementById(targetID).style.height = "75px";
		document.getElementById(targetID).appendChild(this.fileProgressWrapper);
		fadeIn(this.fileProgressWrapper, 0);

	} else {
		this.fileProgressElement = this.fileProgressWrapper.firstChild;
		this.fileProgressElement.childNodes[1].firstChild.nodeValue = "上传文件: "+file.name;
	}

	this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
	this.fileProgressElement.className = "progressContainer green";
	this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
	this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
	this.fileProgressElement.className = "progressContainer blue";
	this.fileProgressElement.childNodes[3].className = "progressBarComplete";
	this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setError = function () {
	this.fileProgressElement.className = "progressContainer red";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setCancelled = function () {
	this.fileProgressElement.className = "progressContainer";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setStatus = function (status) {
	this.fileProgressElement.childNodes[2].innerHTML = status;
};

FileProgress.prototype.toggleCancel = function (show, swfuploadInstance) {
	this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
	if (swfuploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement.childNodes[0].onclick = function () {
			swfuploadInstance.cancelUpload(fileID);
			return false;
		};
	}
};


