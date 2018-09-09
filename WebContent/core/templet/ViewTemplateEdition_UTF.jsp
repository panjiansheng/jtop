<%@ page contentType="text/html; charset=UTF-8" session="false"%>
<%@ taglib uri="/cmsTag" prefix="cms"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />	
		<cms:QueryData service="cn.com.mjsoft.cms.templet.service.TempletService" method="getTemplateEditorTag" objName="TE" var=",${param.etId}">
		<title>版本号:${TE.editionId} ( <cms:FormatDate date="${TE.editDT}" /> ) - ${TE.templateName}</title>
			
			<link href="../style/blue/css/main.css" type="text/css" rel="stylesheet" />
			<link href="../style/blue/css/reset-min.css" rel="stylesheet" type="text/css" />
			<link rel="stylesheet" href="../javascript/highlight/codemirror-2.11/lib/codemirror.css"/>
			<link rel="stylesheet" href="../javascript/highlight/codemirror-2.11/theme/default.css"/>
		
			<script type="text/javascript" src="../javascript/highlight/codemirror-2.11/lib/codemirror.js"></script>
			<script src="../javascript/highlight/codemirror-2.11/mode/javascript/javascript.js"></script>
			<script src="../javascript/highlight/codemirror-2.11/mode/css/css.js"></script>
			<script type="text/javascript" src="../javascript/highlight/codemirror-2.11/mode/xml/xml.js"></script>
			<script type="text/javascript" src="../javascript/highlight/codemirror-2.11/mode/htmlmixed/htmlmixed.js"></script>

			<script type="text/javascript" src="../common/js/jquery-1.7.gzjs"></script>
			<script type="text/javascript" src="../javascript/commonUtil_src.js"></script>
			
			<script type="text/javascript" src="../javascript/dialog/lhgdialog.min.js?skin=iblue"></script>
			

			<script>  
		
      
        
      </script>
	</head>
	<body>


		<form id="editTextForm" name="editTextForm" method="post">

			<cms:SystemSingleTextFile entry="${param.entry}">
			<textarea readonly id="code" style="line-height:normal;">${Text.content}</textarea>
			<input type="hidden" id="content" name="content"/> 
			<input type="hidden" id="entry" name="entry" value="${param.entry}"/> 
			</cms:SystemSingleTextFile>
			<div class="breadnavTab"  >
			<table width="100%" border="0" cellspacing="0" cellpadding="0" >
				<tr class="btnbg100">
					<div style="float:right">
						<a href="javascript:submitEditText();"  class="btnwithico"><img src="../style/icons/tick.png" width="16" height="16" /><b>还原到此版本&nbsp;</b> </a>
						<a href="javascript:close();"  class="btnwithico" onclick=""><img src="../style/icon/close.png" width="16" height="16"/><b>取消&nbsp;</b> </a>
					</div>
					 
				</tr>
			</table>
			</div>
			<!-- hidden -->
			<input type="hidden" id="type" name="type" value="${param.type}"/>
			
			<input type="hidden" id="fileEntry" name="fileEntry" value="${param.fileEntry}"/>
			
			<input type="hidden" id="editDesc" name="editDesc" />
			
			<cms:Token mode="html"/>
		</form>

		

		<!--[if lt IE 7]>
        <script type="text/javascript" src="js/unitpngfix.js"></script>
<![endif]-->
	</body>
</html>
<script>

if("true"==="${param.fromFlow}")
{         
	$.dialog.tips('还原到当前版本成功...',1);  		          
} 
 
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "${param.type}", 
  lineNumbers: true,
  readOnly: true,
  onChange: function () {
	   
}
  
});

function submitEditText()
{
	document.getElementById('content').value = encodeData(editor.getValue());
    
  
    document.getElementById('code').value = '';

	var form = document.getElementById('editTextForm');
	
	form.action = '<cms:BasePath/>resources/writeUTF8TextFile.do?etId=${TE.editionId}';
	
	form.submit();

}
      

</script>
</cms:QueryData>
