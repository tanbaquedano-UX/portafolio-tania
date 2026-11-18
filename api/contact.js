// Vercel Function: envía mensajes mediante Resend sin exponer claves en el navegador.
// Configura RESEND_API_KEY, CONTACT_TO_EMAIL y CONTACT_FROM_EMAIL en Vercel.
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
  const {name='',email='',message='',website=''}=req.body||{};
  if(website)return res.status(200).json({ok:true}); // honeypot
  if(typeof name!=='string'||typeof email!=='string'||typeof message!=='string'||name.trim().length<2||name.length>100||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.trim().length<10||message.length>4000)return res.status(400).json({error:'Invalid data'});
  const {RESEND_API_KEY,CONTACT_FROM_EMAIL}=process.env;
  const CONTACT_TO_EMAIL=process.env.CONTACT_TO_EMAIL||'tanbaquedano@gmail.com';
  if(!RESEND_API_KEY||!CONTACT_TO_EMAIL||!CONTACT_FROM_EMAIL){console.error('Missing contact email configuration');return res.status(503).json({error:'Email delivery is not configured'});}
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:email,subject:'Nuevo mensaje del portafolio — '+name.trim().slice(0,80),html:'<h2>Nuevo mensaje desde tu portafolio</h2><p><strong>Nombre:</strong> '+escapeHtml(name)+'</p><p><strong>Correo:</strong> '+escapeHtml(email)+'</p><p><strong>Mensaje:</strong></p><p style="white-space:pre-wrap">'+escapeHtml(message)+'</p>'}),signal:controller.signal});
    if(!response.ok){console.error('Email provider failed:',response.status);return res.status(502).json({error:'Delivery failed'});}return res.status(200).json({ok:true});
  }catch(err){console.error('Email request failed');return res.status(502).json({error:'Delivery failed'});}finally{clearTimeout(timer)}
}
