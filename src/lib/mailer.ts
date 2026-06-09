import nodemailer from 'nodemailer';

// Configuración del transporter (usa un servicio como Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Plataforma Psicológica" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verifica tu cuenta - Plataforma Psicológica",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #667eea;">Plataforma Psicológica</h1>
        <h2>¡Bienvenido, ${name}!</h2>
        <p>Gracias por registrarte en nuestra plataforma. Para comenzar a usar tu cuenta, necesitas verificar tu dirección de correo electrónico.</p>
        <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verificar mi cuenta
        </a>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
        <p>Este enlace expirará en 24 horas.</p>
        <hr />
        <p style="color: #999; font-size: 12px;">Si no solicitaste esta verificación, ignora este mensaje.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo de verificación enviado a ${email}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
}