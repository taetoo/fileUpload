// document.getElementById('bizFile').addEventListener('change', function(){
// 	var filename = document.getElementById('fileName');
// 	if(this.files[0] == undefined){
// 		filename.innerText = '';
// 		return;
// 	}
// 	filename.innerText = this.files[0].name;
// });

let fileCount = 0;
let fileNo = 0;
let filesArr = new Map();

/* 첨부파일 추가 */
function addFile(obj) {
    let maxFileCnt = 4;   // 첨부파일 최대 개수
    let attFileCnt = document.querySelectorAll('.filebox').length;    // 기존 추가된 첨부파일 개수
    let remainFileCnt = maxFileCnt - attFileCnt;    // 추가로 첨부가능한 개수
    let curFileCnt = obj.files.length;  // 현재 선택된 첨부파일 개수


    // 첨부파일 개수 확인
    if (curFileCnt > remainFileCnt) {
        alert("첨부파일은 최대 " + maxFileCnt + "개 까지 첨부 가능합니다.");
    } else {
        for (const file of obj.files) {
            // 첨부파일 검증
            if (validation(file)) {
                // 파일 배열에 담기
                filesArr.set(fileNo, file);
                // 선택한 파일 목록 추가
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
function validation(obj) {
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
    else if (fileNo != 0) {
        for (let value of filesArr.values()) {
            if (value.name == obj.name) {
                alert("중복된 파일입니다.")
                return false; ㅔ
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
    $('#file' + num).remove();
    filesArr.delete(num);
  
    console.log(filesArr)
}

/* 폼 전송 */
function submitForm() {
    // 폼데이터 담기
    let form = document.querySelector("form");
    let formData = new FormData(form);
    for (var value of filesArr.values()) {
        // 삭제되지 않은 파일만 폼데이터에 담기
        formData.append("attach_file", value);


    }

    $.ajax({
        method: 'POST',
        url: '/excel/upload',
        dataType: 'json',
        data: formData,
        async: true,
        timeout: 30000,
        cache: false,
        headers: { 'cache-control': 'no-cache', 'pragma': 'no-cache' },
        success: function () {
            alert("파일업로드 성공");
        },
        beforeSend: function () {
            $("#progress-top").show(); //프로그래스 바
        },
        complete: function () {
            $("#progress-top").hide(); //프로그래스 바
        },
        error: function (xhr, desc, err) {
            alert('에러가 발생 하였습니다.');
            return;
        }
    })
}
// 프로그래스바	
function progressBar(per) {
    if (per > 55) {
        $(".progressPer").css("color", "#000");
    }
    per = per.toFixed(1);
    $(".progressPer").text(per + " %");
    $(".progressNow").css("width", "calc(" + per + "% - 20px)");
}