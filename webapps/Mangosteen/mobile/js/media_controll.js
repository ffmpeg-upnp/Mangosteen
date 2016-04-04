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
								$.ajax({
											type : 'POST',
											url : url,
											data : id,
											dataType : 'json',
											success : function(json) {
												//json �޼��� �߿� � id ������ ��ȯ �ް� �� id�� �±׿� 
												$('#filelist * > *').remove();
												$("#MediaThumbList").append("<div class='ui-grid-b'>"); // 3��� �׸��� �ְ�
												var count=0;
												var row;
												$(json).each(function(key, val) {
														count++; // ������ �ϳ��� count�� ����
														if(count%3 == 0)
															row = 'c';
														else if(count%3 == 1)
															row= 'a';
														else if(count%3 == 2)
															row = 'b';
																	$("#MediaThumbList .ui-grid-b").append(
																					$("<div class='ui-block-"+row+" thumb element'><div data-role='content' class='mediaType' id='"+val.type+"'><img class='perFolderThumb' id='"+val.folderPath+"' src='"+val.type+val.thumbPath+"' /><span>"
																							+ val.folderName
																							+ " ("
																							+ val.fileOfNum
																							+ ")</span></div></div>"));
																});
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
				$('#MediaThumbList').before("<div data-role='controlgroup'  data-type='horizontal'>" +
						"<a href='#' data-role='button'  data-theme='a' >ALL</a>" +
				"<a href='#' data-role='button'  data-theme='a' >up</a>" +
				"<a href='#' data-role='button'  data-theme='a' >down</a>" +
				"<a href='#' data-role='button'  data-theme='a' >del</a>" +
				"<a href='#' data-role='button'  data-theme='a' >copy</a></div>");
				
				$("#MediaThumbList").append("<div class='ui-grid-b'>");
				var count=0;
				var row;
				$(json).each(function(key, val) {
					count++; // ������ �ϳ��� count�� ����
					if(count%3 == 0)
						row = 'c';
					else if(count%3 == 1)
						row= 'a';
					else if(count%3 == 2)
						row = 'b';
					$("#MediaThumbList .ui-grid-b").append(
							$("<div class='ui-block-"+row+" thumb element' select='unselect'><div data-role='content' class='mediaType'  folderPath='"+path+"' id='"+val.type+"'><img class='perMediaThumb' src='"+val.type+val.path+"' />" +
									"<span>"+val.name + "</span></div></div>"));
								});
				// �� �����ۿ� ���� �̺�Ʈ���
				mangoAPI.fileButtons.bindItemBtn(mediaType);
				//mangoAPI.fileButtons.bindSelectAllBtn('#MediaThumbList LI');	
			}
		});
	}
}); 