import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Configuración de destinatarios y remitentes
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '100guadir@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@impulsogp.com';

/**
 * Enviar email de nuevo inquiry
 * Free: 3,000 emails/mes, 100 emails/día
 */
export const sendInquiryNotification = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  if (!resend) {
    console.warn('\n--- [EMAIL SERVICE (SIMULACIÓN)] ---');
    console.warn('RESEND_API_KEY no está configurado en .env. El correo se habría enviado así:');
    console.warn(`Remitente:   ${SENDER_EMAIL}`);
    console.warn(`Destinatario: ${ADMIN_EMAIL}`);
    console.warn(`Asunto:       📨 Nuevo inquiry: ${subject}`);
    console.warn(`Usuario:      ${name} <${email}>`);
    console.warn(`Mensaje:\n${message}`);
    console.warn('------------------------------------\n');
    return true;
  }

  try {
    // 1. Email de notificación al administrador
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      subject: `📨 Nuevo inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #cbd5e1; white-space: pre-wrap; font-style: italic;">${message}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-bottom: 0;">
            Responder directamente a este correo para contactar al cliente.
          </p>
        </div>
      `,
    });

    // 2. Email de confirmación al usuario
    // NOTA: Si se usa onboarding@resend.dev (remitente de prueba), Resend solo permite enviar correos 
    // a la cuenta del dueño de la API key. Por lo tanto, no se envía confirmación en ese caso para evitar errores.
    const isTestingOnboarding = SENDER_EMAIL.includes('onboarding@resend.dev');
    if (!isTestingOnboarding) {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: `Confirmación de tu inquiry - ${subject}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">¡Gracias por contactarnos!</h2>
            <p>Hola <strong>${name}</strong>,</p>
            <p>Hemos recibido correctamente tu mensaje sobre: "<strong>${subject}</strong>".</p>
            <p>Un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad posible.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #64748b; font-size: 13px; margin-bottom: 5px;"><strong>Resumen de tu mensaje enviado:</strong></p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #cbd5e1; white-space: pre-wrap;">${message}</div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-bottom: 0;">
              Este es un correo automático. Por favor, no respondas a este mensaje.
            </p>
          </div>
        `,
      });
      console.log(`[EMAIL] Notificación enviada al admin (${ADMIN_EMAIL}) y confirmación a ${email}`);
    } else {
      console.log(`[EMAIL] Notificación enviada al admin (${ADMIN_EMAIL}). Se omitió la confirmación a ${email} por remitente de pruebas (onboarding).`);
    }

    return true;
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    // No bloqueamos la respuesta al cliente si el envío de correo falla
    return false;
  }
};
