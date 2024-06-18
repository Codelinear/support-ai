import { questions } from "@/constants/array";

export const getRandomSuggestions = (): string[] => {
  let suggestions: string[] = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * questions.length);

    const randomQuestion = questions[randomIndex];

    if (!suggestions.includes(randomQuestion)) {
      suggestions.push(questions[randomIndex]);
    }
  }

  return suggestions;
};
