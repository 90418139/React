const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const userId = urlParams.get('state');
// $('#idForm input[name=code]').val(code);
async function fireStoreAdd(userId, token){
    firebase.initializeApp({
        apiKey: "AIzaSyAPCDWzc10yjGG-CmsCXGvZgmOmZ0AybYQ",
        authDomain: "remind-7d375.firebaseapp.com",
        databaseURL: "https://remind-7d375-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "remind-7d375",
        storageBucket: "remind-7d375.appspot.com",
        messagingSenderId: "870876543636",
        appId: "1:870876543636:web:c2005de339a9fba189d281",
        measurementId: "G-DN5M7P6BMZ"
    });
    let db = firebase.firestore();
    await db.collection("Remind2").add({
        userId: userId,
        notify: token,
    })
        .then((docRef) => {
            alert('取得成功!!');
            location.replace(location.href.substring(0, location.href.indexOf('notify')));
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    return;
}
function Loading(e) {
    $(e).empty();
    $(e).prop('disabled', true);
    $(e).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>');
}
$(document).ready(function () {
    $('#root').addClass('container');
    let p = $('<p/>').attr('class', 'card-text').html('因為無後端，技術上的限制無法自動完成取得Line Notify代碼。\n' +
        '                        <br/>\n' +
        '                        所以要請你自己按送出。\n' +
        '                        <br/>\n' +
        '                        送出後會出現類似以下的代碼。\n' +
        '                        <br/>\n' +
        '                        <span class="text-danger">{"status":200,"message":"access_token is issued","access_token":"abcdefg1234567890"}</span>\n' +
        '                        <br/>\n' +
        '                        請複製下來後回到本頁貼到下面的格子。\n' +
        '                        <input class="form-control" name="token">');
    let span = $('<span/>').attr('class', 'text-danger').text('注：本次動作只要做一次即可下次進入就不會再出現了');
    let cardBody = $('<div/>').attr('class', 'card-body').append([p, span]);
    let inputGrantType = $('<input/>').attr({
        type: "hidden",
        name: "grant_type",
        value: "authorization_code"
    });
    let inputRedirectUri = $('<input/>').attr({
        type: "hidden",
        name: "redirect_uri",
        value: "https://90418139.github.io/React/notify"
    });
    let inputClientId = $('<input/>').attr({
        type: "hidden",
        name: "client_id",
        value: "MiC6LIxtzUOk6sipXu6XEN"
    });
    let inputClientSecret = $('<input/>').attr({
        type: "hidden",
        name: "client_secret",
        value: "93A5uyQ7XcpaMH0do3590GiWyF7OjCAAuqySB4QoaGn"
    });
    let inputCode = $('<input/>').attr({
        type: "hidden",
        name: "code",
        value: code
    });
    let button = $('<button/>').attr({
        type: "submit",
        class: "btn btn-primary rounded-pill btn-block"
    }).text('取得Line Notify代碼');
    let form = $('<form/>').attr({
        id: "idForm",
        method: "post",
        enctype: "application/x-www-form-urlencoded",
        action: "https://notify-bot.line.me/oauth/token"
    }).append([inputGrantType, inputRedirectUri, inputClientId, inputClientSecret, button]);
    let cardFooter = $('<div/>').attr('class', 'card-footer').append(form);
    let card = $('<div/>').attr('class', 'card').append([cardBody, cardFooter]);
    let col = $('<div/>').attr('class', 'col').append(card);
    let row = $('<div/>').attr('class', 'row').append(col);
    $('#root').append(row);
    // $('#idForm button').on('click',function () {
    //     $(this).submit();
    // });
    $('input[name=token]').on('change', function () {
        Loading($('#idForm button'));
        let token = JSON.parse($('input[name=token]').val());
        if (token.status !== 200){
            alert('取得失敗請重試!!');
            location.replace(location.href.substring(0, location.href.indexOf('notify')));
        }
        _ = fireStoreAdd(userId, token.access_token);
    });
});