const formValues = {}
const pageInfoDiv = document.getElementById("question-info")
const errorInfoDiv = document.getElementById("error-info")
const nextBtn = document.getElementById("next-btn")
const prevBtn = document.getElementById("prev-btn")
const resultDiv = document.getElementById("result-div")
const questionsListDiv = document.getElementsByClassName("question")
const smokingSubQuestions = document.getElementById("is_smoking_yes_options")

let currentQuestion = 0


const updateValue = (event) => {
  console.log("testing ", event.target.name, event.target.value, { event })
  if (event.target.type === "number") {
    formValues[event.target.name] = +(event.target.value || 0)
  } if (event.target.type === "checkbox") {
    const name = event.target.name
    if (!formValues[name]) {
      formValues[name] = []
    }
    if (event.target.checked && !formValues[name].includes(event.target.value)) {
      formValues[name].push(event.target.value)
    } else if (!event.target.checked) {
      formValues[name] = formValues[name].filter((_value) => {
        return _value !== event.target.value
      })
    }
  } else {
    const name = event.target.name
    formValues[name] = event.target.value
    if (name === "is_smoking") {
      if (event.target.value === "yes" && smokingSubQuestions.classList.contains("display-none")) {
        smokingSubQuestions.classList.remove("display-none")
      } else if (!smokingSubQuestions.classList.contains("display-none")){
        smokingSubQuestions.classList.add("display-none")
      }
    }
  }
  console.log(formValues)
}

const getCurrentQuestionFieldNames = () => {
  const childInputs = questionsListDiv[currentQuestion].getElementsByTagName("input")
  let index = 0
  const names = []
  while(index < childInputs.length) {
    const name = childInputs[index].getAttribute("name")
    if (!names.includes(name)) {
      names.push(name)
    }
    index++
  }
  return names
}

const canSubmit = () => {
  const fieldNames = getCurrentQuestionFieldNames()
  let isValid = true
  let index = 0
  if (fieldNames.includes("is_smoking")) {
    console.log('testing ', formValues.is_smoking, smokingSubQuestions.classList.contains("display-none"))
    if (formValues.is_smoking === "yes") {
      if (smokingSubQuestions.classList.contains("display-none")) {
        smokingSubQuestions.classList.remove("display-none")
      }
    } else {
      if (!smokingSubQuestions.classList.contains("display-none")) {
        smokingSubQuestions.classList.add("display-none")
      }
      return formValues.is_smoking
    }
  }
  while (index < fieldNames.length) {
    if (!isValid) {
      break
    }
    if (typeof formValues[fieldNames[index]] === "object") {
      if (Array.isArray(formValues[fieldNames[index]])) {
        isValid = formValues[fieldNames[index]].length > 0
        index++
        continue
      }
    }
    if (typeof formValues[fieldNames[index]] === "number") {
      isValid = true
    } else {
      isValid = Boolean(formValues[fieldNames[index]])
    }
    index++
  }
  return isValid
}

const updatePageInfo = () => {
  if (currentQuestion === 0) {
    prevBtn.setAttribute("disabled", "true")
  } else {
    prevBtn.removeAttribute("disabled")
  }
  pageInfoDiv.innerHTML = (currentQuestion + 1) + "/" + questionsListDiv.length
}

const hideAllQuestions = () => {
  let index = 0
  while (index < questionsListDiv.length) {
    if (!questionsListDiv[index].classList.contains("display-none")) {
      questionsListDiv[index].classList.add("display-none")
    }
    index++
  }
}
const showQuestion = (index) => {
  if (questionsListDiv[index].classList.contains("display-none")) {
    questionsListDiv[index].classList.remove("display-none")
  }
}

const setError = (errorMessage) => {
  errorInfoDiv.innerHTML = errorMessage
}

const showCurrentQuestion = () => {
  hideAllQuestions()
  showQuestion(currentQuestion)
  updatePageInfo()
}
const handleSubmit = () => {
  hideAllQuestions()
  resultDiv.classList.remove("display-none")
  pageInfoDiv.innerHTML = "Submitted"
}
const handleNext = () => {
  if (!canSubmit()) {
    setError("Value is required")
    return
  }
  setError("")
  if (currentQuestion < (questionsListDiv.length - 1)) {
    currentQuestion++
    showCurrentQuestion()
  } else {
    currentQuestion = questionsListDiv.length
    handleSubmit()
  }
}
const handlePrev = () => {
  if (!resultDiv.classList.contains("display-none")) {
    resultDiv.classList.add("display-none")
  }
  if (currentQuestion > 0) {
    currentQuestion--
    showCurrentQuestion()
    if (!canSubmit()) {
      setError("Value is required")
      return
    }
  }
}

showCurrentQuestion()