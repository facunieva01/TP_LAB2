document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('G7oxKVTHVt4sYaRni');

    const form = document.getElementById('contact-form');
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    const btnLimpiar = document.querySelector('.btn-limpiar');

    const validarCampos = () => {
        const nombreVal = nombre.value.trim();
        const emailVal = email.value.trim();
        const mensajeVal = mensaje.value.trim();

        if (!nombreVal || !emailVal || !mensajeVal) {
            alert('Por favor, complete todos los campos.');
            return false;
        }
        return { nombreVal, emailVal, mensajeVal };
    };

    const validarEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const enviarFormulario = (e) => {
        e.preventDefault();
        const datos = validarCampos();
        if (!datos) return;

        if (!validarEmail(datos.emailVal)) {
            alert('Por favor, ingrese un email válido.');
            return;
        }

        const templateParams = {
            from_name: datos.nombreVal,
            from_email: datos.emailVal,
            message: datos.mensajeVal,
        };

        console.log('Datos enviados:', templateParams);

        emailjs.send('service_pcy5v4a', 'template_bnom28m', templateParams)
            .then(() => {
                alert('Formulario enviado correctamente.');
                form.reset();
            })
            .catch((error) => {
                console.error('Error al enviar el formulario:', error);
                alert('Hubo un problema al enviar el formulario. Inténtelo nuevamente más tarde.');
            });
    };

    form.addEventListener('submit', enviarFormulario);
    btnLimpiar.addEventListener('click', () => form.reset());
});
