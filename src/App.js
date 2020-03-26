import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames";

import "./App.css";

import { PlayFace } from "components";

const copyUrlToClipboard = () => {
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.value = window.location.href;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

const share = () => {
  navigator.share({
    url: window.location.href,
    title: "ManuYell"
  });
};

const yell = bit =>
  new Promise(resolve => {
    const synthetizer = window.speechSynthesis;
    const { text, lang } = bit;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.addEventListener("end", resolve);
    synthetizer.speak(utterance);
  });

const decodeBit = encodedBit => {
  if (encodedBit === "") {
    return {
      text: "",
      lang: navigator.language
    };
  }
  const [lang, ...splittedText] = atob(encodedBit).split("|");
  const text = splittedText.join("|");
  return { text, lang };
};

const encodeBit = bit => {
  const { text, lang } = bit;
  return btoa(`${lang}|${text}`);
};

const getVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(
    (voice, index) => voices.findIndex(_ => _.lang === voice.lang) === index
  );
};

const isBitValid = bit => Boolean(bit.text && bit.lang);

function App() {
  const history = useHistory();
  const { location } = history;
  const [isPlaying, setIsPlaying] = useState(false);
  const bit = decodeBit(location.pathname.slice(1));
  const [voices, setVoices] = useState(getVoices());
  const bitIsValid = isBitValid(bit);
  const [hasBeenPlayed, setHasBeenPlayed] = useState(!bitIsValid);
  const [copied, setCopied] = useState(false);

  speechSynthesis.onvoiceschanged = () => setVoices(getVoices());

  const copy = () => {
    copyUrlToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onTextInput = event => {
    const text = event.target.value;
    const newBit = { ...bit, text };
    history.replace("/" + encodeBit(newBit));
  };

  const play = async () => {
    setIsPlaying(true);
    await yell(bit);
    setIsPlaying(false);
    if (!hasBeenPlayed) {
      setHasBeenPlayed(true);
    }
  };

  const enablePlay = !isPlaying && bitIsValid;

  const onFormSubmit = async event => {
    event.preventDefault();
    if (enablePlay) {
      await play();
    }
    return false;
  };

  const onLangSelect = event => {
    const lang = event.target.value;
    const newBit = { ...bit, lang };
    history.replace("/" + encodeBit(newBit));
  };

  const showForm = !bitIsValid || hasBeenPlayed;

  return (
    <div>
      <div className={cn("face-wrapper", { focus: !showForm })}>
        <PlayFace
          isPlaying={isPlaying}
          onFaceClick={play}
          enabled={enablePlay}
        />
      </div>
      <div className={cn("form-wrapper", { show: showForm })}>
        <form onSubmit={onFormSubmit}>
          <select
            value={bit.lang}
            onChange={onLangSelect}
            className="lang-select"
          >
            {voices.map(voice => (
              <option key={voice.lang} value={voice.lang}>
                {voice.name}
              </option>
            ))}
          </select>
          <br />
          <input
            className="text-input"
            type="text"
            name="voice-text"
            onChange={onTextInput}
            value={bit.text}
            placeholder="Texte à prononcer..."
            autoFocus
          />
        </form>
        {navigator.share && (
          <button onClick={share} className="button" disabled={!bitIsValid}>
            Share
          </button>
        )}
        <button onClick={copy} className="button" disabled={!bitIsValid}>
          Copy link
        </button>
        {copied && <span className="copy-message"> copied!</span>}
      </div>
    </div>
  );
}

export default App;
