//ҵ�����
function disposeTextPage()
{
 	FCKUndo.SaveUndoStep();
 
    window.parent.showTextPageDialog(FCK.Name);
  
	FCKUndo.Typing=true;
}
 
var FCKJTCmsTextPageCommand=function() 
{
	this.Name='JTopCmsTextPage';
};

FCKJTCmsTextPageCommand.prototype.Execute=function()
{
	disposeTextPage();
}

FCKJTCmsTextPageCommand.prototype.GetState=function()
{
	return FCK_TRISTATE_OFF;
} ;

// ע������
FCKCommands.RegisterCommand( 'JTopCmsTextPage',new FCKJTCmsTextPageCommand()) ;


//���幤���� 
 var JTCmsBar=new FCKToolbarButton('JTopCmsTextPage',FCKLang.JTopCmsTextPage ); 
 JTCmsBar.IconPath=FCKPlugins.Items['JTopCmsTextPage'].Path+'page_text.png'; 
 //ע�� 
 FCKToolbarItems.RegisterItem('JTopCmsTextPage',JTCmsBar); 
 
 

