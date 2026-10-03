# Você Tem Voz

Site responsivo para denúncias anônimas de bullying, preconceito, discriminação e outras situações escolares.

## Como publicar no GitHub Pages

1. Entre no repositório.
2. Vá em **Settings > Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**.
6. Em alguns minutos, o site ficará disponível no endereço mostrado na página.

## Configurar o envio por e-mail

O site usa o EmailJS. Crie uma conta gratuita, configure um serviço de e-mail e um template, depois preencha o arquivo `config.js`:

- `publicKey`
- `serviceId`
- `templateId`

As denúncias serão enviadas para `1912043@aluno.cmc.com.br`.

## Certificado de envio

Após o envio, a pessoa poderá baixar um certificado em PNG com protocolo, data, hora e código de verificação. O conteúdo da denúncia não aparece no certificado.