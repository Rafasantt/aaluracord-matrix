import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import {useRouter} from 'next/router';
import { createClient } from '@supabase/supabase-js'
import {ButtonSendSticker} from './src/components/ButtonSendSticker'

const SUPABASE_ANOW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM2ODY1NSwiZXhwIjoxOTU4OTQ0NjU1fQ.TGG563LNV3CaFl9FhZeWRAflqyvT4_0CPXraLCfWfG4';
const SUPABASE_URL = 'https://qoxiirhbeumajddamakt.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANOW_KEY);

function msgRealTimer(adicionaMensagem){
  return supabaseClient
  .from('Mensagens')
  .on('INSERT', (respostaLive)=>{
    adicionaMensagem(respostaLive.new);
  })
  .subscribe()
}



export default function ChatPage() {
  // Sua lógica vai aqui
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(()=>{
    supabaseClient
      .from('Mensagens')
      .select('*')
      .order('id', {ascending:false})
      .then(({data})=>{
        //console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
      });
      
      msgRealTimer((novaMensagem)=>{
        setListaDeMensagens((valorAtualDaLista)=>{
          return[
            novaMensagem,
            ...valorAtualDaLista
          ]
        })
      })
  }, []);
  // ./Sua lógica vai aqui
/*
  fetch('https://api.github.com/users/rafasantt').then(async(res)=>{
    const resposta = await res.json();
    console.log(resposta);
  })
  */

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from('Mensagens')
      .insert([
        mensagem
      ])
       .then(({data})=>{

      })
    setMensagem('')
  }

  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          {<MessageList mensagens={listaDeMensagens} />}
          {/*{listaDeMensagens.map((mensagemAtual) => {
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })}*/}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TextField
              value={mensagem}
              onChange={event => {
                const valor = event.target.value
                setMensagem(valor)
              }}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleNovaMensagem(mensagem)
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200]
              }}
            />
            <ButtonSendSticker 
              onStickerClick={(sticker)=>{
                //console.log(sticker)
                handleNovaMensagem(':sticker:' + sticker);
              }}
            />
          </Box>
          <Button
            onClick={()=>{
                handleNovaMensagem(mensagem)
            }}
            type='submit'
            label='Enviar'
            styleSheet={{
                width: '50%',
                margin: 'auto'
            }}
            fullWidth
            buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["000"],
            mainColor: appConfig.theme.colors.primary[500],
            mainColorLight: appConfig.theme.colors.primary[400],
            mainColorStrong: appConfig.theme.colors.primary[600],
            }}
            />
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  //console.log(props)
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px'
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
          key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                  {mensagem.de}
                </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {mensagem.texto.startsWith(':sticker:')
            ?(
              <Image src={mensagem.texto.replace(':sticker:', '')}/>
            )
            :(
              mensagem.texto
            )}
          </Text>
        )
      })}
    </Box>
  )
}

