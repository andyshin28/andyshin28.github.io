var infoBox = document.getElementById("infoBox"); // 取得訊息控制項 infoBox
var textBox = document.getElementById("wordsExpect"); // 取得最終的辨識訊息控制項 textBox
var tempBox = document.getElementById("wordsExpect"); // 取得中間的辨識訊息控制項 tempBox
var recordImgBtn = document.getElementById("recordImgBtn"); // 錄音鈕
var toastBar = document.getElementById("snackbar");
var spinnerImg = document.getElementById("spinner"); // ajax img
var startStopButton; // 「辨識/停止」按鈕
var final_transcript = ''; // 最終的辨識訊息的變數
var recognizing = false; // 是否辨識中

// 送出任務
function submitTask(){
    var taskContent = document.getElementById('wordsExpect');
    $("#spinner").addClass("show");
    $.ajax({
        url:'https://nineyi.azurewebsites.net/Trello/Input',
        type: 'POST',
        dataType: 'JSON',
        data: {"content": taskContent.value},
        success: function(res){
            if(res){
                for(var i in res){
                    document.getElementById('apiRes').innerHTML += res[i] + "<br/>";
                }

                taskContent.innerHTML = "";
                toastBar.innerHTML = "Success";
                $("#snackbar").addClass("show");
                closeToast(2000);
            }else{
                toastBar.innerHTML = "主人我接到了，但是是非預期的狀況";
            }
        },
        error: function(err){
            toastBar.innerHTML = "有點小問題 顆顆～請稍後再試";
            $("#snackbar").addClass("show");
            closeToast(2000);
        },
        complete: function(){
            $("#spinner").removeClass("show");
        }
    });
}

function listTask(){
    $.ajax({
        url: '',
        data: {'content': ''},
        dataType: 'JSON',
        success: function(){

        },
        error: function(){

        }
    });
}

function closeToast(time){
    setTimeout(function(){
        // toastBar.className = toastBar.className.replace("show", "");
        $("#snackbar").removeClass("show");
    }, time);
}

// 開始語音辨識
function startRecord() {
    // startStopButton = document.getElementById("startStopButton"); // 取得「辨識/停止」這個按鈕控制項
    // langCombo = document.getElementById("langCombo"); // 取得「辨識語言」這個選擇控制項

    if (recognizing) { // 如果正在辨識，則停止。
        recognition.stop();
        recordImgBtn.src = 'image/mic.gif';
    } else { // 否則就開始辨識
        recordImgBtn.src = 'image/mic-animate.gif';
        textBox.value = ''; // 清除最終的辨識訊息
        tempBox.value = ''; // 清除中間的辨識訊息
        final_transcript = ''; // 最終的辨識訊息變數
        recognition.lang = 'cmn-Hant-TW';  // 設定辨識語言
        recognition.start(); // 開始辨識
    }
}

if (!('webkitSpeechRecognition' in window)) {  // 如果找不到 window.webkitSpeechRecognition 這個屬性
    // 就是不支援語音辨識，要求使用者更新瀏覽器。
    // infoBox.innerText = "本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)";
} else {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)(); // 建立語音辨識物件 webkitSpeechRecognition
    recognition.continuous = true; // 設定連續辨識模式
    recognition.interimResults = true; // 設定輸出中先結果。

    recognition.onstart = function() { // 開始辨識
        recognizing = true; // 設定為辨識中
        // startStopButton.value = "按此停止"; // 辨識中...按鈕改為「按此停止」。
        infoBox.innerText = "語音辨識中...";  // 顯示訊息為「辨識中」...
    };

    recognition.onend = function() { // 辨識完成
        recognizing = false; // 設定為「非辨識中」
        // startStopButton.value = "開始辨識";  // 辨識完成...按鈕改為「開始辨識」。
        infoBox.innerText = ""; // 不顯示訊息
    };

    recognition.onresult = function(event) { // 辨識有任何結果時
        var interim_transcript = ''; // 中間結果
        for (var i = event.resultIndex; i < event.results.length; ++i) { // 對於每一個辨識結果
            if (event.results[i].isFinal) { // 如果是最終結果
                final_transcript += event.results[i][0].transcript; // 將其加入最終結果中
            } else { // 否則
                interim_transcript += event.results[i][0].transcript; // 將其加入中間結果中
            }
        }
        if (final_transcript.trim().length > 0) // 如果有最終辨識文字
            textBox.value = final_transcript; // 顯示最終辨識文字
        if (interim_transcript.trim().length > 0) // 如果有中間辨識文字
            tempBox.value = interim_transcript; // 顯示中間辨識文字
    };
}


