///////////////////ajax ////////
var targetModelId = '-1';

var targetJSONsrc = '../../../channel/listContentClassInfoTree.do?parent=-9999&layer=2';
//var targetListContentSrc =item.targetListPage+'?classId=';

var parentId = -9999;//暂时没有分站，永远为总站-9999
var tree = new WebFXTree('总站');

tree.boxNeed = false;
tree.icon = basepath+"/core/javascript/tree/xtree2b/images/monitor.png";

tree.openIcon=basepath+"/core/javascript/tree/xtree2b/images/monitor.png";

tree.setId(-9999);
tree.target= 'nestContentFrame';
//tree.setAction("");
tree.thisNodeLoadComplete=true;

var current = tree;
var rootClassNode = null;

var currentRefClassIdStr = null;

var commend = new WebFXTreeItem('');

commend.icon = "images/monitor.png";
commend.openIcon="images/monitor.png";
commend.setId(-999);
commend.target= 'nestContentFrame';
//commend.setAction("javascript:window.location.href='"+basepath+"core/content/ManageCommendContent.jsp");


//current.add(commend );

function initRootTree()
{
		 $.ajax({
		  		type: "POST",
		   		 url: targetJSONsrc,
		   		data: 'parentClassId='+parentId,
		
		       	success: function(msg)
		        {     
		       				var jsonObj = eval("("+msg+")");
		           			var x;
			      			var xl2;
			      			
			      			$.each
			      			(
			      				jsonObj,
			      				function(i,item)
			      				{
			      				 
			      					if(item.layer == 1)//根栏目
			      					{
				      					x = new WebFXTreeItem(item.name);
				      					x.setId(item.classId);
				      					
				      					x.boxVal = item.name;
				      					
				      					//if(currentRefClassIdStr.indexOf(item.name+',') != -1)
				      					//{
				      						//x.boxCheck = true;						
				      					//}
				      					
				      					//相同模型栏目才可选择
				      					 
				      					if(item.modelId != targetModelId)
				      					{
				      						x.boxNotUse = true;
				      					}
				      					
				      					
				      					//如果不是叶子节点，需要为他创建一个loading节点
				      					
				      					
				      					if(item.isLeaf == 1)
				      					{
				      						x.openIcon="../../../core/style/icons/"+item.ico;
			      							x.icon="../../../core/style/icons/"+item.ico;
				      					}
				      					
				      					 	current.add(x);
				      					
				      					rootClassNode = x;
			      					}
			      					else if(item.layer == 2)//次级栏目
			      					{
			      						xl2 = new WebFXTreeItem(item.name);
				      					xl2.setId(item.classId);
				      					      					
				      					xl2.boxVal = item.name;
				      					
				      					//if(currentRefClassIdStr.indexOf(item.name+',') != -1)
				      					//{
				      						//xl2.boxCheck = true;						
				      					//}
				      				
				      					//相同模型栏目才可选择
				      					if(item.modelId != targetModelId)
				      					{
				      						xl2.boxNotUse = true;
				      					}
				      					
				      					
				      					//如果不是叶子节点，需要为他创建一个loading节点
				      				 
				      					if(item.isLeaf == 0)//有孩子的节点
				      					{
				      						var b = new WebFXTreeItem('Loading...');
											b.openIcon = b.icon = basepath+"/core/javascript/tree/xtree2b/images/loading.gif";   
											
											//x.openIcon="../../../style/icon/"+item.iconFile;
				      						//x.icon="../../../style/icon/"+item.iconFile;
											
											xl2.add(b);  
											//FF的bug，须调用方法收起树
											xl2.setExpanded();
											
																
				      					}
				      					else
				      					{
				      						xl2.openIcon="../../../core/style/icons/"+item.ico;
			      							xl2.icon="../../../core/style/icons/"+item.ico;
				      					}
				      					
				      					
			      						
			      						//设定root栏目为已经加载过
			      						rootClassNode.thisNodeLoadComplete =true;
			      						rootClassNode.add(xl2);
			      						rootClassNode.expand();
			      					}
			      		
			      				}	      			
			      			);
			      			
			      			     			
			      		 
		        }
		 	});	
	
	
 
	
	
tree.write();

tree.expandAll();

}

