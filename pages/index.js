import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    try {
      console.log("Calling OpenAI...");
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      console.log("OpenAI replied...", data);

      if (data.status === "error") {
        console.error("Error:", data.error);
        setApiOutput("Error: Failed to generate khutbah. Please try again.");
      } else {
        setApiOutput(data.output);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiOutput("Error: Failed to generate khutbah. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Khutbah Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Input a topic and we'll generate a khutbah based on it </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="Example: Preparing for Ramadan"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="" target="_blank" rel="noreferrer">
          <div className="badge">
            <p>Built by Osman</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
