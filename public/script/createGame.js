
function createGame(){
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/createGame');
    form.style.display = 'hidden';
    document.body.appendChild(form)
    form.submit();
}

