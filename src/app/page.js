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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <h1 className="text-4xl font-bold">Choose a Topic</h1>
        <div className="grid grid-cols-2 gap-10">
          {Object.keys(flashcardSets).map((category) => (
            <Button key={category} text={category} action={() => setTopic(category)}></Button>
          ))}
        </div>
      </div>
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
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          <Card qusetion={currentCard.question} answer={currentCard.answer} />
          <div className="flex gap-4">
            <Button text={"I Know This"} action={() => handleNext()} isDisabled={currentIndex > flashcards.length - 1} />
            <Button text={"Don’t Know"} action={() => handleNext()} isDisabled={currentIndex > flashcards.length - 1} />
          </div>
        </div>
      }
      {currentIndex > flashcards.length - 1 && (
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
        <p className="text-green-600 font-semibold">All cards completed!</p>
        <Button text={"Retry"} action={()=>{window.location.reload()}}/>
        </div>
      )}
    </div>
  );
}