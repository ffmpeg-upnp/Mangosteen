$(document).ready (function () {
	
$(document).on("click", ".Menu",	function(e) {
							var id = "id=" + this.id;
							var url = this.id + ".do";
							$('#filelist * > *').remove();
							$('#mediaTool').remove();
							$('[class=contextMenu]').remove();
							if (this.id == "FileExplorer") {
								// �� �κп��� root ���� �����͸� ���Ȼ� ������ �־� ���̳�..
								// �׸��� ���� ������ �ε��(�߰輭������ ��û �Ҷ� ���̵� �´� ������ �ε�)...
								// �� ���̵� ������ ���ѿ� ���� ������ ���� ���� �޾ƿͼ� fileTree �Ű������� �Ѱ��ֱ�... ���� ����
								$('#filelist > #explorerMenu').remove();
							        $("<div id=explorerMenu>" +
							        	"<div id='file-uploader-demo1'>" +		
										"<noscript>" +			
											"<p>Please enable JavaScript to use file uploader.</p>" +
											"<!-- or put a simple form for upload here -->" +
										"</noscript>" +         
									"</div>" +
								
									"<div class='qq-upload-extra-drop-area'>Drop files here too</div>" +
									
							    				"<input type='checkbox' name='selectAll' class='box_class' />Select All" +
							    				"<span class='btn_ico btn_new'>New Folder</span>" +
							    				"<span class='btn_ico btn_delete'>Delete</span>" +
							    				"<span class='btn_ico btn_copy'>Copy</span>" +
							    				"<span class='btn_ico btn_paste'>Paste</span>" +
							    				"</div>").insertBefore('#fileTree');
							    
							        $('body').append($("<ul id='myMenu' class='contextMenu'>"+
							        						"<li class='download disabled'><a href='#download'>DownLoad</a></li>" +
							        						"<li class='upload'><a href='#upload'>UpLoad</a></li>" +
							        						"<li class='newfolder separator'><a href='#newfolder'>NewFolder</a></li>" +
															"<li class='edit disabled'><a href='#edit'>Edit</a></li>" +
															"<li class='cut disabled'><a href='#cut'>Cut</a></li>" +
															"<li class='copy disabled'><a href='#copy'>Copy</a></li>" +
															"<li class='paste disabled'><a href='#paste'>Paste</a></li>" +
															"<li class='delete disabled'><a href='#delete'>Delete</a></li></ul>"));
							        
							    mangoAPI.createUploader();
							    mangoAPI.fileButtons.bindAddFolderBtn();
							    mangoAPI.fileButtons.bindCopyBtn();
							    mangoAPI.fileButtons.bindPasteBtn();
							    mangoAPI.fileButtons.bindDeleteBtn();

								$('#fileTree').fileTree({
									root : '/sdcard/',
									script : 'FileExplorer.do'
								}, function(file) {
									alert(file);
								});
							} else {
								var mediaType = this.id;
								//mangoAPI.contextMenuDisable($('#filelist')); // ���ؽ�Ʈ �޴� ����̵�
								$.ajax({
											type : 'POST',
											url : url,
											data : id,
											dataType : 'json',
											success : function(json) {
												//json �޼��� �߿� � id ������ ��ȯ �ް� �� id�� �±׿� 
												$('#filelist * > *').remove();
												$("#MediaThumbList").append("<ul style=list-style-type:'none'></ul>");
												$(json).each(function(key, val) {
																	$("#MediaThumbList ul").append(
																					$("<li class='thumb element'><div class='mediaType' id='"+val.type+"'><img class='perFolderThumb' id='"+val.folderPath+"' src='"+val.type+val.thumbPath+"' /><span>"
																							+ val.folderName
																							+ " ("
																							+ val.fileOfNum
																							+ ")</span></div></li>"));
																});
												// �� �̵�� Ÿ�Կ� ���� �޴� ���� �ٸ���..
												if(mediaType == 'image')
												{
													$('body').append($("<ul id='myMenu' class='contextMenu'>"+
															"<li class='edit'><a href='#edit'>Edit</a></li>" +
															"<li class='cut separator'><a href='#cut'>Cut</a></li>" +
															"<li class='copy'><a href='#copy'>Copy</a></li>" +
															"<li class='paste'><a href='#paste'>Paste</a></li>" +
															"<li class='delete'><a href='#delete'>Delete</a></li></ul>"));
												}
												else if(mediaType == 'video')
												{
													$('body').append($("<ul id='myMenu' class='contextMenu'>"+
															"<li class='edit'><a href='#edit'>Edit</a></li>" +
															"<li class='cut separator'><a href='#cut'>Cut</a></li>" +
															"<li class='copy'><a href='#copy'>Copy</a></li>" +
															"<li class='paste'><a href='#paste'>Paste</a></li>" +
															"<li class='delete'><a href='#delete'>Delete</a></li></ul>"));
												}
												else if(mediaType == 'audio')
												{
													$('body').append($("<ul id='myMenu' class='contextMenu'>"+
															"<li class='edit'><a href='#edit'>Edit</a></li>" +
															"<li class='cut separator'><a href='#cut'>Cut</a></li>" +
															"<li class='copy'><a href='#copy'>Copy</a></li>" +
															"<li class='paste'><a href='#paste'>Paste</a></li>" +
															"<li class='delete'><a href='#delete'>Delete</a></li></ul>"));
												}
												//mangoAPI.contextMenuBind('perFolderThumb');
												$('.thumb.element').on("click", function(e){
													var url = 'SelectFolderList.bo';
													var param = 'path='+$(this).find('.perFolderThumb').attr('id')+'&type='+$(this).find('.mediaType').attr('id');
													var path = $(this).find('.perFolderThumb').attr('id');
													sendAjax(url, param, path, mediaType);
												});
											}
										});
							}
						});

	function sendAjax(url, param, path, mediaType) // type�� �޴� ��ư �� image/video/audio �� ������ �ϳ�, Ÿ���� �޴� ������ Ÿ�� ���� ���ε� ���� �ϱ� ���ؼ�
	{
		$.ajax({
			type : 'POST',
			url : url,
			data : param,
			dataType : 'json',
			success : function(json) {
				//json �޼��� �߿� � id ������ ��ȯ �ް� �� id�� �±׿� 
				$('#filelist * > *').remove();
				$("<div id='mediaTool'>"+
					"<div id='file-uploader-demo1'>" +		
					"<noscript>" +			
					"<p>Please enable JavaScript to use file uploader.</p>" +
					"<!-- or put a simple form for upload here -->" +
					"</noscript>" +         
					"</div>" +

					"<div class='qq-upload-extra-drop-area'>Drop files here too</div>" +
						"<input type='checkbox' name='selectAll' class='box_class' />Select All" +
						"<button type='button' class='disabled' menu='Delete' title='Delete'><span class='icon_btn btn_delete'>Delete</span></button>"+
						"</div>").insertBefore('#MediaThumbList');
				
						mangoAPI.createUploader();
						mangoAPI.fileButtons.bindMediaDeleteBtn();
				$("#MediaThumbList").append("<ul style=list-style-type:'none'></ul>");	
				$(json).each(function(key, val) {
									$("#MediaThumbList ul").append($("<li class='thumb element' select='unselect'><div class='mediaType' folderPath='"+path+"'id='"+val.type+"'><img class='perMediaThumb' src='"+val.type+val.path+"' />" + 
										"<span>"+val.name+"</span></div></li>"));
								});
				//���ؽ�Ʈ �޴� ���ε�
				mangoAPI.contextMenuBind($('#filelist'));
				// �� �����ۿ� ���� �̺�Ʈ���
				mangoAPI.fileButtons.bindItemBtn(mediaType);
				mangoAPI.fileButtons.bindSelectAllBtn('#MediaThumbList LI');	
			}
		});
	}
}); 