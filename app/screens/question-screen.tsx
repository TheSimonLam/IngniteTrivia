import * as React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View, FlatList, TouchableOpacity, Alert, Button } from "react-native"
import { RadioButtons } from "react-native-radio-buttons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Screen, Text } from "../components"
import { useStores } from "../models/root-store"
import { color, spacing } from "../theme"
import { QuestionStore } from "../models/question-store"
import { Question } from "../models/question"

export interface QuestionScreenProps extends NativeStackNavigationProp<{}> {
  questionStore: QuestionStore
}

export interface QuestionScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: 0,
  marginBottom: spacing.medium,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
  color: "black"
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.tiny,
}

const ANSWER: TextStyle = {
  fontSize: 12,
  color: "black"
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.medium,
  backgroundColor: color.palette.angry,
  marginTop: spacing.medium,
}

export const QuestionScreen: React.FunctionComponent<QuestionScreenProps> = observer((props) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { questionStore } = useStores();
  const { questions } = questionStore;
  let count = 0;

  React.useEffect(() => {
    count += 1;
    fetchQuestions()
    console.tron.log(count)
  }, []);

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}
    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={answer} />
      </TouchableOpacity>
    )
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
        <RadioButtons
          options={question.allAnswers}
          onSelection={guess => onPressAnswer(question, guess)}
          selectedOption={question.guess}
          renderOption={renderAnswer}
        />
        <Button
          style={CHECK_ANSWER}
          onPress={() => checkAnswer(question)}
          text={"Check Answer!"}
          title="Reveal answer"
        />
      </View>
    )
  }

  return (
    <Screen style={ROOT} preset="scroll">
        <View style={HEADER_CONTAINER}>
          <Text preset="header" tx="questionScreen.header" />
        </View>
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
          onRefresh={fetchQuestions}
          refreshing={refreshing}
        />
      </Screen>
  )
})
