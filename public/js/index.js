// referencias HTML
const formularioRegistro = document.querySelector('form');

const url = 'http://localhost:8080/'

// evenlisteners
formularioRegistro.addEventListener('submit', e => {
    e.preventDefault();

    const formData = {};

    for(let el of formularioRegistro) {
        if(el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'api/auth/login', {
        method: 'POST',
        body : JSON.stringify(formData),
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
        if(data.msg) {
            Swal.fire(
                'Advertencia',
                data.msg,
                'warning'
            );
            return;
        }
        if(data.errors) {
            let errors = ''
            data.errors.forEach(error => {
                errors += error.msg + ' | '
            });
            Swal.fire(
                'Advertencia',
                errors,
                'warning'
            );
            return;
        } 
        const token = data.token;
        localStorage.setItem('token-cola', token);

        Swal.fire({
            title: 'Inicio de sesion exitoso',
            confirmButtonText: 'Ok',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location = 'principal.html';
            } 
        });


    })
    .catch(err => {
        console.log(err);
    })





});

