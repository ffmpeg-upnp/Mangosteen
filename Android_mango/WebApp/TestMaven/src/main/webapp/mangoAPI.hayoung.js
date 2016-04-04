var req;
var fromUrl;
var toUrl;
var copySourceArray;
var cutSourceArray;
var selectItemNum = 0;
jQuery.extend(mangoAPI, {
	
	// ���� Ž������ ��ư �Լ� ����
	fileButtons : {

		//���� Ž������ ��ü ���� üũ�ڽ� üũ ���� ��
		bindSelectAllBtn : function(target) {
			$("[name=selectAll]").bind('click', function(event) {
				// name�� check_all �� üũ�ڽ��� checked �� �Ǿ� �ִٸ�
				if ($("[name=selectAll]").is(":checked")) {
					// class�� box_class �� üũ�ڽ��� �Ӽ� checked�� checked�̴�
					$(target).attr("select", "selected");
					$(target).css('background-color','yellow'); //���� ����
				} else {// �׷��� ������
					// class�� box_class�� üũ�ڽ��� �Ӽ� checked �� "" �����̴�
					$(target).attr("select", "unselect");
					$(target).css('background-color',''); // �⺻ ����
				}
			});
		},

		// �� �������� ���� üũ�ڽ� üũ ���� ��
		bindItemBtn : function(mediaType) {
			// ������ ���� Ŭ�� ���� �� �̺�Ʈ
			$('.thumb.element').on("dblclick", function(e){
				// �̵�� Ÿ�Կ� ���� �ٸ� ����
				var mediaPath = $(this).find('img').attr('src').substring(5, $(this).find('img').attr('src').length);	
				switch(mediaType)
				{
				case 'image':
					var msg = '<img src="oriImage'+mediaPath+'"></img>';
					$.smartPop.open({ background: "red", width: 500, height: 500, html: msg });
					break;
				case 'video':
					var msg = '<video src="oriVideo'+mediaPath+'" loop="true" autoplay="true"></video>';
					$.smartPop.open({ background: "red", width: 500, height: 500, html: msg });
					break;
				case 'audio':
					var msg = '';
					break;
				}
			});
			
			// ������ Ŭ������ �� �̺�Ʈ
			$('.thumb.element').on("click", function(e){
					if($(this).attr('select') == 'unselect') // ���þȵ�����
					{
						$(this).attr('select','selected'); // ����
						$(this).css('background-color','yellow'); //���� ����
						selectItemNum++;
					}
					else
					{
						$(this).attr('select','unselect'); //���� ������
						$(this).css('background-color',''); // �⺻ ����
						selectItemNum--;
					}
				});
			
		},
		
		bindFileExplorerItem : function() {
			
		},

		unBindItemBtn : function() {
			$('.thumb.element').off("click");
		},
		
		// ���� Ž������ ���� �߰� ��ư�� ������ ��
		bindAddFolderBtn : function() {
			$('span.btn_new').bind('click', function(event) {

				var folderName = prompt('�������� �Է��ϼ���');
				
				var relativePath = $('#MainFileView ul').attr('path').substring(7, $('#MainFileView ul').attr('path').length);
				//var createUrl = '/Mangosteen/webdav'+;
				var createUrl = 'webdav'+relativePath;
				createUrl += folderName;
				alert(createUrl);

				jQuery.Dav(createUrl).createFolder({
					complete : function(dat, stat) {
						//;;;console.log('#createFolder');
						callbackFn(returnValue);
					},
					async : false,
					success : function(dat, stat) {
						alert('dat' + dat);
						/*if (onCheckRcvLoginRequired(dat)) {
						 onRcvError();
						 return;
						 }*/
						returnValue = 1;
					},
					error : function(dat, stat) {
						alert('error');
						/*if (onCheckRcvLoginRequired(dat.responseText)) {
						 onRcvError();
						 return;
						 }*/
						returnValue = returnHttpErrorValue(dat.responseText);
					}
				});
			});
		},

		// ���� Ž������ ���� ��ư�� ������ ��
		bindDeleteBtn : function() {
			$('span.btn_delete').bind('click', function(event) {

				$('input.item_box').each(function() {
					// this(���缱�õ� input����) üũ�ڽ��� checked �Ǿ� �ִٸ�
					if ($(this).is(":checked")) {
						
						var relativePath =  $(this).parent().find('a').attr('rel').substring(7, $(this).parent().find('a').attr('rel').length);
						var deleteUrl = 'webdav'+relativePath;
						alert(deleteUrl);

						jQuery.Dav(deleteUrl).remove({
							complete : function(dat, stat) {
								//;;;console.log('delete file');
								callbackFn(returnValue);
							},
							async : true, //p10789
							success : function(dat, stat) {
								alert('dat' + dat);

								//if(onCheckRcvLoginRequired(dat)) {
								//	onRcvError();
								//	return;
								//}
								returnValue = 1;
							},
							error : function(dat, stat) {
								//if(onCheckRcvLoginRequired(dat.responseText)) {
								//	onRcvError();
								//	return;
								//}
								if (dat.status == 204) {// for IE
									returnValue = 1;
								} else {
									returnValue = returnHttpErrorValue(dat.responseText);
								}
							}
						});
					}
				});
			});
		},

		// �� �̵���� ���� ��ư�� ������ ��
		bindMediaDeleteBtn : function() {
			$('span.btn_delete').bind('click', function(event) {

				$('input.item_box').each(function() {
					// this(���缱�õ� input����) üũ�ڽ��� checked �Ǿ� �ִٸ�
					if ($(this).is(":checked")) {
						var relativePath =  $(this).parent().find('img').attr('src').substring(16, $(this).parent().find('img').attr('src').length);
						var removeTag = $(this).parent().parent();
						
						var deleteUrl = 'webdav'+relativePath;
						
						alert(deleteUrl);
						
						jQuery.Dav(deleteUrl).remove({
							complete : function(dat, stat) {
								//;;;console.log('delete file');
								//callbackFn(returnValue);
								removeTag.remove();
							},
							async : true, //p10789
							success : function(dat, stat) {
								returnValue = 1;
							},
							error : function(dat, stat) {
								//if(onCheckRcvLoginRequired(dat.responseText)) {
								//	onRcvError();
								//	return;
								//}
								if (dat.status == 204) {// for IE
									returnValue = 1;
								} else {
									returnValue = returnHttpErrorValue(dat.responseText);
								}
							}
						});
					}
				});
			});
		},

		//���� Ž������ ���� ��ư�� ������ ��
		bindCopyBtn : function() {
			$('span.btn_copy').bind('click', function(event) {
				 
				$('input.item_box').each(function() {
					// this(���缱�õ� input����) üũ�ڽ��� checked �Ǿ� �ִٸ�
					if ($(this).is(":checked")) {
						
						var relativePath =  $(this).parent().find('a').attr('rel').substring(7, $(this).parent().find('a').attr('rel').length);
						//var removeTag = $(this).parent().parent();
						fromUrl = 'webdav'+relativePath;
						
						alert(fromUrl);
					}
				});
			});
		},
		
		bindCutBtn : function() {
			$('span.btn_cut').bind('click', function(event) {
				
			});
		},
		
		//���� Ž������ �ٿ��ֱ� ��ư ������ ��
		bindPasteBtn : function(){
			$('span.btn_paste').bind('click', function(event) {
				var name = fromUrl.split("/");
			    alert(name[0]);
				toUrl = $('#MainFileView ul').attr('path').substring(7, $('#MainFileView ul').attr('path').length)+name[name.length -1];

				var fwrite;
				jQuery.Dav(fromUrl).copy({
					complete : function(dat, stat) {
						//;;;console.log('#copy');
						//callbackFn(returnValue);
					},
					Destination_url : toUrl,
					Overwrite : fwrite,
					async : true,
					success : function(dat, stat) {
						//;;;console.log('#success');
						//if (onCheckRcvLoginRequired(dat)) {
						//	onRcvError();
						//	return;
						//}
						alert('copy success');
						returnValue = 1;
					},
					error : function(dat, stat) {
						alert('copy fail');
						if (onCheckRcvLoginRequired(dat.responseText)) {
							onRcvError();
							return;
						}
						//;;;console.log('#error');
						returnValue = returnHttpErrorValue(dat.responseText);
					}
				});
			});
		},
		
		//���� Ž������ ���̸� ��ư�� ������ ��
		bindRenameBtn : function() {
			$('span.btn_rename').bind('click', function(event) {

				$('input.item_box').each(function() {
					// this(���缱�õ� input����) üũ�ڽ��� checked �Ǿ� �ִٸ�
					if ($(this).is(":checked")) {

						$(this).parent().find()
					}
				});

				jQuery.Dav(sourceUrl).rename({
					complete : function(dat, stat) {
						//;;;console.log('#rename');
						callbackFn(returnValue);
					},
					Destination_url : renameUrl,
					cache : false,
					async : true,
					success : function(dat, stat) {
						if (onCheckRcvLoginRequired(dat)) {
							onRcvError();
							return;
						}
						returnValue = 1;
					},
					error : function(dat, stat) {
						if (onCheckRcvLoginRequired(dat.responseText)) {
							onRcvError();
							return;
						}
						returnValue = returnHttpErrorValue(dat.responseText);
					}
				});
			});
		},
	},

	fileUpload : {
		ajaxFunction : function() {

			var url = "FileUploadServlet";
			var path = "path=" + $('#MainFileView ul').attr('path');
			alert(path);
			if (window.XMLHttpRequest)// Non-IE browsers
			{

				req = new XMLHttpRequest();
				req.onreadystatechange = mangoAPI.fileUpload.processStateChange;

				try {
					req.open("POST", url, true);
					req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					req.setRequestHeader("Content-length", path.length);
					req.setRequestHeader("Connection", "close");
				} catch (e) {
					alert(e);
				}
				//post�� ��� �Ķ���͸� �ִ´�.
				req.send(path);
			} else if (window.ActiveXObject)// IE Browsers
			{
				req = new ActiveXObject("Microsoft.XMLHTTP");
				if (req) {
					req.onreadystatechange = mangoAPI.fileUpload.processStateChange;
					req.open("POST", url, true);
					req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					req.setRequestHeader("Content-length", path.length);
					req.setRequestHeader("Connection", "close");
					req.send(path);
				}
			}
		},

		processStateChange : function() {
			/**
			 *	State	Description
			 *	0		The request is not initialized
			 *	1		The request has been set up
			 *	2		The request has been sent
			 *	3		The request is in process
			 *	4		The request is complete
			 */
			if (req.readyState == 4) {
				if (req.status == 200)// OK response
				{
					var xml = req.responseXML;

					// No need to iterate since there will only be one set of lines
					var isNotFinished = xml.getElementsByTagName("finished")[0];
					var myBytesRead = xml.getElementsByTagName("bytes_read")[0];
					var myContentLength = xml.getElementsByTagName("content_length")[0];
					var myPercent = xml.getElementsByTagName("percent_complete")[0];

					// Check to see if it's even started yet
					if ((isNotFinished == null) && (myPercent == null)) {
						document.getElementById("initializing").style.visibility = "visible";

						// Sleep then call the function again
						window.setTimeout("ajaxFunction();", 100);
					} else {
						document.getElementById("initializing").style.visibility = "hidden";
						document.getElementById("progressBarTable").style.visibility = "visible";
						document.getElementById("percentCompleteTable").style.visibility = "visible";
						document.getElementById("bytesRead").style.visibility = "visible";

						myBytesRead = myBytesRead.firstChild.data;
						myContentLength = myContentLength.firstChild.data;

						if (myPercent != null)// It's started, get the status of the upload
						{
							myPercent = myPercent.firstChild.data;

							document.getElementById("progressBar").style.width = myPercent + "%";
							document.getElementById("bytesRead").innerHTML = myBytesRead + " of " + myContentLength + " bytes read";
							document.getElementById("percentComplete").innerHTML = myPercent + "%";

							// Sleep then call the function again
							window.setTimeout("ajaxFunction();", 100);
						} else {
							document.getElementById("bytesRead").style.visibility = "hidden";
							document.getElementById("progressBar").style.width = "100%";
							document.getElementById("percentComplete").innerHTML = "Done!";
						}
					}
				} else {
					alert(req.statusText);
				}
			}
		},
	},
	
	updateAddData: function(json){
	var val = eval("("+json+")");
	$("#MediaThumbList ul").append($("<li class='thumb element' select='unselect'><div class='mediaType' folderPath='"+val.path+"'id='"+val.type+"'><img class='perMediaThumb' src='"+val.type+val.path+val.name+"' />" + 
	"<span>"+val.name+"</span>" +						
		"</div></li>"));		
		// �̺κ� ����ȭ �ϱ�...  ���������۸��� ȣ���ؼ�.. ��ȿ��.. ������ ������ �ѷ����� �ѹ��� ȣ���ϰ� ������
		mangoAPI.fileButtons.unBindItemBtn();
		mangoAPI.fileButtons.bindItemBtn(val.type);
	},
	
	updateAddData2: function(evt, pasteFolderPath){
		var copySource = copySourceArray.pop();
		var rootTag;
		var parentPath;
		 if($(evt).attr('id') != 'MainFileView')
		 {
			 $("#MediaThumbList ul").append($("<li class='thumb element' select='unselect'><div class='mediaType' folderPath='"+copySource.folderpath+"'id='"+copySource.id+"'><img class='perMediaThumb' src='"+copySource.src+"' />" + 
						"<span>"+copySource.name+"</span>" +						
							"</div></li>"));
							if(copySource.length == 0)
							{
								mangoAPI.fileButtons.bindItemBtn(val.type);
							}
		 }
		 else
		 {
			 parentPath = copySource.folderpath;
			 rootTag = $('#fileTree a[rel = "'+ pasteFolderPath +'"]').parent();
			 console.log(rootTag);
			 $('#MainFileView ul').append("<li class='" +copySource.className  +"' select='unselect'><a href='javascript:;' rel='" +copySource.src+ "'>"+ copySource.name + "</a></li>");
				rootTag.find('ul').append("<li class='" +copySource.className  +"'><a href='javascript:;' rel='" + copySource.src + "'>"+ copySource.name + "</a></li>");
				if(parentPath == '/sdcard/') // /sdcard/ �ٷ� ���� ���ҽ��� ���� �ٿ��ֱ� �� ��� ���� �ѷ����°� ���� �ϱ� ���� ����ó��..
					parentPath = 'sdcard';
					
			    rootTag.fileTree({
					root : parentPath,
					script : 'FileExplorer.do'
				}, function(file) {
					alert(file);
				});
		 }
		},
	
	FileExplorerUpdateAddData:function(json){
		var val = eval("("+json+")");
		var ext =val.name.split('.');
		var rootTag = $('#fileTree a[rel = "'+ val.path +'"]').parent();
		var parentPath = val.path;
		$('#MainFileView ul').append("<li class='file ext_" + ext[1] +"' select='unselect'><a href='javascript:;' rel='" + val.path +val.name+ "'>"+ val.name + "</a></li>");
		rootTag.find('ul').append("<li class='file ext_" + ext[1] +"'><a href='javascript:;' rel='" + val.path+val.name + "'>"+ val.name + "</a></li>");
		
		//console.log(rootTag);
		//console.log('parentPath =' + parentPath);
		rootTag.fileTree({
			root : parentPath,
			script : 'FileExplorer.do'
		}, function(file) {
			alert(file);
		});
	},
	
	FileExplorerDeleteData:function(){
		
	},
	
	FileExplorerAddDataBind:function(t, parentPath){},

	updateDelData:function(){
	
	},

	createUploader : function() {
		var uploader = new qq.FileUploader({
			element : document.getElementById('file-uploader-demo1'),
			action : 'FileUploadServlet2',
			debug : true,
			extraDropzones : [qq.getByClass(document, 'qq-upload-extra-drop-area')[0]]
		});
	},

	createDownloader : function() {

	},
	
	contextMenuBind : function(target){
		var menuName = $('[class="contextMenu"]').attr('id');
		/*
		var target = $('.'+tag).parent().parent();
		if(tag == 'perFolderThumb')
			menuName = $('[class=contextMenu]').attr('id');
		else if(tag == 'perMediaThumb')
			menuName = $('[class=contextMenu]').attr('id');
		*/
		
		//target.find('li').contextMenu({
		target.contextMenu({
				menu: menuName
		},
			function(action, el, pos) {
			switch(action){
				case 'upload':
					$('input[name=file]').click();
					break;
				case 'download':
					break;
				case 'paste':
					mangoAPI.contextMenuPaste(el);
					break;
				case 'copy':
					mangoAPI.contextMenuCopy(el);
					break;
				case 'cut':
					mangoAPI.contextMenuCut(el);
					break;
				case 'edit':
					mangoAPI.contextMenuEdit(el);
					break;
				case 'delete':
					mangoAPI.contextMenuDelete(el);
					break;
			}
			
			/*
			alert(
				'Action: ' + action + '\n\n' +
				'Element ID: ' + $(el).attr('id') + '\n\n' + 
				'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' + 
				'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
				);*/
		});		
	},
	
	contextMenuDisable : function(target){
		target.disableContextMenu();
	},
	contextMenuEnable : function(target){
		target.enableContextMenu();
	},
	
	contextMenuCopy:function(evt){
		fromUrl = new Array();
		var relativePath;
		copySourceArray = new Array();
		$('#filelist [select]').each(function() {
			if($(this).attr('select') == 'selected'){
				var copySource = new Object();
				
				if($(evt).attr('id') != 'MainFileView')
				{ 
					relativePath =  $(this).find('img').attr('src').substring(16, $(this).find('img').attr('src').length);
					copySource.src = $(this).find('img').attr('src');
					copySource.folderpath = $(this).find('.mediaType').attr('folderpath');
					copySource.id = $(this).find('.mediaType').attr('id');
					copySource.name = $(this).find('span').html();
				}
				else
				{
					relativePath = $(this).find('a').attr('rel').substring(7, $(this).find('a').attr('rel').length);
					copySource.className = $(this).attr('class'); //Ŭ������ ����
					copySource.src = $(this).find('a').attr('rel');
					copySource.name = $(this).find('a').html();
					copySource.folderpath = $(this).parent().attr('path');
				}
				fromUrl.push('webdav'+relativePath);
				copySourceArray.push(copySource);
			}
		});
	},
	
	contextMenuCut:function(evt){
		fromUrl = new Array();
		$('.thumb.element').each(function() {
			if($(this).attr('select') == 'selected'){
				var relativePath =  $(this).find('img').attr('src').substring(16, $(this).find('img').attr('src').length);
				fromUrl.push('webdav'+relativePath);
			}
		});
	},

	contextMenuPaste:function(element){
		$(fromUrl).each(function(){
			var name = this.split("/");
			var pasteFolderPath;
		    alert(name[0]);
		    
		    if($(element).attr('id') != 'MainFileView')
			{ 
		    	toUrl = $(element).find('.mediaType').attr('folderpath').substring(12, $(element).find('.mediaType').attr('folderpath').length)+name[name.length -1];
			}
		    else
		    {
		    	pasteFolderPath = $('#MainFileView ul').attr('path');
		    	if(name[name.length-1] == "")
		    		toUrl = $('#MainFileView ul').attr('path').substring(7, $('#MainFileView ul').attr('path').length)+name[name.length -2];
		    	else
		    		toUrl = $('#MainFileView ul').attr('path').substring(7, $('#MainFileView ul').attr('path').length)+name[name.length -1];
		    }
		    console.log(toUrl);
		    
			//toUrl = $('#MainFileView ul').attr('path').substring(7, $('#MainFileView ul').attr('path').length)+name[name.length -1];
			var fwrite;
			jQuery.Dav(this).copy({
				complete : function(dat, stat) {
					//;;;console.log('#copy');
					//callbackFn(returnValue);
				},
				Destination_url : toUrl,
				Overwrite : fwrite,
				async : true,
				success : function(dat, stat) {
					//;;;console.log('#success');
					//if (onCheckRcvLoginRequired(dat)) {
					//	onRcvError();
					//	return;
					//}
					alert('copy success');
					mangoAPI.updateAddData2(element, pasteFolderPath);
					returnValue = 1;
				},
				error : function(dat, stat) {
					alert('copy fail');
					if (onCheckRcvLoginRequired(dat.responseText)) {
						onRcvError();
						return;
					}
					//;;;console.log('#error');
					returnValue = returnHttpErrorValue(dat.responseText);
				}
			});
		});
	},
	
	contextMenuEdit:function(evt){
		$('#MainFileView li').each(function() {
			if($(this).attr('select') == 'selected'){
				var sourceName = $(this).find('a').html(); // ���� �̸� ����
				var reName; // �� �̸�
				var sourceUrl; // ���� �ҽ� �ּ�
				var renameUrl; // ���̸����� ������ �ҽ� �ּ�
				var selectItem = $(this);
				$(this).find('a').hide(); // a�±� ����..
				$(this).append("<input type='text' name='form1' value='"+sourceName+"'>"); // input �±� ����
				$('input').on('keydown', function(e){
					 var key = e.which;
					  if(key == 13){ // ����Ű ġ��..
						  var inputTag = $(this);
						  reName = $(this).val();
						  if($(evt).attr('id') != 'MainFileView')
						  { 
							 sourceUrl =  'webdav'+selectItem.find('img').attr('src').substring(16, selectItem.find('img').attr('src').length);
							 //renameUrl =  'webdav'+
						  }
						  else
						  {
							  sourceUrl =  'webdav'+selectItem.find('a').attr('rel').substring(7, selectItem.find('a').attr('rel').length);
							  renameUrl =  'webdav'+selectItem.find('a').attr('rel').substring(7, selectItem.find('a').attr('rel').length - sourceName.length)+reName;
						  }
						  jQuery.Dav(sourceUrl).rename({
								complete:  function(dat, stat) {
										//;;;console.log('#rename');
										//callbackFn(returnValue);
									console.log('complete');
									inputTag.remove(); // input �±� ���ֱ�
									selectItem.find('a').html(reName); // a�±� ���� ����
									selectItem.find('a').show(); // a�±� ���̱�
									
									},
									Destination_url:renameUrl,
									cache: false,
									async: true,
									success:  function(dat, stat) {
//										if(onCheckRcvLoginRequired(dat)) {
//											onRcvError();
//											return;
//										}
										returnValue = 1;
									},
									error:  function(dat, stat) {
										console.log('error');
//										if(onCheckRcvLoginRequired(dat.responseText)) {
//											onRcvError();
//											return;
//										}
//										returnValue = returnHttpErrorValue(dat.responseText);     
									}
								}); 
					  }
					  else if(key == 27)
					 {
						$(this).remove(); // input �±� ���ֱ�
						selectItem.find('a').show(); // a�±� ���̱�
					 }
				});
			}
		});
	},
	
	contextMenuDelete:function(evt){
		var removeTagArray = new Array();
		var relativePath;;
		var rootTag = new Array();
		$('#filelist [select]').each(function() {
			if($(this).attr('select') == 'selected'){
				rootTag.push($('#fileTree a[rel = "'+ $(this).find('a').attr('rel') +'"]').parent());
				if($(evt).attr('id') != 'MainFileView')
				  { 
					relativePath =  $(this).find('img').attr('src').substring(16, $(this).find('img').attr('src').length);
				  }
				else
				{
					relativePath = $(this).find('a').attr('rel').substring(7, $(this).find('a').attr('rel').length); 
				}
				var removeTag = $(this);
				
				var deleteUrl = 'webdav'+relativePath;
				alert(deleteUrl);
				
				jQuery.Dav(deleteUrl).remove({
					complete : function(dat, stat) {
						//;;;console.log('delete file');
						//callbackFn(returnValue);
						//removeTagArray.push(removeTag);
						removeTag.remove();
						rootTag.pop().remove();
						selectItemNum = 0;
					},
					async : true, //p10789
					success : function(dat, stat) {
						returnValue = 1;
					},
					error : function(dat, stat) {
						//if(onCheckRcvLoginRequired(dat.responseText)) {
						//	onRcvError();
						//	return;
						//}
						if (dat.status == 204) {// for IE
							returnValue = 1;
						} else {
							returnValue = returnHttpErrorValue(dat.responseText);
						}
					}
				});
			}
		});
	}
});
