$(function(){	
		$("#btn").on("click", function(){
			console.log("click Time : " + new Date);
			
			var form = $("#fileForm")[0];
			var formData = new FormData(form);
			$.ajax({
				type: "POST",
				enctype: 'multipart/form-data',
				url: "/excel/upload",
				data: formData,
				processData: false,
				contentType: false,
				cache: false,
				xhr: function(){
					var xhr = $.ajaxSettings.xhr();
					xhr.upload.onprogress = function(e){
						var per = e.loaded * 100 / e.total;
						progressBar(per);
					};
					return xhr;
				},
				success: function (data) {
					console.log("SUCCESS : ", data);
				},
				error: function (e) {
					console.log("ERROR : ", e);
				}
			});
		});
	});
	
	function progressBar(per){
		if(per > 55){
			$(".progressPer").css("color", "#000");
		}
		per = per.toFixed(1);
		$(".progressPer").text(per+" %");
		$(".progressNow").css("width", "calc(" + per + "% - 20px)");
	}

	var fileNo = 0;
    var filesArr = new Array();
    
    /* 첨부파일 추가 */
    function addFile(obj){
        var maxFileCnt = 3;   // 첨부파일 최대 개수
        var attFileCnt = document.querySelectorAll('.filebox').length;    // 기존 추가된 첨부파일 개수
        var remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
        var curFileCnt = obj.files.length;  // 현재 선택된 첨부파일 개수
    
        // 첨부파일 개수 확인
        if (curFileCnt > remainFileCnt) {
            alert("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.");
            location.reload();
        }
    
        for (var i = 0; i < Math.min(curFileCnt, remainFileCnt); i++) {
    
            const file = obj.files[i];
    
            // 첨부파일 검증
            if (validation(file)) {
                // 파일 배열에 담기
                var reader = new FileReader();
                reader.onload = function () {
                    filesArr.push(file);
                };
                reader.readAsDataURL(file)
    
                // 목록 추가
                let htmlData = '';
                htmlData += '<div id="file' + fileNo + '" class="filebox">';
                htmlData += '   <p class="name">' + file.name + '</p>';
                htmlData += '   <a class="delete" onclick="deleteFile(' + fileNo + ');"><i class="far fa-minus-square"></i></a>';
                htmlData += '</div>';
                $('.file-list').append(htmlData);
                fileNo++;
            } else {
                continue;
            }
        }
        // 초기화
        document.querySelector("input[type=file]").value = "";
    }
    
   
    /* 폼 전송 */
    function submitForm() {
        // 폼데이터 담기
        var form = document.querySelector("form");
        var formData = new FormData(form);
        for (var i = 0; i < filesArr.length; i++) {
            // 삭제되지 않은 파일만 폼데이터에 담기
            if (!filesArr[i].is_delete) {
                formData.append("attach_file", filesArr[i]);
            }
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
            error: function (xhr, desc, err) {
                alert('에러가 발생 하였습니다.');
                return;
            }
        })

}