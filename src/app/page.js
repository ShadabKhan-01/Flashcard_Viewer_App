"use client";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import Card from "@/components/card";
import { motion } from "framer-motion";
import { flashcardSets } from "@/data/flashcardSets";
import Loader from "@/components/loader";

export default function FlashcardViewer() {
  const [topic, setTopic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionArray, setquestionArray] = useState([])
  const [iKnow, setiKnow] = useState(0);
  const [iDontKnow, setiDontKnow] = useState(0);

  const handleNext = () => {
    if (currentIndex < flashcardSets[topic].length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {

    const getQuestion = async () => {
      const response = await fetch('/api/getQuestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      // console.log(data.text); // the generated content
      const final = JSON.parse(data.text);
      console.log(final);
      setquestionArray(final)
    };
    if (topic) {
      getQuestion();
    }
  }, [topic])

  if (!topic) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold">Choose a Topic</h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {Object.keys(flashcardSets).map((category) => (
            <Button key={category} text={category} action={() => setTopic(category)}></Button>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  const flashcards = questionArray;
  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex) / flashcards.length) * 100;

  if (!(flashcards.length > 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <Loader />
        <p className="text-2xl font-bold">Loading...</p>
        <p className="text-2xl">Generating Question by the AI</p>
      </div>

    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-3xl font-bold">{topic} Flashcards</h1>
      <div className="w-full max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <motion.div
            className="bg-blue-600 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      {currentCard &&
        <motion.div
          className="flex flex-col items-center justify-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card qusetion={currentCard.question} answer={currentCard.answer} />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button text={"I Know This"}
             action={() => {
              handleNext();
              setiKnow(iKnow+1);
            }}
             isDisabled={currentIndex > flashcards.length - 1} />
            <Button text={"Don’t Know"}
             action={() => {
              handleNext();
              setiDontKnow(iDontKnow+1)
              }} isDisabled={currentIndex > flashcards.length - 1} />
          </div>
        </motion.div>
      }
      {currentIndex > flashcards.length - 1 && (
        <motion.div
          className="flex flex-col items-center justify-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <p className="text-green-600 font-semibold">All cards completed!</p>
          <div className="flex gap-10">
            <p>I Know : {iKnow}</p>
            <p>I Don’t Know : {iDontKnow}</p>
          </div>
          <Button text={"Retry"} action={() => { window.location.reload() }} />
        </motion.div>
      )}
    </div>
  );
}