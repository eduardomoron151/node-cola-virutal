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

    fetch(url + 'api/usuarios', {
        method: 'POST',
        body : JSON.stringify(formData),
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => {
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
        } else {
            Swal.fire({
                    title: 'Exitoso, usuario creado',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location = 'index.html';
                    } 
                });
        }

        
    })
    .catch(err => {
        console.log(err);
    })





});

