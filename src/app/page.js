"use client";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import { motion } from "framer-motion";
import { flashcardSets } from "@/data/flashcardSets";

export default function FlashcardViewer() {
  const [topic, setTopic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [questionArray, setquestionArray] = useState([])

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < flashcardSets[topic].length - 1) {
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
            <Button key={category} text={category} onClick={() => setTopic(category)}></Button>
          ))}
        </div>
      </div>
    );
  }

  const flashcards = questionArray;
  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

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

      <Card className="w-full max-w-md cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <CardContent className="p-8 text-center text-xl font-medium">
          {flipped ? currentCard.answer : currentCard.question}
        </CardContent>
      </Card>
      }

      <div className="flex gap-4">
        <Button onClick={handleNext} disabled={currentIndex >= flashcards.length - 1}>
          I Know This
        </Button>
        <Button onClick={handleNext} disabled={currentIndex >= flashcards.length - 1}>
          Don’t Know
        </Button>
      </div>

      {currentIndex >= flashcards.length - 1 && (
        <p className="text-green-600 font-semibold">All cards completed!</p>
      )}
    </div>
  );
}