// document.getElementById('bizFile').addEventListener('change', function(){
// 	var filename = document.getElementById('fileName');
// 	if(this.files[0] == undefined){
// 		filename.innerText = '';
// 		return;
// 	}
// 	filename.innerText = this.files[0].name;
// });

var fileCount = 0;
var fileNo = 0;
var filesArr = new Array();

/* 첨부파일 추가 */
function addFile(obj){
    var maxFileCnt = 4;   // 첨부파일 최대 개수
    var attFileCnt = document.querySelectorAll('.filebox').length;    // 기존 추가된 첨부파일 개수
    var remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
    var curFileCnt = obj.files.length;  // 현재 선택된 첨부파일 개수


    // 첨부파일 개수 확인
    if (curFileCnt > remainFileCnt) {
        alert("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.");
    } else {
        for (const file of obj.files) {
            // 첨부파일 검증
            if (validation(file)) {
                // 파일 배열에 담기
                var reader = new FileReader();
                reader.onload = function () {
                    filesArr.push(file);
                };
                reader.readAsDataURL(file);

                // 목록 추가
                let htmlData = '';
                htmlData += '<div id="file' + fileNo + '" class="filebox">';
                htmlData += '   <p class="name">' + file.name + '</p>';
                htmlData += '   <a id="file+fileNo" class="delete" onclick="deleteFile(' + fileNo + ');"><i class="fas fa-minus-square"></i></a>';
                htmlData += '</div>';
                $('.file-list').append(htmlData);
                fileNo++;
            } else {
                continue;
            }
        }
    }
    // 초기화
    document.querySelector("input[type=file]").value = "";
}




/* 첨부파일 검증 */
function validation(obj){
    // const fileTypes = ['application/vnd.ms-excel','Excel Workbook/xlsx'];
    if (obj.name.length > 100) {
        alert("파일명이 100자 이상인 파일은 제외되었습니다.");
        return false;
    } else if (obj.size > (100 * 1024 * 1024)) {
        alert("최대 파일 용량인 100MB를 초과한 파일은 제외되었습니다.");
        return false;
    } else if (obj.name.lastIndexOf('.') == -1) {
        alert("확장자가 없는 파일은 제외되었습니다.");
        return false;
    } 
	else if(fileNo != 0) {
		for(var i = 0; i < filesArr.length; i++ ){
		if(filesArr[i].name == obj.name){
			alert("중복된 파일입니다.")
			return false;
		}   
	    }
		return true;
	} 
	else {
        return true;
    }
}

/* 첨부파일 삭제 */
function deleteFile(num) {
    fileNo = num;
    fileNo--;
    $('#file' + num).remove();
    var copyFilesArr = [...filesArr];
    copyFilesArr.splice(num, 1);
    filesArr = [...copyFilesArr];

    
}

/* 폼 전송 */
function submitForm() {
    // 폼데이터 담기
    var form = document.querySelector("form");
    var formData = new FormData(form);
    for (var i = 0; i < filesArr.length; i++) {
        // 삭제되지 않은 파일만 폼데이터에 담기
        formData.append("attach_file", filesArr[i]);
    }

    $.ajax({
        method: 'POST',
        url: '/excel/upload',
        dataType: 'json',
        data: formData,
        async: true,
        timeout: 30000,
        cache: false,
        headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'},
        success: function () {
            alert("파일업로드 성공");
        },
		beforeSend: function (){  
			$("#progress-top").show(); //프로그래스 바
		},
		complete : function (){
			$("#progress-top").hide(); //프로그래스 바
		},
        error: function (xhr, desc, err) {
            alert('에러가 발생 하였습니다.');
            return;
        }
    })
}
// $(function(){	
// 		$("#btn").on("click", function(){
// 			console.log("click Time : " + new Date);
			
// 			var form = $("#fileForm")[0];
// 			var formData = new FormData(form);
// 			$.ajax({
// 				type: "POST",
// 				enctype: 'multipart/form-data',
// 				url: "/excel/upload",
// 				data: formData,
// 				processData: false,
// 				contentType: false,
// 				cache: false,
// 				xhr: function(){
// 					var xhr = $.ajaxSettings.xhr();
// 					xhr.upload.onprogress = function(e){
// 						var per = e.loaded * 100 / e.total;
// 						progressBar(per);
// 					};
// 					return xhr;
// 				},
// 				success: function (data) {
// 					console.log("SUCCESS : ", data);
// 				},
// 				error: function (e) {
// 					console.log("ERROR : ", e);
// 				}
// 			});
// 		});
// 	});
	
	function progressBar(per){
		if(per > 55){
			$(".progressPer").css("color", "#000");
		}
		per = per.toFixed(1);
		$(".progressPer").text(per+" %");
		$(".progressNow").css("width", "calc(" + per + "% - 20px)");
	}