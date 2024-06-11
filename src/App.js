import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sucess from './sounds/correct.mp3'
import error from './sounds/error.mp3'

const teclas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const tempoLimite = 10;

function Minigame() {
  const [sequencia, setSequencia] = useState('');
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(tempoLimite);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [melhoresPontuacoes, setMelhoresPontuacoes] = useState([]);
  useEffect(() => {
    if (jogoIniciado && tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante((prevTempo) => prevTempo - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (tempoRestante === 0) {
      toast.error('Tempo esgotado! Jogo encerrado.');
      reiniciarJogo();
    }
  }, [jogoIniciado, tempoRestante]);

  function iniciarJogo() {
    const novaSequencia = gerarSequencia();
    setSequencia(novaSequencia);
    setIndiceAtual(0);
    setTempoRestante(tempoLimite);
    setJogoIniciado(true);
  }

  function gerarSequencia() {
    let novaSequencia = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * teclas.length);
      novaSequencia += teclas[randomIndex];
    }
    return novaSequencia;
  }
  function verificarTecla(event) {
    const teclaPressionada = event.key.toUpperCase();
    if (jogoIniciado && teclaPressionada === sequencia[indiceAtual]) {
      if (indiceAtual === sequencia.length - 1) {
        new Audio(sucess).play(); 
        toast.success('Sequência completada! Parabéns!');
        aumentarPontuacao(); 
        encerrarJogo(); 
        reiniciarJogo();
      } else {
        setIndiceAtual((prevIndice) => prevIndice + 1);
      }
    } else if (jogoIniciado && teclaPressionada !== sequencia[indiceAtual]) {
      new Audio(error).play(); 
      toast.warn('Tecla incorreta! Jogo encerrado.');
      encerrarJogo(); 
      reiniciarJogo();
    }
  }
  function aumentarPontuacao() {
    setPontuacao((prevPontuacao) => prevPontuacao + 1);
  }

  function encerrarJogo() {
    const pontuacoesSalvas = JSON.parse(localStorage.getItem('melhoresPontuacoes')) || [];
    const novaPontuacao = { pontuacao, data: new Date().toLocaleDateString() };
    pontuacoesSalvas.push(novaPontuacao);
    pontuacoesSalvas.sort((a, b) => b.pontuacao - a.pontuacao);
    const melhores = pontuacoesSalvas.slice(0, 5);
    localStorage.setItem('melhoresPontuacoes', JSON.stringify(melhores));
    setJogoIniciado(false);
    setMelhoresPontuacoes(melhores);
    setSequencia('');
    setIndiceAtual(0);
    setTempoRestante(tempoLimite);
  }
  

  function reiniciarJogo() {
    setSequencia('');
    setIndiceAtual(0);
    setTempoRestante(tempoLimite);
    setJogoIniciado(false);
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="background"></div>
      <h1>Minigame - Pressione as teclas na ordem correta!</h1>
      
      {jogoIniciado ? (
        <div className="game-area">
          <div className="sequence">
            {sequencia.split('').map((letra, index) => (
              <div
                key={index}
                className="card"
                style={{
                  backgroundColor: index === indiceAtual ? 'lightgreen' : 'white'
                }}
              >
                {letra}
              </div>
            ))}
          </div>
          <h2>Tempo Restante: {tempoRestante}s</h2>
          <div className="input-container">
            <input type="text" onKeyUp={verificarTecla} autoFocus />
          </div>
        </div>
      ) : null}
        
      <button onClick={jogoIniciado ? reiniciarJogo : iniciarJogo}>
        {jogoIniciado ? 'Reiniciar Jogo' : 'Iniciar Jogo'}
      </button>
  
      <div className="highscores">
        <h2>Melhores Pontuações</h2>
        <ul>
          {melhoresPontuacoes.map((pontuacao, index) => (
            <li key={index}>
              {pontuacao.pontuacao} pontos em {pontuacao.data}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
}

export default Minigame;
