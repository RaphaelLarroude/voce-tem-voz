# Você Tem Voz

Site responsivo para denúncias anônimas de bullying, preconceito, discriminação e outras situações escolares.

## Envio das denúncias

As denúncias são enviadas pelo Formspree para o endpoint configurado em `script.js`:

```js
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkjgdyyw";
```

Os relatos chegam no e-mail conectado ao formulário Formspree.

## Como publicar no GitHub Pages

1. Entre no repositório.
2. Vá em **Settings > Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**.
6. Em alguns minutos, o site ficará disponível no endereço mostrado na página.

## Certificado de envio

Após o envio, a pessoa poderá baixar um certificado em PNG com protocolo, data, hora e código de verificação. O conteúdo da denúncia não aparece no certificado.