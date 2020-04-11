import { QuestionStoreModel, QuestionStore } from "./question-store"

test("can be created", () => {
  const instance: QuestionStore = QuestionStoreModel.create({})

  expect(instance).toBeTruthy()
})