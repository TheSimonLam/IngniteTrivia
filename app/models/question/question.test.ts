import { QuestionModel, Question } from "./question"

test("can be created", () => {
  const instance: Question = QuestionModel.create({})

  expect(instance).toBeTruthy()
})