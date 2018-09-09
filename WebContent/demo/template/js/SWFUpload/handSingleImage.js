//字段标志
var resBase;

var fieldSign = '';

var imageSrcId;

var imageValId;

var groupEditMode = 'false'

//是否是弹出窗口打开上传
var isDialogMode = 'false';

//弹出窗口的id
var apiId;

//当前操作的栏目
var targetClassId;

//图集模式单图上传的orderId
var imageOrder = -1;

//字段名
var fieldSign = '';

var serverDataArray = new Array();

var sortArray = new Array();

//只允许一个图片上传
var prevFileId = null;

//var allImageInfoArray = new Array();

//var mustDeleteImageInfoArray = new Array();

var entry;

var errorf = false;

function fileQueueError(file, errorCode, message) {
	try {
		var imageName = "<font color='red'>文件上传错误</font>";
		var errorName = "";
		if (errorCode === SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED) {
			errorName = "You have attempted to queue too many files.";
		}

		if (errorName !== "") {
			alert("e"+errorName);
			return;
		}
		
		
		
		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			imageName = "<font color='red'>文件大小为0</font>";
			break;
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			imageName = "<font color='red'>文件大小超过限制</font>";
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			break;
		//超过数量不处理,只显示一个
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			var api = frameElement.api, W = api.opener; 
	
			W.$.dialog
			({ 
						id:'filetip',
	   					title :'提示',
	    				width: '160px', 
	    				height: '60px', 
	                    lock: true, 
	    				icon: '32X32/i.png', 
	    				parent:api,
	                    content: '只可选择一个文件',
	                    
	   				 	cancel: true 
	    	});	
	    

			break;
		default:
			alert("m:"+errorCode+" - "+message);
			break;
		}
		addReadyFileInfo(file.id,file.name,imageName,"无法上传");

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
function fileQueuedP(file)
{
	//alert(prevFileId);
	if(prevFileId != null)
	{

		swfuP.cancelUpload(prevFileId);
		//document.getElementById('fileInfo').value = '';
	}
	
	 
	prevFileId = file.id;
	
		//alert('asd');
	
	 //alert(file.id +' : ' + file.index + ' : ' + file.name + " : " +file.size + ' : ' +file.type );
	//addReadyFileInfo(file.id,file.name,"成功加载到上传队列");
	 swfuP.addPostParam("type", 1);
	 //swfuP.addPostParam("classId", targetClassId);
	 swfuP.addFileParam(file.id,"fileSize", file.size);
	 swfuP.addFileParam(file.id,"fileType", file.type);
	 
	
	 

	
	 swfuP.addPostParam("fileCount", swfuP.getStats().files_queued);
	 swfuP.addPostParam("maxResize", '360');

	 if(swfuP.getStats().files_queued >0)
	{
		//动态设定参数在此设定
		
		
    
 		swfuP.startUpload();
	}
	else
	{
		alert("请选择图片！");
	}
}

function fileQueuedR(file)
{
	if(prevFileId != null)
	{
		swfuR.cancelUpload(prevFileId);
		//document.getElementById('fileInfo').value = '';
	}
	
	 
	prevFileId = file.id;

	
	
	 //alert(file.id +' : ' + file.index + ' : ' + file.name + " : " +file.size + ' : ' +file.type );
	//addReadyFileInfo(file.id,file.name,"成功加载到上传队列");
	 swfuR.addPostParam("type", 1);
	 //swfuP.addPostParam("classId", targetClassId);
	 swfuR.addFileParam(file.id,"fileSize", file.size);
	 swfuR.addFileParam(file.id,"fileType", file.type);
	 
	
	 

	
	 swfuR.addPostParam("fileCount", swfuR.getStats().files_queued);
	 swfuR.addPostParam("maxResize", '360');
	 
	 

	 if(swfuR.getStats().files_queued >0)
	{
		//动态设定参数在此设定
		
		
    
 		swfuR.startUpload();
	}
	else
	{
		alert("请选择图片！");
	}
	 
}



function fileQueued(file)
{
	//alert(prevFileId);
	if(prevFileId != null)
	{

		swfuH.cancelUpload(prevFileId);
		//document.getElementById('fileInfo').value = '';
	}
	
	 
	prevFileId = file.id;
	

	 swfuH.addPostParam("type", 1);
	 //swfuP.addPostParam("classId", targetClassId);
	 swfuH.addFileParam(file.id,"fileSize", file.size);
	 swfuH.addFileParam(file.id,"fileType", file.type);
	 
	
	 

	
	 swfuH.addPostParam("fileCount", swfuH.getStats().files_queued);
	 swfuH.addPostParam("maxResize", '120');

	 if(swfuH.getStats().files_queued >0)
	{
		//动态设定参数在此设定
		
		
    
 		swfuH.startUpload();
	}
	else
	{
		alert("请选择图片！");
	}
}



function startUploadFile()
{	
	if(swfu.getStats().files_queued >0)
	{
		//动态设定参数在此设定
		swfu.addPostParam("maxWidth", document.getElementById('maxWidth').value);
		swfu.addPostParam("maxHeight", document.getElementById('maxHeight').value);
		swfu.addPostParam("disposeMode", document.getElementById('disposeMode').value);
		swfu.addPostParam("titleName", encodeURI(document.getElementById('titleName').value));
		
        swfu.addPostParam("mark", getRadioCheckedValue('needMark'));
        
		document.getElementById("divProcessing").style.display='';
 		swfu.startUpload();
	}
	else
	{
		var api = frameElement.api, W = api.opener; 
		
		if(imageOrder != -1)
		{
			//图集独立编辑模式，可以只改动名称
			 W.document.getElementById('photoName-'+imageOrder).value = document.getElementById('titleName').value;
		
			 W.document.getElementById('resizeUrl-'+imageOrder).title = document.getElementById('titleName').value;
			
			 api.close();
		}
		else
		{
			W.$.dialog
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

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	
	//alert('hjhkhkj:'+numFilesQueued +' : '+numFilesSelected);
	try {
		if (numFilesQueued > 0) 
		{
			
		}
	} catch (ex) {
		alert(ex);
	}
}

function uploadProgressP(file, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / file.size) * 100);
		
		$('#uploadPercentP').html('正在处理... '+percent+'%');
		//document.getElementById("uploadPercent")
		//alert(file.name+" -: "+percent+"%");

		var progress = new FileProgress(file,  this.customSettings.upload_target);
		progress.setProgress(percent);
		if (percent === 100) {
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

function uploadProgressR(file, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / file.size) * 100);
		
		$('#uploadPercentR').html('正在处理... '+percent+'%');
		//document.getElementById("uploadPercent")
		//alert(file.name+" -: "+percent+"%");

		var progress = new FileProgress(file,  this.customSettings.upload_target);
		progress.setProgress(percent);
		if (percent === 100) {
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



function uploadProgress(file, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / file.size) * 100);
		
		$('#uploadPercent').html('正在处理... '+percent+'%');
		//document.getElementById("uploadPercent")
		//alert(file.name+" -: "+percent+"%");

		var progress = new FileProgress(file,  this.customSettings.upload_target);
		progress.setProgress(percent);
		if (percent === 100) {
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


function uploadSuccess(file, serverData) 
{
		serverDataArray.push(serverData);
		

}




//为上传图片独立模块所用
function uploadCompleteModuleP(file)
{
   
	for(var i = 0 ; i < serverDataArray.length; i++)
	{				
		var jsonObj = eval("("+serverDataArray[i]+")");
		
		 var height = jsonObj.obj_0.height;
         var width = jsonObj.obj_0.width;
         
        // var newWH = checkSize(width, height, 180, 160 );
 
		 var name = jsonObj.obj_0.imageName.substring(0,jsonObj.obj_0.imageName.indexOf('.'));
		 
		 //alert(name+":"+jsonObj.obj_0.imageUrl);

		 document.getElementById('certPhotoPCmsSysImgShow').src = jsonObj.obj_0.resizeImageUrl;
		 
		 document.getElementById('certPhotoPCmsSysShowSingleImage').href = jsonObj.obj_0.imageUrl;

		  document.getElementById('certPhotoP').value = jsonObj.obj_0.resId;
		  

		 
		//W.document.getElementById(imageSrcId).width=newWH[0];
		// W.document.getElementById(imageSrcId).height=newWH[1];
		
		 
	
		
	}

//为同一页面下一次上传做准备
serverDataArray = new Array();

$('#uploadPercentP').html('');
}





function uploadCompleteModuleR(file)
{
   
	for(var i = 0 ; i < serverDataArray.length; i++)
	{				
		var jsonObj = eval("("+serverDataArray[i]+")");
		
		 var height = jsonObj.obj_0.height;
         var width = jsonObj.obj_0.width;
         
        // var newWH = checkSize(width, height, 180, 160 );
 
		 var name = jsonObj.obj_0.imageName.substring(0,jsonObj.obj_0.imageName.indexOf('.'));
		 
		// alert(name+":"+jsonObj.obj_0.imageUrl);

		 document.getElementById('certPhotoRCmsSysImgShow').src = jsonObj.obj_0.imageUrl;
		 
		  document.getElementById('certPhotoRCmsSysShowSingleImage').href = jsonObj.obj_0.imageUrl;

		  document.getElementById('certPhotoR').value = jsonObj.obj_0.resId;
		//W.document.getElementById(imageSrcId).width=newWH[0];
		// W.document.getElementById(imageSrcId).height=newWH[1];
		
		 
	
		
	}

//为同一页面下一次上传做准备
serverDataArray = new Array();
$('#uploadPercentR').html('');

}





function uploadCompleteModuleH(file)
{
   
	for(var i = 0 ; i < serverDataArray.length; i++)
	{				
		var jsonObj = eval("("+serverDataArray[i]+")");
		
		 var height = jsonObj.obj_0.height;
         var width = jsonObj.obj_0.width;
         
        // var newWH = checkSize(width, height, 180, 160 );
 
		 var name = jsonObj.obj_0.imageName.substring(0,jsonObj.obj_0.imageName.indexOf('.'));
		 
		// alert(name+":"+jsonObj.obj_0.imageUrl);

		 document.getElementById('headPhotoCmsSysImgShow').src = jsonObj.obj_0.imageUrl;
		 
		 
		  document.getElementById('headPhoto').value = jsonObj.obj_0.resId;
		//W.document.getElementById(imageSrcId).width=newWH[0];
		// W.document.getElementById(imageSrcId).height=newWH[1];
		
		 
	
		
	}

//为同一页面下一次上传做准备
serverDataArray = new Array();
$('#uploadPercent').html('');

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



function deletePhotoInfo(pos,relatePath)
{
	var dialog = $.dialog({ 
   					title :'提示',
    				width: '160px', 
    				height: '60px', 
                    lock: true, 
    				icon: '32X32/i.png', 
    				
                    content: '您确认删除此图片？',
                    
                    ok: function () { 
       
  	$('#uploadPhotoTr-'+pos).remove();
	mustDeleteImageInfoArray.push(relatePath);
	sortArray[pos] = null;
    }, 
    cancel: true 
                    
	
	});
	
	
	
}


function uploadError(file, errorCode, message) {
	var imageName =  "<font color='red'>文件上传出错!</font>";
	var progress;
	try {
		//alert(errorCode+" : "+message);
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






