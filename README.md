# Portafolio listo para Vercel

## Datos de contacto
Los datos reales ya están cargados en `contact-config.js`: celular +56971038585, LinkedIn https://www.linkedin.com/in/tania-baquedano-ux-content-strategist y correo tanbaquedano@gmail.com. El modal muestra los tres canales de contacto.

## Formulario que llega a Gmail
Utiliza la API de Resend a través de `/api/contact.js`. El correo destinatario puede ser una cuenta Gmail. En Vercel > Project > Settings > Environment Variables, configurar:

- `RESEND_API_KEY`: clave privada de Resend.
- `CONTACT_TO_EMAIL`: opcional; por defecto los mensajes se envían a `tanbaquedano@gmail.com`. Se puede definir para cambiar el destinatario.
- `CONTACT_FROM_EMAIL`: dirección remitente autorizada en Resend, por ejemplo `Portafolio <contacto@tudominio.cl>`. Se requiere configurar/verificar el dominio remitente en Resend. No usar Gmail como remitente si no está verificado en Resend.

No incluir claves en el HTML o en `contact-config.js`. Las variables deben aplicarse en Production y Preview si quieres probar allí. Volver a desplegar tras configurarlas.

## Publicar en Vercel
Subir esta carpeta a un repositorio GitHub y luego, en https://vercel.com/new, importarlo. Framework: `Other`. Root Directory: raíz del repositorio. Deploy. También es posible usar `vercel deploy --prod` desde esta carpeta con Vercel CLI autenticada.

## Comprobaciones
Probar el modal en español e inglés, la navegación con teclado, los enlaces y un envío real después de configurar Resend. Si falta configuración de correo, el formulario mostrará un error (no afirma que envió el mensaje).

## Seguridad de producción
Se incluye honeypot y validación de datos. Antes de difundir el enlace ampliamente, conviene añadir protección anti-spam y rate limiting en la función, por ejemplo Turnstile y Upstash Redis.
