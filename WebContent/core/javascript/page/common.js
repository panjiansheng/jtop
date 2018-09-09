
var page_num_param_name = "pageNum";

//���غ���
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}



//����Ԫ�ص���ʾ
function displayOrHide(displayElement, hideElement) {
	if (displayElement != "") {
		var displayObj = document.getElementById(displayElement);
		displayObj.style.display = "";//��ʾ
	}
	if (hideElement != "") {
		var hideObj = document.getElementById(hideElement);
		hideObj.style.display = "none";//����ʾ
	}
}



//��searchStrParam���н���������ָ������Ϊname��value
function getSearchValue(searchStrParam, name) {
	if (searchStrParam == "URL") {
		searchStr = this.location.search.substr(1);//��������������URL,���ȡURL��&����Ĳ�����  
	} else {//������ľ��ǲ�����
		searchStr = searchStrParam;
	}
	var searchArray = new Array();//����װ�������ַ���
	var returnStr = "";
	if (searchStr != "") {//����
		searchArray = searchStr.split("&");//�ָ�
		for (var i = 0; i < searchArray.length; i++) {//��������ָ��name��value
			if (searchArray[i] != "") {
				var paramArray = new Array();
				paramArray = searchArray[i].split("=");//һ�ε����Ĳ�����
				if (paramArray[0] == name) {//�������Ϊָ��name������value
					returnStr = paramArray[1];
					return returnStr;
				}
			}
		}
	}
	return "";
}



//����searchStr,�����operTypeָ���Ĳ������ͣ���name=value������ز���
function searchManage(searchStr, operType, name, value) {
	var searchArray = new Array();
	var returnStr = "";
	if (searchStr != "") {
		searchArray = searchStr.split("&");//�ָ����������
		for (var i = 0; i < searchArray.length; i++) {//������ǰ�����ԣ�ȥ����ǰ���ڵ�name=value��
			if (searchArray[i] != "") {
				var paramArray = new Array();
				paramArray = searchArray[i].split("=");
				if (paramArray[0] == name) {//����ҵ�ָ���������Ӳ�����������ȥ�������
					searchArray.splice(i, 1);
					i--;//�������쵱ǰλ��Ԫ��
				}
			}
		}
	}
	if (operType == "add") {//��add�ͼ����µĲ�����
		returnStr = name + "=" + value;
	}
	if (operType == "remove") {//remove�Ͳ��ӣ�ָ����������ɾ����
	}
	for (var j = 0; j < searchArray.length; j++) {//����ԭ�����еĲ�����
		if (searchArray[j] != "") {
			returnStr += "&" + searchArray[j];
		}
	}
	
	return returnStr;
}



//��ָ��searchStr�����һ��������
function addSearch(searchStr, name, value) {
	if (searchStr == "URL") {
		return searchManage(this.location.search.substr(1), "add", name, value);
	}
	return searchManage(searchStr, "add", name, value);
}

function addLast(searchStr, name, value) {
	if (searchStr == "URL") {
		return searchManage(this.location.search.substr(1), "add", name, value);
	}
	return searchManage(searchStr, "lastId", name, value);
}

//�滻��ǰURL��ָ��������
function addURLParam(paramName, paramValue) {
	var tmp = removeSearch("URL", paramName);//��ɾ��ԭ�ȵ�ֵ
	this.location.search = addSearch(tmp, paramName, paramValue);//�����µ�ֵ
}



//��ָ��searchStr��ɾ��һ��������
function removeSearch(searchStr, name) {
	if (searchStr == "URL") {
		return searchManage(this.location.search.substr(1), "remove", name, "");
	}
	return searchManage(searchStr, "remove", name, "");
}



//����ĳһҳ
function pageJump() {
	
	var selectV = document.getElementById("pageTagSelect");
	//var e = event.srcElement;//���û��ȡ�����¼��Ķ���

	this.location.search = addSearch("URL", page_num_param_name, selectV.value);//����href��?���ҳ������
}



//��һҳ
function firstPage() {
	this.location.search = addSearch("URL", page_num_param_name, 1);
}


//���һҳ
function lastPage(pageCount) {
	this.location.search = addSearch("URL", page_num_param_name, pageCount);
}

//��һҳ
//��һҳ
function nextPage(lastId,pageCount) {
	
	var pn = getSearchValue("URL", page_num_param_name);//�õ���ǰҳ
	if (pn == "" || pn == null) {//��һҳ��pn
		var nextPage = 2;
	} else {
		var nextPage = parseInt(pn) + 1;
	}
	if (nextPage > pageCount) {//���ΪpageCount
		nextPage = pageCount;
	}
	
	 addSearch("URL", page_num_param_name, nextPage);
	addSearch("URL", 'firstId', '-99999999');
	this.location.search =addSearch("URL", 'lastId', lastId);
	//alert(this.location);
}

//��һҳ
function prevPage(firstId) {
	var pn = getSearchValue("URL", page_num_param_name);//�õ���ǰҳ
	if (pn == "" || pn == null) {//�ǵ�һҳ��Ȼ�ص�һҳ
		first_page();
		return;
	}
	var nextPage = parseInt(pn) - 1;//��һҳ
	if (nextPage < 1) {//��СΪ��һҳ
		nextPage = 1;
	}
	addSearch("URL", page_num_param_name, nextPage);
	addSearch("URL", 'lastId', '-99999999');
	this.location.search =  addSearch("URL", 'firstId', firstId);
}

