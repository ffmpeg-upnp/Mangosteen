$(document).ready (function () {
var uAgent = navigator.userAgent.toLowerCase();  //Mobile�� �� �����ϱ� �������� ����

    alert(document.URL);
/*�Ʒ��� ����� ��ġ���� ����� ������ ���������� ��ũ��Ʈ*/ 
    var mobilePhones = new Array('iphone', 'ipod', 'ipad', 'android', 'blackberry', 'windows ce','nokia', 'webos', 'opera mini', 'sonyericsson', 'opera mobi', 'iemobile');
    for (var i = 0; i < mobilePhones.length; i++)
        if (uAgent.indexOf(mobilePhones[i]) != -1)
           document.location = document.URL+"mobile/index.html"; 
});