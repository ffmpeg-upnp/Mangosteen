// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $('.fileTreeDemo').fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// TERMS OF USE
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
if(jQuery) (function($){
	
	$.extend($.fn, {
		fileTree: function(o, h) {
			// Defaults
			if( !o ) var o = {};
			if( o.root == undefined ) o.root = '/';
			if( o.script == undefined ) o.script = 'jqueryFileTree.php';
			if( o.folderEvent == undefined ) o.folderEvent = 'dblclick';
			if( o.expandSpeed == undefined ) o.expandSpeed= 500;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.multiFolder == undefined ) o.multiFolder = true;
			if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';
			var UpFolderFlag = false; // UpFolder �� ����Ŭ���ߴ��� ���� Ž���� ������ ����Ŭ���ߴ��� �������� ����
			
			$(this).each( function() { // this�� ����� �±�
				
				function showTree(c, t) {
					//c �� #fileTree, t�� ��Ʈ ���
					//ó���� �ε��� ���� wait Ŭ���� ����
					$(c).addClass('wait');
					
					// jqueryFileTree start ���� �±� ���� ����
					$(".jqueryFileTree.start").remove();
				     
					// Ajax Post�� url��, ��Ʈ ��� �Ű����� �ѱ��...  ��ü ������ ���Ͽ� ���� list �±� �޾ƿ�..
					$.post(o.script, { dir: t }, function(data) {
						
						// start �±��� ���� �����
						$(c).find('.start').html('');
						
						// wait Ŭ���� �����,   list �±� �� �ٿ� �ְ�
						$(c).removeClass('wait').append(data);
						// ���� �� �ʿ� �����ְ�
						$('#MainFileView *').remove();
						selectItemNum = 0;
						//MainFileView ���� �Ȱ��� ������ �ѷ��ְ�
						if(data =="") // ���� �ȿ� �ƹ��͵� ���ٸ�.. �⺻����  �����������°� �־��ֱ� ����
						{
							$('#MainFileView').append("<ul class='jqueryFileTree' style='display: none;'>");
						}
						else
						{
							$('#MainFileView').append(data);
						}
							
						//�������� �̵� �߰�
						$('#MainFileView ul').attr('path',t);
						$('#MainFileView ul').prepend("<li class='UpFolder'><a href='javascript:;' rel='"+escape($('#MainFileView ul').attr('path'))+"'>...</a></li>");
						// li�±� �ִ� ��� ��ŭ ���鼭 
						$('#MainFileView').find('li').each(function(){
							$(this).attr('select', 'unselect');
						});
						mangoAPI.fileButtons.bindSelectAllBtn('#MainFileView LI');
						// �� üũ�ڽ��� click�̺�Ʈ ���ε�
						mangoAPI.fileButtons.bindItemBtn();
						// ����Ž���⿡ ���ؽ�Ʈ �޴� ���
						mangoAPI.contextMenuBind($('#MainFileView'));
						//t�� ���� Ŭ���� ������ ���... ��θ� �Ӽ����� �߰����༭.. 
						
						
						if( o.root == t )
						{
							$(c).find('UL:hidden').show();
						}
						else
						{
							$(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						}
						//$(c).children('UL').clone().appendTo('#MainFileView');
						$('#MainFileView ul.jqueryFileTree').show();
						$('#MainFileView ul.jqueryFileTree').css('display','block');
						// �̺�Ʈ ���.  �Ű������δ� #fileTree
						//console.log($(c));
						//console.log(t);
						bindTree(c, t); // t = �θ��� �Ѱ��ֱ�						
						bindTree2();
					});
				}
				
				function bindTree(t, parentPath) {
					// ���⼭ t�� #fileTree
					//#fileTree Li a �±׿� �κ�Ʈ ���.. ����Ŭ���̺�Ʈ
					//console.log($(t));
					$(t).find('li a').bind(o.folderEvent+' click', function(e) {
						//console.log('call');
						if(e.type == 'dblclick'){
						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {
								
								//console.log(UpFolderFlag);
								if($(this).parent().children('ul').length >0 && UpFolderFlag == true)
								{
									$(this).parent().find('ul').remove(); // �̰Ŵ� ���� Ž���⿡�� �׳� click���� �� �׿��ִ� �ֵ� ����� ���ؼ�
									$('#MainFileView *').remove();
									selectItemNum = 0;
									$(this).parent().parent().clone().appendTo('#MainFileView');
									bindTree2();
								}
								else{										
										// Expand ��ġ��
										$(this).parent().find('ul').remove(); // �̰Ŵ� ���� Ž���⿡�� �׳� click���� �� �׿��ִ� �ֵ� ����� ���ؼ�
										$('#MainFileView *').remove();
										selectItemNum= 0;
										//console.log('remove');
										// �̰� �ٽ� �ݴ°� �ƴѰ�
										if( !o.multiFolder ) {
											//console.log('?');
											$(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
											$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
										}
										
										// �̰� �ڽ� ���� �� ���� �±� �� ����°ǵ�....
										$(this).parent().find('UL').remove(); // cleanup
										// ���????
										// �Ű������� li �±� �Ѱ��ְ�..., ���� ���õ� �±��� ��� �� �Ѱ��ְ�....
										showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )) );
										// ���� -> �������� ����
										$(this).parent().removeClass('collapsed').addClass('expanded');
										//console.log('open');
									}
									
									UpFolderFlag= false; // flag ����..
									
							} else { // �����ִٸ�?
									console.log("3");
									$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().removeClass('expanded').addClass('collapsed');
									$('#MainFileView *').remove();
									selectItemNum = 0;
									 //showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )) );
									//$(this).parent().parent().find('ul').remove();
									$(this).parent().parent().clone().appendTo('#MainFileView');
								$('#MainFileView ul').attr('path',parentPath);
								$('#MainFileView ul').prepend("<li class='UpFolder'><a href='javascript:;' rel='"+escape($('#MainFileView ul').attr('path')) +"'>...</a></li>");
								$('#MainFileView li').attr('select', 'unselect');
								$('#MainFileView ul').find('ul').remove();
								selectItemNum = 0;
								UpFolderFlag = false;
								bindTree2();
							}
						} else {
							h($(this).attr('rel'));
						}
						return false;
						}
						else if(e.type == 'click'){
							var clickTag = $(this);
							//Ŭ���� ���� Ž���Ⱑ �����̰� �����ְ� �ȿ� ul�±װ� ���ٸ� => �ƹ��͵� ���ٴ� ���̹Ƿ� ajax ��û
							if($(this).parent().hasClass('file'))
								return false;
							else if( $(this).parent().hasClass('directory') ) {
								if( $(this).parent().hasClass('collapsed') && $(this).parent().find('ul').length == 0 ) {
									
									// Ajax Post�� url��, ��Ʈ ��� �Ű����� �ѱ��...  ��ü ������ ���Ͽ� ���� list �±� �޾ƿ�..
									$.post(o.script, { dir: $(this).attr('rel') }, function(data) {
										// wait Ŭ���� �����,   list �±� �� �ٿ� �ְ�
										clickTag.parent().append(data);
										// ���� �� �ʿ� �����ְ�
										$('#MainFileView *').remove();
										selectItemNum = 0;
										//MainFileView ���� �Ȱ��� ������ �ѷ��ְ�
										if(data =="") // ���� �ȿ� �ƹ��͵� ���ٸ�.. �⺻����  �����������°� �־��ֱ� ����
										{
											$('#MainFileView').append("<ul class='jqueryFileTree' style='display: none;'>");
										}
										else
										{
											$('#MainFileView').append(data);
										}
											
										//�������� �̵� �߰�
										$('#MainFileView ul').attr('path',clickTag.attr('rel'));
										$('#MainFileView ul').prepend("<li class='UpFolder'><a href='javascript:;' rel='"+escape($('#MainFileView ul').attr('path'))+"'>...</a></li>");
										// li�±� �ִ� ��� ��ŭ ���鼭 
										$('#MainFileView').find('li').each(function(){
											$(this).attr('select', 'unselect');
										});
										mangoAPI.fileButtons.bindSelectAllBtn('#MainFileView LI');
										// �� üũ�ڽ��� click�̺�Ʈ ���ε�
										mangoAPI.fileButtons.bindItemBtn();
										// ����Ž���⿡ ���ؽ�Ʈ �޴� ���
										mangoAPI.contextMenuBind($('#MainFileView'));
										//t�� ���� Ŭ���� ������ ���... ��θ� �Ӽ����� �߰����༭.. 
										//$(c).children('UL').clone().appendTo('#MainFileView');
										$('#MainFileView ul.jqueryFileTree').show();
										$('#MainFileView ul.jqueryFileTree').css('display','block');
										// �̺�Ʈ ���.  �Ű������δ� #fileTree
										//console.log($(c));
										//console.log(t);
										bindTree(clickTag.parent(), clickTag.attr('rel')); // ù����, �θ��±�? �ι�° �θ��� �Ѱ��ֱ�						
										bindTree2();
									});
								}
							}
							
							$('#MainFileView *').remove();
							selectItemNum = 0;
							//MainFileView ���� �Ȱ��� ������ �ѷ��ְ�
							if($(this).parent().find('ul')=="undefined") // ���� �ȿ� �ƹ��͵� ���ٸ�.. �⺻����  �����������°� �־��ֱ� ����
							{
								$('#MainFileView').append("<ul class='jqueryFileTree' style='display: none;'>");
							}
							else
							{
								//$('#MainFileView').clone().($(this).parent().find('ul'));
								$(this).parent().children('ul').clone().appendTo('#MainFileView'); //�ϴ� ul�±� �� �����ؿ��� ����� ����
								$('#MainFileView ul').find('ul').remove();
							}
							
							//�������� �̵� �߰�
							$('#MainFileView ul').attr('path',$(this).attr('rel'));
							$('#MainFileView ul').prepend("<li class='UpFolder'><a href='javascript:;' rel='"+escape($('#MainFileView ul').attr('path'))+"'>...</a></li>");
							// li�±� �ִ� ��� ��ŭ ���鼭 
							$('#MainFileView').find('li').each(function(){
								$(this).attr('select', 'unselect');
							});
							mangoAPI.fileButtons.bindSelectAllBtn('#MainFileView LI');
							// �� üũ�ڽ��� click�̺�Ʈ ���ε�
							mangoAPI.fileButtons.bindItemBtn();
							// ����Ž���⿡ ���ؽ�Ʈ �޴� ���
							mangoAPI.contextMenuBind($('#MainFileView'));
							//t�� ���� Ŭ���� ������ ���... ��θ� �Ӽ����� �߰����༭..
							$('#MainFileView ul.jqueryFileTree').show();
							$('#MainFileView ul.jqueryFileTree').css('display','block');
							bindTree2();
						}
					});
					// Prevent A from triggering the # on non-click events
					if( o.folderEvent.toLowerCase != 'dblclick' ) $(t).find('LI A').bind('dblclick', function() { return false; });
				}
				
				function bindTree2() {
					// �� ������ ������ Ŭ���ߴٸ�
					selectItemnum = 0; // ���ε� �ҋ� ���õ� ���� �ʱ�ȭ
					$('#MainFileView').find('LI').off('click');
					$('#MainFileView').find('LI').bind('click', function() {
						if($(this).attr('select') == 'unselect') // ���þȵ�����
						{
							$(this).attr('select','selected'); // ����
							$(this).css({'background-color' : '#594381','border-radius': '10px'}); //���� ����
							selectItemNum++;
						}
						else
						{
							$(this).attr('select','unselect'); //���� ������
							$(this).css({'background-color' : '','border-radius': '10px'});
							selectItemNum--;
						}
						
						$('Button[menu]').addClass('disabled'); // �⺻ ��� ��Ȱ��ȭ(�����߰�, ��ü���� ����)
						if(selectItemNum ==0 && (copySourceArray != null || cutSourceArray != null))
						{
							$('Button[menu="Paste"]').removeClass('disabled');
						}
						else if(selectItemNum ==1 && (copySourceArray != null || cutSourceArray != null))
						{
							$('Button[menu="Paste"]').removeClass('disabled');
							$('Button[menu="Copy"]').removeClass('disabled');
							$('Button[menu="Cut"]').removeClass('disabled');
							$('Button[menu="Delete"]').removeClass('disabled');
							$('Button[menu="Download"]').removeClass('disabled');
							
							if($('.mediaType').attr('id') == "image") // mediaType�� ���� ����
								$('Button[menu="WallPaper"]').removeClass('disabled');
							else if($('.mediaType').attr('id') == "video")
								$('Button[menu="Play"]').removeClass('disabled');
							else if($('.mediaType').attr('id') == "audio")
							{
								$('Button[menu="Play"]').removeClass('disabled');
								$('Button[menu="Ringtone"]').removeClass('disabled');
							}	
						}
						else if(selectItemNum >=2 && (copySourceArray != null || cutSourceArray != null))
						{
							$('Button[menu="Paste"]').removeClass('disabled');
							$('Button[menu="Copy"]').removeClass('disabled');
							$('Button[menu="Cut"]').removeClass('disabled');
							$('Button[menu="Delete"]').removeClass('disabled');
							$('Button[menu="Download"]').removeClass('disabled');
						}
						else if(selectItemNum ==0) // ���õ� �������� ���� ��
						{
							$('Button #newFolderBtn').removeClass('disabled');
							$('Button[menu]').addClass('disabled');
						}
						else if(selectItemNum ==1) // ���õ� �������� �ϳ��� ��
						{
							$('#filelist [select]').each(function() {
								if($(this).attr('select') == 'selected' && ($(this).hasClass('directory') || $(this).hasClass('UpFolder')))
									$('Button[menu="OpenFolder"]').removeClass('disabled');	
							});
							
							$('Button[menu="Rename"]').removeClass('disabled');
							$('Button[menu="Copy"]').removeClass('disabled');
							$('Button[menu="Cut"]').removeClass('disabled');
							$('Button[menu="Delete"]').removeClass('disabled');
							$('Button[menu="Download"]').removeClass('disabled');
							
							if($('.mediaType').attr('id') == "image") // mediaType�� ���� ����
								$('Button[menu="WallPaper"]').removeClass('disabled');
							else if($('.mediaType').attr('id') == "video")
								$('Button[menu="Play"]').removeClass('disabled');
							else if($('.mediaType').attr('id') == "audio")
							{
								$('Button[menu="Play"]').removeClass('disabled');
								$('Button[menu="Ringtone"]').removeClass('disabled');
							}
						}
						else if(selectItemNum >= 2) // ���� �������� 2�� �̻��� ��
						{
							$('Button[menu="Copy"]').removeClass('disabled');
							$('Button[menu="Cut"]').removeClass('disabled');
							$('Button[menu="Delete"]').removeClass('disabled');
							$('Button[menu="Download"]').removeClass('disabled');
						}

					});
					$('#MainFileView').find('LI').bind(o.folderEvent, function() {
						UpFolderFlag = false;
						if($(this).hasClass('UpFolder'))
						{
							UpFolderFlag = true;
						}
						$('#fileTree a[rel = "'+ $(this).children('a').attr('rel') +'"]').dblclick();
					});
				}
				
				if(o.root == '/sdcard/')
				{
					// Loading message
					$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
					// Get the initial file list
					showTree( $(this), escape(o.root) );
				}
				else
				{				
					console.log("1");
					if(o.root =='sdcard')
						o.root = '/'+o.root+'/';
					$(this).find('li a').unbind("dblclick");
					bindTree(this, escape(o.root));
					bindTree2();
				}
			});
		}
	});
	
})(jQuery);