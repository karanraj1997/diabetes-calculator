const formValues = {}
const pageInfoDiv = document.getElementById("question-info")
const errorInfoDiv = document.getElementById("error-info")
const nextBtn = document.getElementById("next-btn")
const prevBtn = document.getElementById("prev-btn")
const homeBtn = document.getElementById("home-btn")
const resultDiv = document.getElementById("result-div")
const questionsListDiv = document.getElementsByClassName("question")
const smokingSubQuestions = document.getElementById("is_smoking_yes_options")
const progressBar = document.getElementById("progress-bar-div")
const section = document.getElementsByTagName("section")[0]

let currentQuestion = 0

const valueCalculation = {
  age: (value, allValues) => {
    if (value > 0 && value <= 10) {
      return 10
    }
    else if (value > 10 && value <= 30) {
      return 5
    }
    return 2
  },

  gender: (value, allValues) => {
    if (value === "male") return 5
    if (value === "female") return 7
  },
  height: (value, allValues) => {
    if (value < 150) {
      return 10
    }
    return 5
  },
  weight: (value, allValues) => {
    if (value <50) {
      return 8
    }
    if (value < 80) {
      return 10
    }
    return 5
  },
  ethnicity: (value, allValues) => {
    if (value === "asian") {
      return 10
    }
    if (value === "europeans") {
      return 10
    }
    if (value === "pacific-islands") {
      return 2
    }
    return 0
  },
  is_smoking: (value, allValues) => {
    let total = 10
    if (value=="yes") {
      if (allValues["sticks_per_day_work"] > 10) {
        total -= 4
      }
      if (allValues["sticks_per_day_home"]) {
        total -= 4
      }
      if (allValues["sticks_per_day_other"]) {
        total -= 4
      }
    } else {
      total = total - 5
    }
    return total
  },
  vigorous: (value) => {
    if (value === "none") {
      return 10
    }
    if (value === "less_10") {
      return 8
    }
    if (value === "10to30") {
      return 6
    }
    if (value === "31to50") {
      return 4
    }
    if (value === "51to75") {
      return 2
    }
    return 0
  },
  moderate: (value) => {
    if (value === "none") {
      return 10
    }
    if (value === "<10") {
      return 8
    }
    if (value === "10>50") {
      return 6
    }
    if (value === "51>90") {
      return 4
    }
    if (value === "91>150") {
      return 2
    }
    return 0
  },
  walking: (value) => {
    if (value === "none") {
      return 0
    }
    if (value === "10to75") {
      return 2
    }
    if (value === "76to150") {
      return 4
    }
    if (value === "151to225") {
      return 6
    }
    if (value === "226to300") {
      return 8
    }
    return 10
  },
  parents_have_diabetes: (value) => {
    if (value === "yes") {
      return 5
    }
    return 10
  },
  have_hypertension: (value) => {
    if (value === "yes") {
      return 5
    }
    return 10
  },
  symptoms: (value) => {
    let total = 10
    if (value.includes("increased thirst")) {
      total -= 2
    }
    if (value.includes("frequent urination")) {
      total -= 2
    }
    if (value.includes("extreme hunger")) {
      total -= 2
    }
    if (value.includes("unexplained weight loss")) {
      total -= 2
    }
    if (value.includes("slow healing sores")) {
      total -= 2
    }
    if (value.includes("frequent infections")) {
      total -= 2
    }
    if (value.includes("numbness or tingling")) {
      total -= 2
    }
    return total
  }
}



// const allInputs = document.getElementsByTagName("section")[0].getElementsByTagName('input')
// let i = 0
// while (allInputs.length > i) {
//   const inputName = allInputs[i].getAttribute("name")
//   console.log(inputName, "<===>", allInputs[i].value)
//   i++
// }

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
      } else if (!smokingSubQuestions.classList.contains("display-none")) {
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
  while (index < childInputs.length) {
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
const updateProgressBar = () => {
  const currentValue = (currentQuestion / questionsListDiv.length) * 100
  progressBar.style = "width: " + currentValue + "%;"
  progressBar.setAttribute("aria-valuenow", currentValue)
  progressBar.setAttribute("aria-valuenow", currentValue)
}

const showNextButton = () => {
  if (nextBtn.classList.contains("display-none")) {
    nextBtn.classList.remove("display-none")
  }
}
const hideNextButton = () => {
  if (!nextBtn.classList.contains("display-none")) {
    nextBtn.classList.add("display-none")
  }
}
const showPrevButton = () => {
  if (prevBtn.classList.contains("display-none")) {
    prevBtn.classList.remove("display-none")
  }
}
const hidePrevButton = () => {
  if (!prevBtn.classList.contains("display-none")) {
    prevBtn.classList.add("display-none")
  }
}

const updatePageInfo = () => {
  if (currentQuestion === 0) {
    hidePrevButton()
    prevBtn.setAttribute("disabled", "true")
  } else {
    prevBtn.removeAttribute("disabled")
    showPrevButton()
  }
  if (currentQuestion === questionsListDiv.length -1 ) {
    nextBtn.innerText = "Submit"
    if (nextBtn.classList.contains("btn-primary")) {
      nextBtn.classList.remove("btn-primary")
    }
    if (!nextBtn.classList.contains("btn-success")) {
      nextBtn.classList.add("btn-success")
    }
  } else {
    nextBtn.innerText = "Next"
    if (!nextBtn.classList.contains("btn-primary")) {
      nextBtn.classList.add("btn-primary")
    }
    if (nextBtn.classList.contains("btn-success")) {
      nextBtn.classList.remove("btn-success")
    }
  }
  updateProgressBar()
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

const showSection = () => {
  if (section.classList.contains("display-none")) {
    section.classList.remove("display-none")
  }
}
const hideSection = () => {
  if (!section.classList.contains("display-none")) {
    section.classList.add("display-none")
  }
}


const showHomeButton = () => {
  if (homeBtn.classList.contains("display-none")) {
    homeBtn.classList.remove("display-none")
  }
  hideNextButton()
  hidePrevButton()

}
const hideHomeButton = () => {
  if (!homeBtn.classList.contains("display-none")) {
    homeBtn.classList.add("display-none")
  }
  showPrevButton()
  showNextButton()
}
const handleSubmit = () => {
  hideAllQuestions()
  showHomeButton()
  hideSection()
  updateProgressBar()
  resultDiv.classList.remove("display-none")
  const percentage = document.getElementById("percentage")
  let totalValue = 0
  Object.keys(formValues).forEach((key) => {
    totalValue += valueCalculation[key]?.(formValues[key], formValues) || 0
  })

  percentage.innerHTML = totalValue
  pageInfoDiv.innerHTML = ""
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
  hideHomeButton()
  showSection()
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

const navigateHome = () => {
  window.location.href = "/"
}

showCurrentQuestion()
hideHomeButton()
hidePrevButton()