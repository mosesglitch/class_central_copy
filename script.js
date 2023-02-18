// const axios = require("axios");
//variables
const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=`;
const maxChunksize = 100;
const language = "hi";
const API_KEY = "AIzaSyDGam-Wn9ns35uZsspJ4MmIINC4JLIruYk";

document.addEventListener("DOMContentLoaded", function () {
  const changeLanguage = (url, api_key, language, chunk_size) => {
    const tags = ["span", "p", "strong", "h2", "h3", "h4", "h5", "h1"];

    //function to translate text and return translated text
    async function translateText(text, type) {
      const urls = `${url}${api_key}`;
      const response = await fetch(urls, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: language,
        }),
      });
      const data = await response.json();
      if (data.data.translations != undefined) {
        const translatedText = data.data.translations;
        return translatedText;
      }
      if (type) {
        return data.data;
      }
    }

    //loop over tags in html
    for (let i = 0; i < tags.length; i++) {
      const textInTags = document.getElementsByTagName(tags[i]);

      const textInTagsArr = Array.from(textInTags);
      const newArr = [];
      for (elem of textInTagsArr) {
        newArr.push(elem.textContent.trim().replace(/\n/g, " "));
      }

      //function to iterate over the html elements and call the translater function
      async function translateChunks(newArr) {
        const translatedText = [];
        for (let i = 0; i < newArr.length; i += chunk_size) {
          const chunk = newArr.slice(i, i + chunk_size);
          const translatedChunk = await translateText(chunk);
          translatedText.push(...translatedChunk);
        }

        for (let j = 0; j < textInTags.length; j++) {
          textInTags[j].innerHTML = translatedText[j].translatedText;
        }

        return translatedText;
      }

      //Change placeholder text
      const newTranslatedArr = translateChunks(newArr);
    }
    const inputs = document.getElementsByTagName("input");
    (async () => {
      for (let i = 0; i < inputs.length; i++) {
        const textInTagsArr = inputs[i].placeholder;
        const translatedChunk = await translateText(textInTagsArr, inputs);
        // console.log(translatedChunk[i].translatedText);
        inputs[i].placeholder = translatedChunk[i].translatedText;
      }
    })();

    const footersA = document.querySelectorAll(".bg-gray-xxlight a");

    const footersArr = Array.from(footersA);
    const newArr = [];
    for (elem of footersArr) {
      newArr.push(elem.textContent.trim().replace(/\n/g, " "));
    }
    async function translateChunks(newArr) {
      const translatedText = [];
      for (let i = 0; i < newArr.length; i += chunk_size) {
        const chunk = newArr.slice(i, i + chunk_size);
        const translatedChunk = await translateText(chunk);
        translatedText.push(...translatedChunk);
      }

      for (let j = 0; j < footersA.length; j++) {
        footersA[j].innerHTML = translatedText[j].translatedText;
      }

      return translatedText;
    }
    const newTranslatedArr = translateChunks(newArr);
  };
  changeLanguage(apiUrl, API_KEY, language, maxChunksize);
});
